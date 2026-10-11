export function validId(value) {
  return /^[1-9][0-9]{0,8}$/.test(String(value));
}
export function contactErrors(body) {
  const errors = {};
  const limits = { name: 100, email: 254, subject: 150, message: 5000 };
  for (const [field, max] of Object.entries(limits)) {
    if (
      typeof body?.[field] !== "string" ||
      !body[field].trim() ||
      body[field].length > max
    )
      errors[field] = "Champ requis ou trop long.";
  }
  if (!errors.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email))
    errors.email = "Adresse e-mail invalide.";
  for (const field of ["name", "email", "subject"]) {
    if (typeof body?.[field] === "string" && /[\r\n]/.test(body[field]))
      errors[field] = "Saut de ligne interdit.";
  }
  return errors;
}
