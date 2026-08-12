---
name: architecture
description: À utiliser quand il faut comprendre la structure du projet ou décider où placer un nouveau bout de code (règle, état, rendu, entrée, boucle).
auto_invoke: true
---

# Architecture — Réseau

Sens des dépendances : `config ← rules ← state ← loop / render / input ← main`.
La flèche ne pointe que vers le bas. Une règle qui importe un rendu est l'erreur à traquer.

## Carte des modules

| Module | Rôle | Dépend de |
|---|---|---|
| `src/config.js` | Toutes les valeurs de réglage nommées | rien |
| `src/rules/rng.js` | RNG à graine (LCG), injecté | rien |
| `src/rules/trains.js` | Déplacement d'une rame + demi-tour, alignement à quai | `config` |
| `src/rules/routing.js` | Distances de routage (BFS) d'une station vers une forme | `config` |
| `src/rules/boarding.js` | Échange à un arrêt : arrivées, correspondances, montées, capacité | `config` |
| `src/rules/network.js` | Tracé d'une ligne, limites d'arrêts et de lignes | `config` |
| `src/rules/overload.js` | Surcharge (croissance/décroissance), saturation | `config` |
| `src/rules/spawn.js` | Apparition des voyageurs, heure de pointe, tirage de forme | `config` |
| `src/rules/week.js` | Fin de journée/semaine, forme et placement des stations | `config` |
| `src/state/game.js` | État `G` + transitions (`nouvellePartie`, `ajouterStation`, `finDeSemaine`, `toucheStation`, `prendreDotation`) | `config`, `rules` |
| `src/render/carte.js` | SVG de la carte (fond, lignes, rames, stations, surcharge) | `config` |
| `src/render/hud.js` | Écriture DOM de l'interface, branchement des intentions via `actions` | `config`, `render/carte` |
| `src/input/controls.js` | Branche les boutons fixes sur les intentions | rien (DOM) |
| `src/loop/tick.js` | Un pas de simulation : règle → état | `config`, `rules`, `state` |
| `src/main.js` | Câblage : graine, état, `actions`, boucle `setInterval` | tout |

`index.html` n'est plus qu'une coquille chargeant `src/main.js`.

## Où va le nouveau code

| Type de changement | Où | Comment |
|---|---|---|
| Nouvelle décision/transition de jeu (pure) | `src/rules/<domaine>.js` | fonction pure, RNG injecté si aléa, testée dans `tests/` |
| Nouveau réglage / seuil / dimension | `src/config.js` | export nommé, jamais un littéral ailleurs |
| Nouveau champ d'état ou transition | `src/state/game.js` | mute `G`, appelle les règles, ne touche pas au DOM |
| Nouveau visuel | `src/render/carte.js` (carte) ou `src/render/hud.js` (interface) | lit `G`, écrit du DOM/SVG, n'importe pas `input`/`loop` |
| Nouvelle interaction | intention dans `actions` (`main.js`) + branchement dans `render/hud.js` (élément généré) ou `input/controls.js` (bouton fixe) | l'action mute via `state`, puis redessine |
| Nouvelle étape par tick | `src/loop/tick.js` | appelle la règle, applique le résultat sur `G` |

## À vérifier à chaque fin de tranche

- Aucun import de `render/`, `input/`, `loop/` depuis `src/rules/`.
- Aucun `document`/`window`/`Math.random`/`Date.now` dans `src/rules/`.
- Aucun littéral de réglage hors `src/config.js`.
