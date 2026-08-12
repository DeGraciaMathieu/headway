import { test } from "node:test";
import assert from "node:assert/strict";
import { tracer, peutAjouterLigne } from "../src/rules/network.js";

test("toucher une nouvelle station l'ajoute au tracé", () => {
  assert.deepEqual(tracer([0, 1], 2), [0, 1, 2]);
});

test("retoucher le terminus le retire", () => {
  assert.deepEqual(tracer([0, 1, 2], 2), [0, 1]);
});

test("toucher une station intermédiaire ne change rien", () => {
  assert.deepEqual(tracer([0, 1, 2], 1), [0, 1, 2]);
});

test("le tracé est plafonné au nombre maximum d'arrêts", () => {
  const pleine = [0, 1, 2, 3, 4, 5, 6, 7];
  assert.deepEqual(tracer(pleine, 8), pleine);
});

test("on ne peut pas dépasser le nombre maximum de lignes", () => {
  assert.equal(peutAjouterLigne(3), true);
  assert.equal(peutAjouterLigne(4), false);
});
