import { test } from "node:test";
import assert from "node:assert/strict";
import { createRng } from "../src/rules/rng.js";
import { estHeurePointe, probaApparition, formeVoyageur } from "../src/rules/spawn.js";
import { FACTEUR_HEURE_POINTE } from "../src/config.js";

test("les heures de pointe couvrent le matin et le soir", () => {
  assert.equal(estHeurePointe(8 * 60), true);
  assert.equal(estHeurePointe(17 * 60), true);
  assert.equal(estHeurePointe(12 * 60), false);
});

test("l'apparition est plus probable en heure de pointe", () => {
  assert.equal(probaApparition(1, true), probaApparition(1, false) * FACTEUR_HEURE_POINTE);
});

test("le triangle n'apparaît pas avant la semaine 3", () => {
  const rng = createRng(1);
  for (let n = 0; n < 200; n++) assert.notEqual(formeVoyageur(rng, 2, "rond"), "triangle");
});

test("le triangle peut apparaître à partir de la semaine 3", () => {
  const rng = createRng(1);
  let vuTriangle = false;
  for (let n = 0; n < 500 && !vuTriangle; n++) {
    if (formeVoyageur(rng, 3, "rond") === "triangle") vuTriangle = true;
  }
  assert.equal(vuTriangle, true);
});

test("un voyageur ne cible jamais la forme de sa station de départ", () => {
  const rng = createRng(2);
  for (let n = 0; n < 500; n++) {
    assert.notEqual(formeVoyageur(rng, 3, "carre"), "carre");
  }
});
