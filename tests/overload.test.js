import { test } from "node:test";
import assert from "node:assert/strict";
import { prochaineSurcharge, estSaturee } from "../src/rules/overload.js";

test("une station se remplit quand la file atteint le seuil", () => {
  assert.ok(prochaineSurcharge(0, 10) > 0);
});

test("une station se dégonfle quand la file repasse sous le seuil", () => {
  assert.ok(prochaineSurcharge(0.5, 0) < 0.5);
  assert.equal(prochaineSurcharge(0, 0), 0);
});

test("la surcharge ne dépasse jamais 1", () => {
  assert.equal(prochaineSurcharge(1, 14), 1);
});

test("le réseau s'arrête quand une station est saturée", () => {
  assert.equal(estSaturee(1), true);
  assert.equal(estSaturee(0.99), false);
});
