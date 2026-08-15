import { test } from "node:test";
import assert from "node:assert/strict";
import { traiterArret } from "../src/rules/boarding.js";
import { distancesVersForme } from "../src/rules/routing.js";

// Réseau de référence : ligne A = 0(rond)—1(carré), ligne B = 1(carré)—2(triangle).
// Station 1 = échange. Distances : rond [0,1,2], carré [1,0,1], triangle [2,1,0].
const stations = [{ forme: "rond" }, { forme: "carre" }, { forme: "triangle" }];
const A = [0, 1], B = [1, 2];
const CAP = 6; // capacité de la rame pour les cas où elle n'est pas le sujet du test
const dist = {
  rond: distancesVersForme(stations, [{ id: 0, stations: A }, { id: 1, stations: B }], "rond"),
  carre: distancesVersForme(stations, [{ id: 0, stations: A }, { id: 1, stations: B }], "carre"),
  triangle: distancesVersForme(stations, [{ id: 0, stations: A }, { id: 1, stations: B }], "triangle"),
};

test("un voyageur arrive quand la rame atteint une station de sa forme", () => {
  // À bord un voyageur 'rond', la rame de la ligne A s'arrête en 0 (rond).
  const r = traiterArret(["rond"], [], A, 0, dist, CAP);
  assert.equal(r.transportes, 1);
  assert.deepEqual(r.charge, []);
});

test("un voyageur monte si la ligne le rapproche de sa forme", () => {
  // En 0, un voyageur qui veut 'carre' : la ligne A va vers 1 (carré) -> il monte.
  const r = traiterArret([], [{ f: "carre", age: 5 }], A, 0, dist, CAP);
  assert.deepEqual(r.charge, ["carre"]);
  assert.deepEqual(r.attente, []);
});

test("un voyageur ne monte pas dans une ligne qui ne le rapproche pas", () => {
  // En 1, un voyageur qui veut 'triangle' ne doit pas monter dans la ligne A (min A = 1 = dist actuelle).
  const r = traiterArret([], [{ f: "triangle", age: 0 }], A, 1, dist, CAP);
  assert.deepEqual(r.charge, []);
  assert.deepEqual(r.attente, [{ f: "triangle", age: 0 }]);
});

test("un voyageur descend à l'échange pour prendre une correspondance", () => {
  // À bord de la ligne A un voyageur 'triangle', arrêt en 1 (échange) : il descend.
  const r = traiterArret(["triangle"], [], A, 1, dist, CAP);
  assert.equal(r.transportes, 0);
  assert.deepEqual(r.charge, []);
  assert.deepEqual(r.attente, [{ f: "triangle", age: 0 }]);
});

test("la capacité de la rame est respectée", () => {
  // 6 voyageurs 'carre' à bord restent (station 0 = rond, pas leur sortie) ;
  // un 'carre' en attente voudrait monter mais la rame est pleine.
  const pleine = ["carre", "carre", "carre", "carre", "carre", "carre"];
  const r = traiterArret(pleine, [{ f: "carre", age: 0 }], A, 0, dist, CAP);
  assert.equal(r.charge.length, 6);
  assert.deepEqual(r.attente, [{ f: "carre", age: 0 }]);
});

test("une capacité améliorée laisse monter un voyageur de plus", () => {
  // Même configuration que le test précédent, mais capacité portée à 8 :
  // le 7e voyageur monte au lieu de rester à quai.
  const pleine = ["carre", "carre", "carre", "carre", "carre", "carre"];
  const r = traiterArret(pleine, [{ f: "carre", age: 0 }], A, 0, dist, 8);
  assert.equal(r.charge.length, 7);
  assert.deepEqual(r.attente, []);
});

test("fonctionnel : un voyageur atteint sa forme via une correspondance", () => {
  // Voyageur en 0 qui veut 'triangle' (pas de ligne directe). Il doit prendre A
  // jusqu'à l'échange 1, changer, puis B jusqu'à 2.
  let charge = [], attente = [{ f: "triangle", age: 0 }], transportes = 0;

  // Rame A en 0 : le voyageur monte (A le rapproche : dist 2 -> min A = 1).
  let r = traiterArret(charge, attente, A, 0, dist, CAP);
  charge = r.charge; attente = r.attente; transportes += r.transportes;
  assert.deepEqual(charge, ["triangle"]);

  // Rame A en 1 (échange) : il descend pour la correspondance.
  r = traiterArret(charge, attente, A, 1, dist, CAP);
  charge = r.charge; attente = r.attente; transportes += r.transportes;
  assert.deepEqual(charge, []);
  assert.deepEqual(attente, [{ f: "triangle", age: 0 }]);

  // Rame B en 1 : il monte (B le rapproche : dist 1 -> min B = 0).
  r = traiterArret(charge, attente, B, 1, dist, CAP);
  charge = r.charge; attente = r.attente; transportes += r.transportes;
  assert.deepEqual(charge, ["triangle"]);

  // Rame B en 2 (triangle) : il arrive.
  r = traiterArret(charge, attente, B, 2, dist, CAP);
  transportes += r.transportes;
  assert.equal(transportes, 1);
});
