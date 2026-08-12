# Réseau

Jeu de réseau de transport (type Mini-Metro) en JavaScript vanilla, rendu SVG, modules ES
natifs. Le joueur trace des lignes entre des stations de formes différentes ; les voyageurs
descendent à la station qui a leur forme ; une station saturée arrête le réseau.

## Stack & commandes

- **JavaScript vanilla**, ESM natif (aucun bundler, aucun transpileur). **Node 22** requis.
- Rendu **SVG** généré par chaînes de caractères (pas de canvas, pas de framework).
- **Lancer** : `npm run dev` (`npx serve .`), puis ouvrir l'URL affichée.
  Le double-clic sur `index.html` ne fonctionne plus (l'ESM natif ne se charge pas via `file://`).
- **Tester** : `npm test` (`node --test`), ou `npm run test:watch`.
- Pas de lint ni de formateur configurés.

## Conventions de code (non négociables)

Sens des dépendances, la flèche ne pointe que vers le bas :
`config ← rules ← state ← loop / render / input ← main`.

1. **`src/rules/` est pur.** Interdit dans ce dossier :
   - tout DOM (`document`, `window`, `innerHTML`, nœud SVG en entrée ou sortie) ;
   - `Math.random`, `Date.now`, `performance.now` — l'aléa vient d'un **RNG à graine passé
     en argument** (`rng` issu de `createRng`, `src/rules/rng.js`) ;
   - toute mutation des arguments — une règle prend un état et **retourne** le prochain état
     ou une décision ;
   - tout import autre que `../config.js`.
2. **Aucune valeur magique hors `src/config.js`.** Vitesses, dimensions, seuils, capacités,
   couleurs liées aux règles, libellés : tout est un export nommé de `config.js`, importé là
   où il sert.
3. **`src/render/` écrit à l'écran** et ne fait que ça. Il peut importer `config.js` et lire
   l'état ; il **n'importe jamais** `input/` ni `loop/`. Les éléments cliquables qu'il génère
   sont reliés aux intentions par un objet **`actions` injecté** (voir `render/hud.js`).
4. **`src/state/game.js` porte l'état `G`** et ses transitions ; il importe `config` et
   `rules`, jamais le DOM.
5. **`src/loop/tick.js` orchestre** un pas de simulation : il appelle les règles et applique
   leurs résultats sur `G`. Il ne dessine pas ; le pilote (`main.js`) redessine après un tick.
6. **Déterminisme** : une seule graine, décidée dans `src/main.js` (`Date.now()` en jeu,
   graine fixe dans les tests). Aucune règle ne lit l'horloge : le temps de jeu passe par
   `G.horloge`, avancé par le tick.

## Conventions de domaine

- Formes des voyageurs et des stations : `"rond"`, `"carre"`, `"triangle"` (`FORMES`,
  `config.js`). Un voyageur ne descend qu'à une station de **sa** forme.
- Langue : **français** partout — commentaires, noms de domaine, textes affichés.
- Les termes du jeu sont ceux du code : `rame`, `ligne`, `station`, `attente`, `surcharge`,
  `dotation`, `semaine`, `voyageurs`. Ne pas les renommer.

## Comportement (process)

- Ne jamais déclarer une tâche terminée sans avoir lancé `npm test` et vu la suite passer.
- Si une approche échoue deux fois, revoir le plan avec l'utilisateur plutôt que tenter une
  troisième variante.
- **Ce dépôt est issu d'un refactor à comportement constant.** Ne pas « corriger » un
  comportement existant au passage : tout écart voulu ou toute zone d'ombre va dans
  `docs/decisions.md` (sections *Deliberately left alone* / *Open questions*), jamais deviné.

## Skills disponibles

- `architecture` — carte des modules et où placer chaque type de nouveau code.
- `testing` — commande, philosophie macro-tests, mapping test → portée.
- `rames` — circulation des rames et échange de voyageurs.
- `reseau` — tracé des lignes, limites, dotations.
- `affluence` — apparition des voyageurs, heures de pointe, files, surcharge.
- `progression` — rythme hebdomadaire, ouverture et placement des stations.
- `feature` — implémenter une fonctionnalité dans l'architecture (invocable).
- `prd` — rédiger une spécification sans implémenter.
