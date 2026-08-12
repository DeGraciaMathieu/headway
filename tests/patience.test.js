import { test } from "node:test";
import assert from "node:assert/strict";
import { vieillirFile } from "../src/rules/patience.js";
import { PATIENCE_MAX } from "../src/config.js";

test("un voyageur vieillit d'un tick à chaque appel", () => {
  const { attente, perdus } = vieillirFile([{ f: "rond", age: 3 }]);
  assert.deepEqual(attente, [{ f: "rond", age: 4 }]);
  assert.equal(perdus, 0);
});

test("un voyageur qui a trop attendu quitte la file et compte comme perdu", () => {
  const { attente, perdus } = vieillirFile([{ f: "rond", age: PATIENCE_MAX - 1 }]);
  assert.deepEqual(attente, []);
  assert.equal(perdus, 1);
});
