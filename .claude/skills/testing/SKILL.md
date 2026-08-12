---
name: testing
description: À utiliser quand il faut écrire, lancer ou comprendre les tests du projet.
auto_invoke: true
---

# Tests — Réseau

## Commande

```bash
npm test            # node --test, exécute tests/*.test.js
npm run test:watch  # node --test --watch
```

Runner natif `node:test` + `node:assert/strict`. Aucune dépendance de test (branche
zéro-build) : si un test « a besoin » d'une lib, c'est que la règle n'est pas assez pure —
corriger la règle plutôt qu'ajouter la lib.

## Philosophie : macro-tests

Tester ce qu'un joueur remarquerait, dans le vocabulaire du domaine — pas l'implémentation.

- Bon : « le triangle n'apparaît pas avant la semaine 3 », « une rame n'embarque pas
  au-delà de sa capacité », « le réseau s'arrête quand une station est saturée ».
- Mauvais : « `formeVoyageur` renvoie l'index 2 », « le tableau a une longueur de 3 ».

Construire l'état avec un petit littéral explicite, pas via un helper qui cache la mise en
place. Une ou deux assertions par règle : le cas nominal et le cas limite qui justifie la
règle. Le pourcentage de couverture n'est pas un objectif.

Pour une règle aléatoire, passer une **graine fixe** : `createRng(n)` (`src/rules/rng.js`).

## Mapping test → portée

| Fichier de test | Couvre |
|---|---|
| `tests/trains.test.js` | déplacement, demi-tour au terminus, alignement à quai |
| `tests/boarding.test.js` | descente par forme, montée selon formes desservies, capacité |
| `tests/network.test.js` | tracé de ligne (ajout/retrait/limite), limite de lignes |
| `tests/overload.test.js` | croissance/décroissance de surcharge, saturation |
| `tests/spawn.test.js` | heures de pointe, probabilité d'apparition, gate triangle |
| `tests/week.test.js` | fin de journée, station bonus, gate triangle, placement |

## Où mettre un nouveau test

Un fichier par module de règles, `tests/<module>.test.js`. Une nouvelle règle dans
`src/rules/spawn.js` → un test dans `tests/spawn.test.js`. Toujours importer depuis
`src/rules/…` (jamais depuis `render/`, `input/`, `loop/` : ces couches ne sont pas testées
unitairement, la boucle est validée à la main via `npm run dev`).
