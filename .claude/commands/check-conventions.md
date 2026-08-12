# /check-conventions

Contrôle léger des conventions et de la cohérence tests/doc sur les changements en cours.

## Procédure

1. Lire `CLAUDE.md`.
2. Cadrer : `git diff`, `git diff --cached`, `git status`, `git log --oneline -5`.
   **Rien à examiner → s'arrêter.**
3. Vérifier point par point :
   - `src/rules/` pur (pas de DOM, pas de `Math.random`/`Date.now`/`performance.now`, pas de
     mutation d'argument, import ≤ `../config.js`) ;
   - aucune valeur magique hors `src/config.js` ;
   - sens des dépendances respecté ; `render/` n'importe pas `input/`/`loop/` ;
   - toute nouvelle règle a son macro-test dans `tests/<module>.test.js` ;
   - si une règle décrite dans le panneau d'aide (`#modal` de `index.html`) a changé, le
     texte est à jour.
4. Lancer `npm test`.
5. Rapport : statut **OK / VIOLATION / N/A** par point + **verdict global**.
