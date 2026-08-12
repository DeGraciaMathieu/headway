---
name: affluence
description: À utiliser quand on touche à l'apparition des voyageurs, aux heures de pointe, aux files d'attente ou à la surcharge des stations.
auto_invoke: true
---

# Affluence — apparition des voyageurs et surcharge

À chaque tick, un voyageur peut apparaître dans une station (plus souvent aux heures de
pointe et au fil des semaines), avec une forme de destination. Une station qui accumule trop
de monde monte en surcharge ; si sa surcharge atteint 1, le réseau s'arrête.

File d'une station : `s.attente[]` (formes visées). Surcharge : `s.surcharge` ∈ [0, 1].

## Concepts → implémentation

| Concept | Fonction | Fichier | Réglage |
|---|---|---|---|
| Heure de pointe ? | `estHeurePointe(horloge)` | `src/rules/spawn.js` | `POINTE_MATIN_*`, `POINTE_SOIR_*` |
| Probabilité d'apparition | `probaApparition(semaine, pointe)` | `src/rules/spawn.js` | `PROBA_APPARITION_BASE`, `PROBA_APPARITION_PAR_SEMAINE`, `FACTEUR_HEURE_POINTE` |
| Forme du voyageur | `formeVoyageur(rng, semaine, formeStation)` | `src/rules/spawn.js` | `SEMAINE_TRIANGLE_MIN`, `INDEX_FORMES_MAX`, `PROBA_EVITE_MEME_FORME` |
| Plafond de la file | `s.attente.length < CAPACITE_FILE` | `src/loop/tick.js` | `CAPACITE_FILE` |
| Prochaine surcharge | `prochaineSurcharge(surcharge, attente)` | `src/rules/overload.js` | `SEUIL_SURCHARGE`, `TAUX_SURCHARGE_CROISSANCE`, `TAUX_SURCHARGE_DECROISSANCE` |
| Station saturée → fin | `estSaturee(surcharge)` → `G.fini` | `src/rules/overload.js` | — |
| Orchestration par tick | bloc apparition + boucle surcharge | `src/loop/tick.js` | — |

La station qui reçoit le voyageur est tirée dans `tick.js` (`Math.floor(rng() * len)`), l'aléa
venant du RNG injecté.

## Ajouter une règle d'affluence

1. Décision pure dans `src/rules/spawn.js` (apparition) ou `src/rules/overload.js`
   (surcharge), RNG injecté pour l'apparition.
2. Seuils/taux/probabilités dans `src/config.js`.
3. La brancher dans `src/loop/tick.js` (bloc « apparition de voyageurs » ou boucle
   « surcharge ») et appliquer le résultat sur `s`/`G`.
4. Macro-test dans `tests/spawn.test.js` ou `tests/overload.test.js` (graine fixe pour l'aléa).
5. `npm test` vert, puis vérification à la main.
