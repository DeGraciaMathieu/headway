import { test } from "node:test";
import assert from "node:assert/strict";
import { vieillirFile } from "../src/rules/patience.js";
import { PATIENCE_MAX, MAX_BLOQUE } from "../src/config.js";

test("un voyageur vieillit d'un tick à chaque appel", () => {
  const { attente, perdus, bloque } = vieillirFile([{ f: "rond", age: 3 }], 0);
  assert.deepEqual(attente, [{ f: "rond", age: 4 }]);
  assert.equal(perdus, 0);
  assert.equal(bloque, 0);
});

test("un voyageur qui a trop attendu part (perdu) et bloque un emplacement", () => {
  const { attente, perdus, bloque } = vieillirFile([{ f: "rond", age: PATIENCE_MAX - 1 }], 0);
  assert.deepEqual(attente, []);
  assert.equal(perdus, 1);
  assert.equal(bloque, 1);
});

test("les emplacements bloqués d'une station sont plafonnés", () => {
  const file = Array.from({ length: 3 }, () => ({ f: "rond", age: PATIENCE_MAX - 1 }));
  const { bloque } = vieillirFile(file, MAX_BLOQUE);
  assert.equal(bloque, MAX_BLOQUE);
});
