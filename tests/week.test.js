import { test } from "node:test";
import assert from "node:assert/strict";
import { createRng } from "../src/rules/rng.js";
import { finDeJournee, formeNouvelleStation, stationBonus, placerStation } from "../src/rules/week.js";
import { MARGE_X, MARGE_Y, CARTE_W, CARTE_H, DISTANCE_MIN_STATIONS } from "../src/config.js";

test("la journée se termine à 24h", () => {
  assert.equal(finDeJournee(24 * 60), true);
  assert.equal(finDeJournee(23 * 60), false);
});

test("une station supplémentaire ouvre les semaines paires", () => {
  assert.equal(stationBonus(2), true);
  assert.equal(stationBonus(3), false);
});

test("aucune station triangle n'ouvre avant la semaine 3", () => {
  const rng = createRng(7);
  for (let n = 0; n < 200; n++) assert.equal(formeNouvelleStation(rng, 2), null);
});

test("une nouvelle station tombe dans les marges et respecte la distance minimale", () => {
  const stations = [{ x: 200, y: 150 }];
  const { x, y } = placerStation(createRng(3), stations);
  assert.ok(x >= MARGE_X && x <= CARTE_W - MARGE_X);
  assert.ok(y >= MARGE_Y && y <= CARTE_H - MARGE_Y);
  assert.ok(Math.hypot(200 - x, 150 - y) >= DISTANCE_MIN_STATIONS);
});
