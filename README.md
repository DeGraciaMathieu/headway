# Réseau

Petit jeu de réseau de transport (type Mini-Metro), en JavaScript vanilla, SVG et ESM natif.

> ⚠️ **Ouvrir `index.html` en double-clic ne fonctionne plus.** Le jeu est découpé en
> modules ES chargés en natif, que le navigateur refuse de charger via `file://`. Il faut
> passer par un serveur statique.

## Lancer

```bash
npm run dev      # sert le dossier (npx serve .) puis ouvrir l'URL affichée
```

Toute autre méthode servant le dossier en HTTP fonctionne aussi, par exemple :

```bash
python3 -m http.server 8000   # puis http://localhost:8000/
```

## Tester

```bash
npm test         # node --test — les règles pures de src/rules/
npm run test:watch
```

## Structure

```
index.html          coquille : markup + <script type="module" src="src/main.js">
src/
  config.js         toutes les valeurs de réglage (dimensions, timings, seuils, couleurs)
  rules/            règles pures et testées (aucun DOM, aucune horloge, rng injecté)
    rng.js          générateur pseudo-aléatoire à graine
    trains.js  boarding.js  network.js  overload.js  spawn.js  week.js
  state/game.js     forme de l'état et ses transitions
  render/           écriture à l'écran (SVG de la carte, interface)
    carte.js  hud.js
  input/controls.js branchement des boutons sur les intentions
  loop/tick.js      un pas de simulation
  main.js           câblage : graine, état, actions, boucle
tests/              un fichier de test par module de règles
docs/decisions.md   choix du refactor (archétype, toolchain, points laissés en l'état)
```

Node 22 requis (ESM natif + `node --test`).
