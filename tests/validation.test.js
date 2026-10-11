import test from "node:test";
import assert from "node:assert/strict";
import { validId, contactErrors } from "../server/validation.js";
const valid = {
  name: "Camille",
  email: "camille@example.com",
  subject: "Devis",
  message: "Bonjour, je souhaite un devis.",
};
test("un message complet est accepté", () =>
  assert.deepEqual(contactErrors(valid), {}));
test("les champs absents et les objets sont rejetés", () => {
  assert.equal(Object.keys(contactErrors({})).length, 4);
  assert.ok(contactErrors({ ...valid, email: {} }).email);
});
test("les e-mails invalides et injections d’en-têtes sont rejetés", () => {
  assert.ok(contactErrors({ ...valid, email: "abc" }).email);
  assert.ok(
    contactErrors({ ...valid, subject: "Devis\r\nBcc: x@example.com" }).subject,
  );
});
test("les tailles et identifiants sont limités", () => {
  assert.ok(contactErrors({ ...valid, message: "x".repeat(5001) }).message);
  assert.equal(validId("1"), true);
  for (const id of ["0", "-1", "1 OR 1=1", "1.5", "1000000000"])
    assert.equal(validId(id), false);
});
