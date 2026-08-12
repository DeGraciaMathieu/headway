---
name: progression
description: À utiliser quand on touche au rythme hebdomadaire, à l'ouverture ou au placement des stations, ou aux dotations de fin de semaine.
auto_invoke: true
---

# Progression — rythme hebdomadaire et ouverture de stations

L'horloge avance de `MINUTES_PAR_TICK` par tick. Quand elle atteint 24h, la journée se
termine : c'est la fin de semaine — une station ouvre (un triangle est possible à partir de
la semaine 3), une seconde une semaine sur deux, et le joueur choisit sa dotation.

## Concepts → implémentation

| Concept | Fonction | Fichier | Réglage |
|---|---|---|---|
| Fin de journée (24h) | `finDeJournee(horloge)` | `src/rules/week.js` | `MINUTES_PAR_JOUR` |
| Forme de la station ouverte | `formeNouvelleStation(rng, semaine)` | `src/rules/week.js` | `SEMAINE_TRIANGLE_MIN`, `PROBA_TRIANGLE` |
| Station bonus (semaine paire) | `stationBonus(semaine)` | `src/rules/week.js` | — |
| Placement (distance min.) | `placerStation(rng, stations)` → `{x, y}` | `src/rules/week.js` | `MARGE_X/Y`, `CARTE_W/H`, `DISTANCE_MIN_STATIONS`, `ESSAIS_PLACEMENT_MAX` |
| Fin de semaine (transition) | `finDeSemaine(G, rng)` | `src/state/game.js` | — |
| Ouvrir une station | `ajouterStation(G, rng, forme)` | `src/state/game.js` | `FORMES` |
| Avance de l'horloge | `G.horloge += MINUTES_PAR_TICK` | `src/loop/tick.js` | `MINUTES_PAR_TICK` |

Le déclenchement de la fin de journée est dans `src/loop/tick.js` (`if (finDeJournee(...))`).

## Ajouter une règle de progression

1. Décision pure dans `src/rules/week.js` (temps, forme, placement), RNG injecté si aléa.
2. Durées/probabilités/marges dans `src/config.js`.
3. La brancher dans `src/state/game.js` (`finDeSemaine`, `ajouterStation`) et/ou dans le
   déclencheur de `src/loop/tick.js`.
4. Macro-test dans `tests/week.test.js` (graine fixe pour l'aléa).
5. `npm test` vert, puis vérification à la main.
