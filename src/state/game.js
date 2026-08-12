import { HORLOGE_DEPART, STATIONS_INITIALES, RONDS_INITIAUX, FORMES } from "../config.js";
import { placerStation, formeNouvelleStation, stationBonus } from "../rules/week.js";
import { tracer, peutAjouterLigne } from "../rules/network.js";

// Ouvre une station : position tirée par la règle de placement, forme donnée
// ou, à défaut, un rond ou un carré au hasard.
export function ajouterStation(G, rng, forme) {
  const p = placerStation(rng, G.stations);
  G.stations.push({ x: p.x, y: p.y, forme: forme || FORMES[Math.floor(rng() * 2)], attente: [], surcharge: 0, bloque: 0 });
}

// État d'une nouvelle partie : cinq stations, deux lignes vides, deux rames.
export function nouvellePartie(rng) {
  const G = {
    t: 0, semaine: 1, horloge: HORLOGE_DEPART, voyageurs: 0, perdus: 0,
    stations: [], lignes: [], rames: [], stockRames: 1, stockLignes: 0,
    selLigne: 0, pause: false, fini: false, dotation: false, message: ""
  };
  for (let i = 0; i < STATIONS_INITIALES; i++) ajouterStation(G, rng, i < RONDS_INITIAUX ? "rond" : "carre");
  G.lignes = [{ id: 0, stations: [] }, { id: 1, stations: [] }];
  G.rames = [{ ligne: 0, pos: 0, dir: 1, charge: [] }, { ligne: 1, pos: 0, dir: 1, charge: [] }];
  G.message = "Touche une ligne, puis des stations, pour la tracer.";
  return G;
}

// Fin de semaine : une station ouvre (triangle possible), une seconde une
// semaine sur deux, et le joueur doit choisir sa dotation.
export function finDeSemaine(G, rng) {
  G.semaine++;
  G.dotation = true; G.pause = true;
  ajouterStation(G, rng, formeNouvelleStation(rng, G.semaine));
  if (stationBonus(G.semaine)) ajouterStation(G, rng, null);
  G.message = "Fin de semaine " + (G.semaine - 1) + " — choisis une dotation.";
}

// Le joueur touche la station i : met à jour le tracé de la ligne sélectionnée.
export function toucheStation(G, i) {
  if (G.fini) return;
  const l = G.lignes[G.selLigne];
  l.stations = tracer(l.stations, i);
}

// Le joueur encaisse sa dotation de fin de semaine : une rame ou une ligne.
export function prendreDotation(G, type) {
  if (type === "rame") {
    G.stockRames++;
    G.rames.push({ ligne: G.selLigne, pos: 0, dir: 1, charge: [] });
  } else {
    if (peutAjouterLigne(G.lignes.length)) G.lignes.push({ id: G.lignes.length, stations: [] });
    G.stockLignes++;
  }
  G.dotation = false; G.pause = false;
  G.message = "";
}
