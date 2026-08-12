# /review

Revue complète des changements en cours sur Réseau.

## Procédure

1. Lire `CLAUDE.md` (conventions non négociables).
2. Cadrer les changements : `git diff`, `git diff --cached`, `git status`,
   `git log --oneline -5`. **S'il n'y a rien à examiner, s'arrêter et le dire.**
3. Examiner point par point (voir la grille ci-dessous).
4. Lancer `npm test` et rapporter le résultat.
5. Rendre un rapport structuré : pour chaque point, un statut **OK / VIOLATION / N/A** avec
   fichier + ligne et la correction attendue ; puis un **verdict global**.

## Grille

### Conventions
- `src/rules/` pur : aucun `document`/`window`/`innerHTML`, aucun `Math.random`/`Date.now`/
  `performance.now`, aucune mutation d'argument, aucun import hors `../config.js`.
- Aucune valeur magique hors `src/config.js`.
- Sens des dépendances respecté (`config ← rules ← state ← loop/render/input ← main`) ;
  `render/` n'importe pas `input/`/`loop/`.
- Aléa via RNG à graine injecté ; graine décidée seulement dans `src/main.js`.

### Couverture de tests
- Toute nouvelle règle a un macro-test dans `tests/<module>.test.js`.
- Les tests décrivent un comportement de jeu, pas l'implémentation ; graine fixe pour l'aléa.
- `npm test` passe.

### Maintenabilité
- Couplage, responsabilité unique, duplication, longueur/complexité des fonctions, nommage,
  valeurs magiques.

### Cohérence système
- Intégration avec le code existant, forme de l'état (`G`, stations, lignes, rames),
  respect des patterns établis (fonction pure + application au site d'appel).
- Doc vivante : si une règle décrite dans le panneau d'aide (`#modal` de `index.html`) a
  changé, le texte a-t-il été mis à jour ?

## Verdict
`OK` si aucun VIOLATION et tests verts, sinon `À CORRIGER` avec la liste ordonnée.
