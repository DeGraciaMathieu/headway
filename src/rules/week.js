import {
  MINUTES_PAR_JOUR,
  PROBA_TRIANGLE,
  SEMAINE_TRIANGLE_MIN,
  MARGE_X,
  MARGE_Y,
  CARTE_W,
  CARTE_H,
  DISTANCE_MIN_STATIONS,
  ESSAIS_PLACEMENT_MAX,
} from "../config.js";

// La journée est terminée quand l'horloge atteint 24h.
export function finDeJournee(horloge) {
  return horloge >= MINUTES_PAR_JOUR;
}

// Forme de la station ouverte en fin de semaine : un triangle est possible à
// partir de la semaine 3, sinon forme par défaut (null).
export function formeNouvelleStation(rng, semaine) {
  return semaine >= SEMAINE_TRIANGLE_MIN && rng() < PROBA_TRIANGLE ? "triangle" : null;
}

// Une station supplémentaire ouvre une semaine sur deux.
export function stationBonus(semaine) {
  return semaine % 2 === 0;
}

// Position d'une nouvelle station : tirage dans les marges de la carte
// respectant la distance minimale avec les stations existantes.
export function placerStation(rng, stations) {
  const rnd = (a, b) => a + rng() * (b - a);
  let x, y, ok, essais = 0;
  do {
    x = rnd(MARGE_X, CARTE_W - MARGE_X);
    y = rnd(MARGE_Y, CARTE_H - MARGE_Y);
    ok = true;
    for (let i = 0; i < stations.length; i++) {
      if (Math.hypot(stations[i].x - x, stations[i].y - y) < DISTANCE_MIN_STATIONS) { ok = false; break; }
    }
    essais++;
  } while (!ok && essais < ESSAIS_PLACEMENT_MAX);
  return { x, y };
}
