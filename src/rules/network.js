import { MAX_ARRETS_LIGNE, MAX_LIGNES } from "../config.js";

// Tracé d'une ligne lorsqu'on touche la station i :
// - retoucher une station déjà sur la ligne la retire du tracé (désélection),
// - sinon la station s'ajoute au bout, dans la limite de MAX_ARRETS_LIGNE.
// Rend le nouveau tableau d'arrêts sans muter l'entrée.
export function tracer(stations, i) {
  const pos = stations.indexOf(i);
  if (pos >= 0) return stations.filter((_, idx) => idx !== pos);
  if (stations.length < MAX_ARRETS_LIGNE) return stations.concat(i);
  return stations;
}

// Une nouvelle ligne ne peut ouvrir que sous la limite de MAX_LIGNES.
export function peutAjouterLigne(nbLignes) {
  return nbLignes < MAX_LIGNES;
}
