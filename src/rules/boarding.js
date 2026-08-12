import { CAPACITE_RAME } from "../config.js";

// Formes desservies par une ligne : l'ensemble des formes de ses stations.
export function formesDesservies(stations, indices) {
  const set = {};
  indices.forEach((id) => { set[stations[id].forme] = 1; });
  return set;
}

// Descente : les voyageurs à bord dont la forme est celle de la station
// descendent. Rend la charge restante et le nombre de descendus.
export function descendre(charge, formeStation) {
  const restants = charge.filter((f) => f !== formeStation);
  return { charge: restants, descendus: charge.length - restants.length };
}

// Montée : embarque depuis la file les voyageurs dont la ligne dessert la
// forme, dans la limite de la capacité de la rame. Rend la nouvelle charge
// et la file restée à quai.
export function monter(charge, attente, formes) {
  const nouvelleCharge = charge.slice();
  const reste = [];
  attente.forEach((f) => {
    if (nouvelleCharge.length < CAPACITE_RAME && formes[f]) nouvelleCharge.push(f);
    else reste.push(f);
  });
  return { charge: nouvelleCharge, attente: reste };
}
