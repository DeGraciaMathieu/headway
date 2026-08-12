---
name: rames
description: À utiliser quand on touche à la circulation des rames ou à l'échange de voyageurs — déplacement, demi-tour, arrêt à quai, montées/descentes, capacité.
auto_invoke: true
---

# Rames — circulation et échange de voyageurs

Une rame parcourt sa ligne en aller-retour et, à chaque station atteinte, échange ses
voyageurs selon le **routage** : ceux arrivés à leur forme descendent, ceux dont c'est le
meilleur point de sortie descendent pour prendre une **correspondance**, et ceux en attente
que la ligne rapproche de leur forme montent. Le routage s'appuie sur une distance (nombre
de trajets vers la forme cible) strictement décroissante, ce qui garantit qu'un voyageur ne
tourne jamais en rond.

Donnée d'une rame (`src/state/game.js`) : `{ ligne, pos, dir, charge[], _last }`
— `pos` position continue (0 = premier arrêt), `dir` ±1, `charge` formes embarquées,
`_last` clé anti-doublon `"stationId@tick"`.

## Concepts → implémentation

| Concept | Fonction (pure) | Fichier | Réglage |
|---|---|---|---|
| Avancer + demi-tour au terminus | `avancerRame(pos, dir, nbStations)` → `{pos, dir}` | `src/rules/trains.js` | `VITESSE_RAME` |
| Est-elle à quai ? | `indexArret(pos)` → index ou `-1` | `src/rules/trains.js` | `SEUIL_ARRET` |
| Distances de routage vers une forme (BFS) | `distancesVersForme(stations, lignes, forme)` → tableau | `src/rules/routing.js` | `STATIONS_MIN_LIGNE` |
| Échange à un arrêt (descentes/correspondances/montées) | `traiterArret(charge, attente, ligneStations, iStation, distParForme)` → `{charge, attente, transportes}` | `src/rules/boarding.js` | `CAPACITE_RAME` |
| Orchestration par tick | distances précalculées par forme + boucle `G.rames.forEach` | `src/loop/tick.js` | — |

Le score augmente de `transportes` (`G.voyageurs += res.transportes`) dans `tick.js`. `_last`
empêche deux arrêts au même tick. Les distances sont recalculées une fois par tick (le réseau
est fixe sur un tick).

## Ajouter un comportement de rame

1. Écrire la décision comme fonction **pure** dans `src/rules/trains.js` (mouvement) ou
   `src/rules/boarding.js` (voyageurs) : prend l'état nécessaire, retourne le prochain état,
   ne mute rien, RNG injecté si aléa.
2. Mettre tout nouveau réglage dans `src/config.js`.
3. L'appeler dans `src/loop/tick.js`, boucle `G.rames.forEach`, et appliquer le résultat sur
   `r`/`st`/`G` (le site d'appel garde les effets de bord).
4. Ajouter un macro-test dans `tests/trains.test.js` ou `tests/boarding.test.js`.
5. `npm test` vert, puis vérifier à la main (`npm run dev`).
