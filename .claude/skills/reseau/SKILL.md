---
name: reseau
description: À utiliser quand on touche au tracé des lignes, aux limites du réseau ou aux dotations (ajout de rame/ligne).
auto_invoke: true
---

# Réseau — tracé des lignes et dotations

Le joueur sélectionne une ligne puis touche des stations pour l'enchaîner. Retoucher une
station déjà sur la ligne la retire du tracé (désélection). En fin de semaine, il encaisse
une dotation : une rame de plus (sur la ligne sélectionnée) ou une ligne de plus.

Donnée d'une ligne (`src/state/game.js`) : `{ id, stations[] }` où `stations` est un tableau
d'indices dans `G.stations`. Couleurs `COUL`, noms `NOMS_L` (`src/config.js`).

## Concepts → implémentation

| Concept | Fonction | Fichier | Réglage |
|---|---|---|---|
| Tracer / retirer une station | `tracer(stations, i)` → nouveau tableau | `src/rules/network.js` | `MAX_ARRETS_LIGNE` |
| Peut-on ouvrir une ligne ? | `peutAjouterLigne(nbLignes)` | `src/rules/network.js` | `MAX_LIGNES` |
| Le joueur touche la station i | `toucheStation(G, i)` | `src/state/game.js` | — |
| Encaisser la dotation | `prendreDotation(G, type)` (`"rame"` \| `"ligne"`) | `src/state/game.js` | `MAX_LIGNES` |
| Ligne sélectionnée | `G.selLigne`, intention `actions.choisirLigne` | `src/main.js`, `src/render/hud.js` | — |

`toucheStation` et `prendreDotation` sont des transitions d'état sans DOM ; le rendu est
déclenché après coup par l'intention (`main.js`).

## Ajouter une règle de réseau

1. Décision pure dans `src/rules/network.js` : prend le tableau d'arrêts (ou le nombre de
   lignes), retourne le prochain, sans mutation.
2. Limites/tailles dans `src/config.js`.
3. La brancher dans la transition d'état correspondante de `src/state/game.js`
   (`toucheStation`, `prendreDotation`) ; si une nouvelle intention joueur est nécessaire,
   l'ajouter à `actions` dans `src/main.js` et la relier à l'élément généré dans
   `src/render/hud.js`.
4. Macro-test dans `tests/network.test.js`.
5. `npm test` vert, puis vérification à la main.
