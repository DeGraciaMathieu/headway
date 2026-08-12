import { VITESSE_RAME, SEUIL_ARRET } from "../config.js";

// Avance une rame d'un tick sur sa ligne et applique le demi-tour aux terminus.
// Rend la nouvelle position et la nouvelle direction, sans muter l'entrée.
export function avancerRame(pos, dir, nbStations) {
  let np = pos + dir * VITESSE_RAME;
  let nd = dir;
  if (np >= nbStations - 1) { np = nbStations - 1; nd = -1; }
  if (np <= 0) { np = 0; nd = 1; }
  return { pos: np, dir: nd };
}

// Indice de la station à quai si la rame y est alignée, sinon -1.
export function indexArret(pos) {
  const i = Math.round(pos);
  return Math.abs(pos - i) < SEUIL_ARRET ? i : -1;
}
