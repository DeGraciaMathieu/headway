---
name: prd
description: À utiliser quand on veut spécifier une fonctionnalité (document de cadrage) sans l'implémenter.
user_invocable: true
---

# prd — rédiger une spécification

N'implémente **rien**. Explore le code réel pour établir la ligne de base technique, ne pose
que les décisions **produit**, puis rédige le document.

## Avant d'écrire

- Invoquer `architecture` et lire les modules touchés (`src/rules/`, `src/state/game.js`,
  `src/config.js`, `src/loop/tick.js`, `src/render/`).
- Ne poser à l'utilisateur que ce que le code ne tranche pas : intention de jeu, valeurs
  cibles, cas limites, périmètre.

## Format du PRD

1. **Objectif** — ce que la fonctionnalité apporte au joueur, en une phrase.
2. **Ligne de base technique** — modules/règles/état existants concernés (fichiers et
   fonctions réels).
3. **Comportement** — règles attendues, dans le vocabulaire du domaine.
4. **Hors périmètre** — ce qui n'est explicitement pas fait.
5. **Impact par couche** — `config` / `rules` / `state` / `render` / `input` / `loop` :
   ce qui change dans chacune.
6. **Critères d'acceptation** — observables par un joueur.
7. **Tests** — les macro-tests à ajouter (`tests/<module>.test.js`) et ce qu'ils vérifient.
8. **Risques et questions ouvertes** — ce que le code ne tranche pas ; ne pas résoudre en
   devinant, renvoyer vers `docs/decisions.md`.
