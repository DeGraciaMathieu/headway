# /check-tests

Analyse la couverture de tests des changements en cours et propose les macro-tests manquants.

## Procédure

1. Lire `CLAUDE.md` et le skill `testing`.
2. Cadrer : `git diff`, `git diff --cached`, `git status`, `git log --oneline -5`.
   **Rien à examiner → s'arrêter.**
3. Pour chaque règle ajoutée/modifiée dans `src/rules/`, vérifier qu'un macro-test existe
   dans `tests/<module>.test.js` et couvre le cas nominal **et** le cas limite qui justifie
   la règle.
4. Lister les **macro-tests manquants** proposés : pour chacun, le comportement de jeu vérifié
   (formulé côté joueur) et le fichier cible. **Attendre l'accord de l'utilisateur avant
   d'écrire quoi que ce soit.**
5. Après accord : écrire les tests (graine fixe pour l'aléa), puis relancer `npm test` et
   rapporter le résultat.

## Rapport
Par règle : **COUVERT / PARTIEL / NON COUVERT**, puis la liste des tests proposés et, après
écriture, le résultat de la suite.
