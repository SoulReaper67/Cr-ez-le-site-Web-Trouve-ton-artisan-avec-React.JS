import "dotenv/config";
import express from "express";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import nodemailer from "nodemailer";
import { randomBytes, timingSafeEqual } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Op } from "sequelize";
import { db, Category, Specialty, Artisan } from "./models.js";
import { validId, contactErrors } from "./validation.js";

const base = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 3001);
const origin = new URL(process.env.APP_ORIGIN || "http://localhost:5173")
  .origin;
const app = express();
app.set("trust proxy", Number(process.env.TRUST_PROXY || 0));
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        "upgrade-insecure-requests":
          process.env.NODE_ENV === "production" ? [] : null,
      },
    },
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(
  "/api",
  rateLimit({
    windowMs: 60000,
    limit: 100,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Trop de requêtes. Réessayez dans une minute." },
  }),
);
app.use(
  "/api/artisans/:id/contact",
  rateLimit({
    windowMs: 15 * 60000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { error: "Trop de messages. Réessayez dans 15 minutes." },
  }),
);

// API privée : seul le serveur de l'application possède la clé, jamais React.
const privateApi = express();
const key = randomBytes(32).toString("hex");
privateApi.use(express.json({ limit: "16kb" }));
privateApi.use((req, res, next) => {
  const token = Buffer.from(req.get("x-app-key") || "");
  const expected = Buffer.from(key);
  if (token.length !== expected.length || !timingSafeEqual(token, expected))
    return res.status(403).json({ error: "Accès interdit." });
  next();
});
const include = [{ model: Specialty, include: [Category] }];
const publicAttributes = [
  "id",
  "name",
  "rating",
  "city",
  "about",
  "website",
  "top",
  "image",
];
privateApi.get("/categories", async (req, res) =>
  res.json(await Category.findAll({ order: [["id", "ASC"]] })),
);
privateApi.get("/artisans", async (req, res) => {
  const { category, q, top } = req.query;
  if (
    (category !== undefined && !validId(category)) ||
    (q !== undefined && (typeof q !== "string" || q.length > 100)) ||
    (top !== undefined && top !== "true")
  )
    return res.status(400).json({ error: "Recherche invalide." });
  const where = {};
  if (q?.trim()) where.name = { [Op.substring]: q.trim() };
  if (top === "true") where.top = true;
  const join = [
    {
      model: Specialty,
      ...(category ? { where: { categoryId: Number(category) } } : {}),
      include: [Category],
    },
  ];
  res.json(
    await Artisan.findAll({
      attributes: publicAttributes,
      where,
      include: join,
      order: [["name", "ASC"]],
    }),
  );
});
privateApi.get("/artisans/:id", async (req, res) => {
  if (!validId(req.params.id))
    return res.status(404).json({ error: "Artisan introuvable." });
  const artisan = await Artisan.findByPk(req.params.id, {
    attributes: publicAttributes,
    include,
  });
  if (!artisan) return res.status(404).json({ error: "Artisan introuvable." });
  res.json(artisan);
});
const mailer = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      requireTLS: process.env.NODE_ENV === "production" && process.env.SMTP_SECURE !== "true",
      disableFileAccess: true,
      disableUrlAccess: true,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    })
  : null;
privateApi.post("/artisans/:id/contact", async (req, res) => {
  if (!validId(req.params.id))
    return res.status(404).json({ error: "Artisan introuvable." });
  const errors = contactErrors(req.body);
  if (Object.keys(errors).length)
    return res
      .status(400)
      .json({ error: "Vérifiez les champs.", fields: errors });
  const artisan = await Artisan.findByPk(req.params.id);
  if (!artisan) return res.status(404).json({ error: "Artisan introuvable." });
  if (!mailer || !process.env.SMTP_FROM)
    return res
      .status(503)
      .json({ error: "L'envoi de messages est temporairement indisponible." });
  // Le destinataire est lu en base, il ne peut pas être choisi par le visiteur.
  await mailer.sendMail({
    from: process.env.SMTP_FROM,
    to: artisan.email,
    replyTo: req.body.email.trim(),
    subject: req.body.subject.trim(),
    text:
      "Nom : " +
      req.body.name.trim() +
      "\nE-mail : " +
      req.body.email.trim() +
      "\n\n" +
      req.body.message.trim(),
  });
  res.json({
    message: "Votre message a été envoyé. Une réponse sera apportée sous 48h.",
  });
});
privateApi.use((req, res) =>
  res.status(404).json({ error: "Route introuvable." }),
);
function onError(err, req, res, next) {
  console.error("Erreur serveur :", err.name || "Error");
  res
    .status(
      err.type === "entity.too.large"
        ? 413
        : err instanceof SyntaxError
          ? 400
          : 500,
    )
    .json({
      error: "La requête ne peut pas être traitée. Réessayez plus tard.",
    });
}
privateApi.use(onError);

await db.authenticate();
const privateServer = privateApi.listen(0, "127.0.0.1");
await new Promise((resolve) => privateServer.once("listening", resolve));
const privatePort = privateServer.address().port;
// La passerelle rend uniquement les routes de consultation et de contact publiques.
app.use("/api", async (req, res) => {
  const allowed =
    (req.method === "GET" &&
      /^\/(categories|artisans)(\/[1-9][0-9]{0,8})?$/.test(req.path)) ||
    (req.method === "POST" &&
      /^\/artisans\/[1-9][0-9]{0,8}\/contact$/.test(req.path));
  if (!allowed) return res.status(404).json({ error: "Route introuvable." });
  if (req.method === "POST" && req.get("origin") !== origin)
    return res.status(403).json({ error: "Origine interdite." });
  const response = await fetch("http://127.0.0.1:" + privatePort + req.url, {
    method: req.method,
    headers: { "x-app-key": key, "content-type": "application/json" },
    ...(req.method === "POST" ? { body: JSON.stringify(req.body) } : {}),
  });
  res.status(response.status).json(await response.json());
});
app.use(express.static(path.join(base, "dist")));
app.get("/{*path}", (req, res) =>
  res.sendFile(path.join(base, "dist/index.html")),
);
app.use(onError);
const server = app.listen(port, () =>
  console.log("Application : http://localhost:" + port),
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () =>
    server.close(async () => {
      privateServer.close();
      await db.close();
      process.exit(0);
    }),
  );
