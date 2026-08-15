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

test("un voyageur ne cible jamais une forme absente du réseau", () => {
  // Tant qu'aucune station triangle n'est ouverte, aucun voyageur triangle.
  const rng = createRng(1);
  const presentes = ["rond", "carre"];
  for (let n = 0; n < 200; n++) assert.notEqual(formeVoyageur(rng, "rond", presentes), "triangle");
});

test("un voyageur peut cibler le triangle dès qu'une station triangle existe", () => {
  const rng = createRng(1);
  const presentes = ["rond", "carre", "triangle"];
  let vuTriangle = false;
  for (let n = 0; n < 500 && !vuTriangle; n++) {
    if (formeVoyageur(rng, "rond", presentes) === "triangle") vuTriangle = true;
  }
  assert.equal(vuTriangle, true);
});

test("un voyageur ne cible jamais la forme de sa station de départ", () => {
  const rng = createRng(2);
  const presentes = ["rond", "carre", "triangle"];
  for (let n = 0; n < 500; n++) {
    assert.notEqual(formeVoyageur(rng, "carre", presentes), "carre");
  }
});

test("aucune cible si la seule forme du réseau est celle de la station", () => {
  const rng = createRng(3);
  assert.equal(formeVoyageur(rng, "rond", ["rond"]), null);
});
