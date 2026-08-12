---
name: affluence
description: À utiliser quand on touche à l'apparition des voyageurs, aux heures de pointe, aux files d'attente ou à la surcharge des stations.
auto_invoke: true
---

# Affluence — apparition des voyageurs et surcharge

À chaque tick, un voyageur peut apparaître dans une station (plus souvent aux heures de
pointe et au fil des semaines), avec une forme de destination. Un voyageur qui attend trop
longtemps quitte la file (perdu) et bloque définitivement un emplacement de la station. La
surcharge se calcule sur l'**occupation** = voyageurs en attente + emplacements bloqués ; si
elle atteint 1, le réseau s'arrête. Les emplacements bloqués ne fluctuent pas : ils
rapprochent durablement la station de la surcharge.

File d'une station : `s.attente[]`, chaque élément `{ f: forme visée, age: ticks d'attente }`.
Emplacements bloqués : `s.bloque` (≤ `MAX_BLOQUE`). Surcharge : `s.surcharge` ∈ [0, 1].
Voyageurs perdus : `G.perdus`.

## Concepts → implémentation

| Concept | Fonction | Fichier | Réglage |
|---|---|---|---|
| Heure de pointe ? | `estHeurePointe(horloge)` | `src/rules/spawn.js` | `POINTE_MATIN_*`, `POINTE_SOIR_*` |
| Probabilité d'apparition | `probaApparition(semaine, pointe)` | `src/rules/spawn.js` | `PROBA_APPARITION_BASE`, `PROBA_APPARITION_PAR_SEMAINE`, `FACTEUR_HEURE_POINTE` |
| Forme du voyageur (≠ station de départ) | `formeVoyageur(rng, semaine, formeStation)` | `src/rules/spawn.js` | `SEMAINE_TRIANGLE_MIN`, `INDEX_FORMES_MAX` |
| Plafond de la file | `s.attente.length + s.bloque < CAPACITE_FILE` | `src/loop/tick.js` | `CAPACITE_FILE` |
| Vieillissement / perte / blocage | `vieillirFile(attente, bloque)` → `{attente, perdus, bloque}` | `src/rules/patience.js` | `PATIENCE_MAX`, `MAX_BLOQUE` |
| Prochaine surcharge (sur l'occupation) | `prochaineSurcharge(surcharge, attente + bloque)` | `src/rules/overload.js` | `SEUIL_SURCHARGE`, `TAUX_SURCHARGE_CROISSANCE`, `TAUX_SURCHARGE_DECROISSANCE` |
| Station saturée → fin | `estSaturee(surcharge)` → `G.fini` | `src/rules/overload.js` | — |
| Orchestration par tick | bloc apparition + boucle surcharge | `src/loop/tick.js` | — |

La station qui reçoit le voyageur est tirée dans `tick.js` (`Math.floor(rng() * len)`), l'aléa
venant du RNG injecté.

## Ajouter une règle d'affluence

1. Décision pure dans `src/rules/spawn.js` (apparition), `src/rules/overload.js`
   (surcharge) ou `src/rules/patience.js` (attente/perte), RNG injecté pour l'apparition.
2. Seuils/taux/probabilités dans `src/config.js`.
3. La brancher dans `src/loop/tick.js` (bloc « apparition de voyageurs » ou boucle
   « surcharge ») et appliquer le résultat sur `s`/`G`.
4. Macro-test dans `tests/spawn.test.js` ou `tests/overload.test.js` (graine fixe pour l'aléa).
5. `npm test` vert, puis vérification à la main.
