---
name: feature
description: À utiliser quand on demande d'implémenter une fonctionnalité de jeu dans l'architecture existante.
user_invocable: true
---

# feature — implémenter une fonctionnalité

## 1. Comprendre

- Reformuler la demande en une phrase.
- Invoquer `architecture` pour situer le(s) module(s) concerné(s) et le sens des dépendances.
- Poser les questions qui bloquent : **valeurs numériques** (seuils, vitesses, probabilités),
  **interaction avec l'existant** (quelle règle/quel état est touché), **cas limites**.
  Ne rien deviner : une valeur non tranchée → question, pas une supposition.

## 2. Implémenter dans l'architecture

Respecter `CLAUDE.md` :
- La logique de jeu va dans `src/rules/<domaine>.js`, **pure** (pas de DOM, pas de
  `Math.random`/temps, RNG injecté, pas de mutation d'arguments, importe au plus `config`).
- Tout réglage dans `src/config.js`.
- L'état et ses transitions dans `src/state/game.js` ; l'orchestration par tick dans
  `src/loop/tick.js` ; le visuel dans `src/render/` ; les intentions via `actions`
  (`src/main.js`) reliées dans `src/render/hud.js` ou `src/input/controls.js`.
- S'appuyer sur le skill de domaine adéquat (`rames`, `reseau`, `affluence`, `progression`).

## 3. Tester au niveau macro

- Écrire/mettre à jour un macro-test dans `tests/<module>.test.js` (voir `testing`), graine
  fixe pour l'aléa.
- `npm test` jusqu'au vert. Si une approche échoue deux fois, revoir le plan.

## 4. Mettre à jour la documentation si la portée a bougé

- Nouveau réglage, nouveau module, nouveau comportement visible → ajuster `CLAUDE.md`, le
  skill de domaine concerné, et le **panneau d'aide** (`#modal` de `index.html`) si une règle
  décrite au joueur a changé.

## 5. Résumer

Fichiers modifiés, tests ajoutés, résultat de `npm test`, et toute question restée ouverte
(à consigner dans `docs/decisions.md`).
