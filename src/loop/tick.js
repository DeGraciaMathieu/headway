import { MINUTES_PAR_TICK, MINUTES_PAR_JOUR, CAPACITE_FILE, STATIONS_MIN_LIGNE, FORMES } from "../config.js";
import { avancerRame, indexArret } from "../rules/trains.js";
import { traiterArret } from "../rules/boarding.js";
import { distancesVersForme } from "../rules/routing.js";
import { prochaineSurcharge, estSaturee } from "../rules/overload.js";
import { estHeurePointe, probaApparition, formeVoyageur } from "../rules/spawn.js";
import { vieillirFile } from "../rules/patience.js";
import { finDeJournee } from "../rules/week.js";
import { finDeSemaine } from "../state/game.js";

// Un pas de simulation. Rend true si l'état a avancé, false s'il était en
// pause ou terminé (le pilote ne redessine alors pas).
export function tick(G, rng) {
  if (G.pause || G.fini) return false;
  G.t++;
  G.horloge += MINUTES_PAR_TICK;
  if (finDeJournee(G.horloge)) { G.horloge -= MINUTES_PAR_JOUR; finDeSemaine(G, rng); }

  /* apparition de voyageurs */
  const pointe = estHeurePointe(G.horloge);
  if (rng() < probaApparition(G.semaine, pointe) && G.stations.length) {
    const s = G.stations[Math.floor(rng() * G.stations.length)];
    const cible = formeVoyageur(rng, G.semaine, s.forme);
    if (s.attente.length + s.bloque < CAPACITE_FILE) s.attente.push({ f: cible, age: 0 });
  }

  /* rames : distances de routage vers chaque forme, réseau fixe sur ce tick */
  const distParForme = {};
  FORMES.forEach(function (f) { distParForme[f] = distancesVersForme(G.stations, G.lignes, f); });
  G.rames.forEach(function (r) {
    const l = G.lignes[r.ligne];
    if (!l || l.stations.length < STATIONS_MIN_LIGNE) return;
    const mv = avancerRame(r.pos, r.dir, l.stations.length);
    r.pos = mv.pos; r.dir = mv.dir;
    const i = indexArret(r.pos);
    if (i >= 0) {
      const iStation = l.stations[i];
      const st = G.stations[iStation];
      if (st && r._last !== iStation + "@" + G.t) {
        r._last = iStation + "@" + G.t;
        const res = traiterArret(r.charge, st.attente, l.stations, iStation, distParForme, l.capacite);
        r.charge = res.charge; st.attente = res.attente; G.voyageurs += res.transportes;
      }
    }
  });

  /* patience (perte + emplacements bloqués) puis surcharge sur l'occupation */
  G.stations.forEach(function (s) {
    const v = vieillirFile(s.attente, s.bloque);
    s.attente = v.attente; G.perdus += v.perdus; s.bloque = v.bloque;
    s.surcharge = prochaineSurcharge(s.surcharge, s.attente.length + s.bloque);
    if (estSaturee(s.surcharge)) { G.fini = true; G.message = "Station saturée : le réseau s'arrête."; }
  });

  return true;
}
