import { STATIONS_MIN_LIGNE } from "../config.js";

// Distance de routage : nombre minimum de trajets (montées) pour atteindre une
// station de la forme cible depuis chaque station. BFS multi-sources sur le
// graphe où deux stations sont voisines si une ligne active les relie (un
// trajet dessert toutes les stations de sa ligne). Une station inatteignable
// vaut Infinity. C'est cette distance, strictement décroissante à chaque
// trajet, qui garantit qu'un voyageur ne tourne jamais en rond.
export function distancesVersForme(stations, lignes, forme) {
  const n = stations.length;
  const dist = new Array(n).fill(Infinity);
  const file = [];
  for (let i = 0; i < n; i++) {
    if (stations[i].forme === forme) { dist[i] = 0; file.push(i); }
  }
  const lignesDe = stations.map(() => []);
  lignes.forEach((l) => {
    if (l.stations.length >= STATIONS_MIN_LIGNE) l.stations.forEach((s) => lignesDe[s].push(l));
  });
  let head = 0;
  while (head < file.length) {
    const s = file[head++];
    lignesDe[s].forEach((l) => {
      l.stations.forEach((t) => {
        if (dist[t] === Infinity) { dist[t] = dist[s] + 1; file.push(t); }
      });
    });
  }
  return dist;
}
