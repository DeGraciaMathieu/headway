import { test } from "node:test";
import assert from "node:assert/strict";
import { distancesVersForme } from "../src/rules/routing.js";

// Réseau : 0(rond)—1(carré) sur la ligne A, 1(carré)—2(triangle) sur la ligne B.
// La station 1 est l'échange.
const stations = [{ forme: "rond" }, { forme: "carre" }, { forme: "triangle" }];
const lignes = [{ id: 0, stations: [0, 1] }, { id: 1, stations: [1, 2] }];

test("une station de la forme cible est à distance 0", () => {
  assert.deepEqual(distancesVersForme(stations, lignes, "rond"), [0, 1, 2]);
});

test("la distance compte les correspondances nécessaires", () => {
  // triangle est en 2 : la station 0 y accède en deux trajets (via l'échange 1).
  assert.deepEqual(distancesVersForme(stations, lignes, "triangle"), [2, 1, 0]);
});

test("une forme absente du réseau est inatteignable (Infinity)", () => {
  const d = distancesVersForme([{ forme: "rond" }, { forme: "carre" }], [{ id: 0, stations: [0, 1] }], "triangle");
  assert.deepEqual(d, [Infinity, Infinity]);
});

test("une station qu'aucune ligne active ne relie reste inatteignable", () => {
  const s = [{ forme: "rond" }, { forme: "carre" }, { forme: "triangle" }];
  const l = [{ id: 0, stations: [0, 1] }]; // la station 2 (triangle) n'est sur aucune ligne
  assert.equal(distancesVersForme(s, l, "triangle")[0], Infinity);
});
