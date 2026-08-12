import { test } from "node:test";
import assert from "node:assert/strict";
import { formesDesservies, descendre, monter } from "../src/rules/boarding.js";

test("un voyageur descend à une station de sa forme", () => {
  const { charge, descendus } = descendre(["rond", "carre"], "rond");
  assert.deepEqual(charge, ["carre"]);
  assert.equal(descendus, 1);
});

test("une ligne n'embarque que les formes qu'elle dessert", () => {
  const stations = [{ forme: "rond" }, { forme: "carre" }];
  const formes = formesDesservies(stations, [0, 1]);
  const { charge, attente } = monter([], ["triangle", "rond"], formes);
  assert.deepEqual(charge, ["rond"]);
  assert.deepEqual(attente, ["triangle"]);
});

test("une rame n'embarque pas au-delà de sa capacité", () => {
  const formes = { rond: 1 };
  const pleine = ["rond", "rond", "rond", "rond", "rond", "rond"];
  const { charge, attente } = monter(pleine, ["rond"], formes);
  assert.equal(charge.length, 6);
  assert.deepEqual(attente, ["rond"]);
});
