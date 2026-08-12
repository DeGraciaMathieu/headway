import { MINUTES_PAR_TICK, MINUTES_PAR_JOUR, CAPACITE_FILE, STATIONS_MIN_LIGNE } from "../config.js";
import { avancerRame, indexArret } from "../rules/trains.js";
import { formesDesservies, descendre, monter } from "../rules/boarding.js";
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
    if (s.attente.length < CAPACITE_FILE) s.attente.push({ f: cible, age: 0 });
  }

  /* rames */
  G.rames.forEach(function (r) {
    const l = G.lignes[r.ligne];
    if (!l || l.stations.length < STATIONS_MIN_LIGNE) return;
    const mv = avancerRame(r.pos, r.dir, l.stations.length);
    r.pos = mv.pos; r.dir = mv.dir;
    const i = indexArret(r.pos);
    if (i >= 0) {
      const st = G.stations[l.stations[i]];
      if (st && r._last !== l.stations[i] + "@" + G.t) {
        r._last = l.stations[i] + "@" + G.t;
        /* descentes */
        const d = descendre(r.charge, st.forme);
        r.charge = d.charge; G.voyageurs += d.descendus;
        /* montées : seulement si la ligne dessert la forme voulue */
        const m = monter(r.charge, st.attente, formesDesservies(G.stations, l.stations));
        r.charge = m.charge; st.attente = m.attente;
      }
    }
  });

  /* patience puis surcharge */
  G.stations.forEach(function (s) {
    const v = vieillirFile(s.attente);
    s.attente = v.attente; G.perdus += v.perdus;
    s.surcharge = prochaineSurcharge(s.surcharge, s.attente.length);
    if (estSaturee(s.surcharge)) { G.fini = true; G.message = "Station saturée : le réseau s'arrête."; }
  });

  return true;
}
