import { test } from "node:test";
import assert from "node:assert/strict";
import { avancerRame, indexArret } from "../src/rules/trains.js";

test("une rame repart en sens inverse une fois le terminus atteint", () => {
  const { pos, dir } = avancerRame(2, 1, 3);
  assert.equal(pos, 2);
  assert.equal(dir, -1);
});

test("une rame repart vers l'avant une fois revenue au départ", () => {
  const { pos, dir } = avancerRame(0, -1, 3);
  assert.equal(pos, 0);
  assert.equal(dir, 1);
});

test("une rame est à quai lorsqu'elle est alignée sur une station", () => {
  assert.equal(indexArret(1), 1);
});

test("une rame n'est pas à quai entre deux stations", () => {
  assert.equal(indexArret(1.5), -1);
});
