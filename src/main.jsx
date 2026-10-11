import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useNavigate,
  useParams,
  useSearchParams,
  useLocation,
} from "react-router-dom";
import "./style.scss";

async function api(url, options) {
  const response = await fetch("/api" + url, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Une erreur est survenue.");
  return data;
}
function useData(url) {
  const [state, setState] = useState({ data: null, error: "" });
  useEffect(() => {
    let active = true;
    setState({ data: null, error: "" });
    api(url)
      .then((data) => {
        if (active) setState({ data, error: "" });
      })
      .catch((error) => {
        if (active) setState({ data: null, error: error.message });
      });
    return () => {
      active = false;
    };
  }, [url]);
  return state;
}
function Meta({ title, description }) {
  useEffect(() => {
    document.title = title + " | Trouve ton artisan";
    document.querySelector('meta[name="description"]').content = description;
  }, [title, description]);
  return null;
}
function Status({ error }) {
  return error ? (
    <p role="alert" className="alert alert-danger">
      {error}
    </p>
  ) : (
    <p role="status">Chargement…</p>
  );
}
function Rating({ value }) {
  const note = Number(value);
  return (
    <p className="rating" aria-label={"Note : " + note + " sur 5"}>
      <span aria-hidden="true" className="stars">
        <span>★★★★★</span>
        <span className="filled" style={{ width: (note / 5) * 100 + "%" }}>
          ★★★★★
        </span>
      </span>
      <span aria-hidden="true">{note.toLocaleString("fr-FR")} / 5</span>
    </p>
  );
}
function Card({ artisan }) {
  return (
    <div className="col-md-6 col-lg-4">
      <Link className="card artisan-card h-100" to={"/artisan/" + artisan.id}>
        <div className="card-body">
          <p className="eyebrow">{artisan.specialty.name}</p>
          <h3>{artisan.name}</h3>
          <Rating value={artisan.rating} />
          <p className="mb-0">{artisan.city}</p>
          <span className="card-link-text">Voir la fiche →</span>
        </div>
      </Link>
    </div>
  );
}
function Cards({ data }) {
  return (
    <div className="row g-4">
      {data.map((a) => (
        <Card key={a.id} artisan={a} />
      ))}
    </div>
  );
}
function Header() {
  const { data, error } = useData("/categories");
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  return (
    <header>
      <div className="container header-top">
        <Link to="/" aria-label="Trouve ton artisan - Accueil">
          <img
            src="/Logo.png"
            className="logo"
            alt="Trouve ton artisan ! Avec la région Auvergne-Rhône-Alpes"
          />
        </Link>
        <form
          className="search"
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            navigate("/artisans?q=" + encodeURIComponent(search.trim()));
          }}
        >
          <label htmlFor="search">Rechercher un artisan par son nom</label>
          <div className="input-group">
            <input
              id="search"
              className="form-control"
              type="search"
              maxLength="100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Nom de l’artisan"
            />
            <button className="btn btn-primary">Rechercher</button>
          </div>
        </form>
      </div>
      <nav aria-label="Catégories d’artisanat">
        <div className="container category-menu">
          {data ? (
            data.map((c) => (
              <NavLink key={c.id} to={"/categorie/" + c.id}>
                {c.name}
              </NavLink>
            ))
          ) : (
            <Status error={error} />
          )}
        </div>
      </nav>
    </header>
  );
}
const legalPages = {
  "mentions-legales": "Mentions légales",
  "donnees-personnelles": "Données personnelles",
  accessibilite: "Accessibilité",
  cookies: "Cookies",
};
function Footer() {
  return (
    <footer>
      <div className="container row-footer">
        <div>
          <p className="footer-title">Auvergne-Rhône-Alpes</p>
          <address>
            101 cours Charlemagne
            <br />
            CS 20033
            <br />
            69269 LYON CEDEX 02
            <br />
            France
            <br />
            <a href="tel:+33426734000">+33 (0)4 26 73 40 00</a>
          </address>
        </div>
        <nav aria-label="Informations légales">
          {Object.entries(legalPages).map(([slug, name]) => (
            <Link key={slug} to={"/" + slug}>
              {name}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
function Home() {
  const { data, error } = useData("/artisans?top=true");
  const steps = [
    "Choisir la catégorie d’artisanat dans le menu.",
    "Choisir un artisan.",
    "Le contacter via le formulaire de contact.",
    "Une réponse sera apportée sous 48h.",
  ];
  return (
    <>
      <Meta
        title="Accueil"
        description="Trouvez votre artisan en Auvergne-Rhône-Alpes : bâtiment, services, fabrication et alimentation."
      />
      <section className="hero">
        <div className="container">
          <p className="eyebrow">Le savoir-faire près de chez vous</p>
          <h1>
            Trouvez l’artisan
            <br />
            qui vous correspond.
          </h1>
          <p>
            Les artisans d’Auvergne-Rhône-Alpes vous accompagnent dans vos
            projets.
          </p>
          <Link to="/artisans" className="btn btn-primary">
            Découvrir les artisans
          </Link>
        </div>
      </section>
      <section className="container section">
        <h2>Comment trouver mon artisan ?</h2>
        <ol className="steps">
          {steps.map((s, i) => (
            <li key={s}>
              <span className="step-number" aria-hidden="true">
                {i + 1}
              </span>
              <p>{s}</p>
            </li>
          ))}
        </ol>
      </section>
      <section className="container section">
        <p className="eyebrow">Notre sélection</p>
        <h2>Les artisans du mois</h2>
        {data ? <Cards data={data} /> : <Status error={error} />}
      </section>
    </>
  );
}
function List() {
  const { id } = useParams();
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const categories = useData("/categories");
  const { data, error } = useData(
    "/artisans?" +
      (id
        ? "category=" + encodeURIComponent(id)
        : "q=" + encodeURIComponent(q)),
  );
  const category = categories.data?.find((c) => String(c.id) === id);
  if (id && categories.data && !category) return <NotFound />;
  const title = id
    ? category?.name || "Artisans"
    : q
      ? "Recherche : " + q
      : "Tous les artisans";
  return (
    <section className="container section">
      <Meta
        title={title}
        description={"Découvrez les artisans en Auvergne-Rhône-Alpes. " + title}
      />
      <Link to="/">Accueil</Link>
      <h1 className="mt-4">{title}</h1>
      {data ? (
        <>
          {data.length ? (
            <>
              <p>
                {data.length} artisan{data.length > 1 ? "s" : ""}
              </p>
              <h2 className="visually-hidden">Artisans disponibles</h2>
              <Cards data={data} />
            </>
          ) : (
            <p role="status">Aucun artisan ne correspond à votre recherche.</p>
          )}
        </>
      ) : (
        <Status error={error} />
      )}
    </section>
  );
}
function Contact({ id }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setStatus("");
    const fields = Object.fromEntries(new FormData(e.currentTarget));
    const form = e.currentTarget;
    try {
      const result = await api("/artisans/" + id + "/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      setStatus(result.message);
      form.reset();
    } catch (error) {
      setStatus(error.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="contact-panel">
      <h2>Contacter cet artisan</h2>
      <p>
        Tous les champs sont obligatoires. Une réponse sera apportée sous 48h.
      </p>
      <form onSubmit={submit}>
        {[
          ["name", "Nom", "text", 100],
          ["email", "Email", "email", 254],
          ["subject", "Objet", "text", 150],
        ].map(([name, label, type, max]) => (
          <div className="mb-3" key={name}>
            <label className="form-label" htmlFor={name}>
              {label}
            </label>
            <input
              className="form-control"
              id={name}
              name={name}
              type={type}
              maxLength={max}
              autoComplete={
                name === "name" ? "name" : name === "email" ? "email" : "off"
              }
              required
            />
          </div>
        ))}
        <label className="form-label" htmlFor="message">
          Message
        </label>
        <textarea
          className="form-control mb-3"
          id="message"
          name="message"
          rows="6"
          maxLength="5000"
          required
        />
        <button className="btn btn-primary" disabled={busy}>
          {busy ? "Envoi en cours…" : "Envoyer le message"}
        </button>
        <p className="mt-3" role="status" aria-live="polite">
          {status}
        </p>
      </form>
    </section>
  );
}
function Detail() {
  const { id } = useParams();
  const { data, error } = useData("/artisans/" + encodeURIComponent(id));
  if (error === "Artisan introuvable." || !/^[1-9][0-9]{0,8}$/.test(id))
    return <NotFound />;
  if (!data)
    return (
      <section className="container section">
        <Status error={error} />
      </section>
    );
  return (
    <section className="container section">
      <Meta
        title={data.name}
        description={
          data.name +
          " : " +
          data.specialty.name +
          " à " +
          data.city +
          ". Consultez sa fiche et contactez cet artisan."
        }
      />
      <Link to={"/categorie/" + data.specialty.category.id}>
        ← {data.specialty.category.name}
      </Link>
      <div className="row g-4 mt-2">
        <div className="col-lg-6">
          <img
            className="artisan-image"
            src={data.image || "/artisan.svg"}
            alt={"Illustration de la fiche de " + data.name}
          />
          <p className="eyebrow mt-4">{data.specialty.name}</p>
          <h1>{data.name}</h1>
          <Rating value={data.rating} />
          <p>{data.city}</p>
          <h2>À propos</h2>
          <p>{data.about}</p>
          {/^https?:\/\//.test(data.website || "") && (
            <a href={data.website} target="_blank" rel="noopener noreferrer">
              Visiter le site de l’artisan (nouvel onglet)
            </a>
          )}
        </div>
        <div className="col-lg-6">
          <Contact key={id} id={id} />
        </div>
      </div>
    </section>
  );
}
function Legal({ title }) {
  return (
    <section className="container section">
      <Meta title={title} description={title + " - Page en construction."} />
      <h1>{title}</h1>
      <p>Page en construction</p>
    </section>
  );
}
function NotFound() {
  return (
    <section className="container section not-found">
      <Meta
        title="Page non trouvée"
        description="Cette page est introuvable. Revenez à l’accueil pour trouver votre artisan."
      />
      <img src="/404.svg" alt="Illustration : panneau 404" />
      <h1>Page non trouvée</h1>
      <p>La page demandée n’existe pas.</p>
      <Link to="/" className="btn btn-primary">
        Retour à l’accueil
      </Link>
    </section>
  );
}
function App() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [location.pathname, location.search]);
  return (
    <>
      <a className="skip-link" href="#main">
        Aller au contenu
      </a>
      <Header />
      <main id="main" tabIndex="-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/artisans" element={<List />} />
          <Route path="/categorie/:id" element={<List />} />
          <Route path="/artisan/:id" element={<Detail />} />
          {Object.entries(legalPages).map(([slug, title]) => (
            <Route
              key={slug}
              path={"/" + slug}
              element={<Legal title={title} />}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);
