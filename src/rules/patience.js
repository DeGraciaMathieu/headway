import { PATIENCE_MAX, MAX_BLOQUE } from "../config.js";

// Vieillit d'un tick les voyageurs d'une file. Ceux qui ont trop attendu
// partent (perdus) et bloquent chacun, définitivement, un emplacement de la
// station — dans la limite de MAX_BLOQUE. Ne mute pas l'entrée.
export function vieillirFile(attente, bloque) {
  const restants = [];
  let perdus = 0;
  attente.forEach((t) => {
    const age = t.age + 1;
    if (age >= PATIENCE_MAX) perdus++;
    else restants.push({ f: t.f, age });
  });
  return { attente: restants, perdus, bloque: Math.min(MAX_BLOQUE, bloque + perdus) };
}
