import { PATIENCE_MAX } from "../config.js";

// Vieillit d'un tick les voyageurs d'une file et retire ceux qui ont trop
// attendu (comptés comme perdus). Ne mute pas l'entrée.
export function vieillirFile(attente) {
  const restants = [];
  let perdus = 0;
  attente.forEach((t) => {
    const age = t.age + 1;
    if (age >= PATIENCE_MAX) perdus++;
    else restants.push({ f: t.f, age });
  });
  return { attente: restants, perdus };
}
