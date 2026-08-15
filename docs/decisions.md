# Refactor decisions

Written by `/refactor-game`. Records what the code cannot express: why this layout, why
this toolchain, what was deliberately not touched, what is still undecided.

Read by `/scaffold-claude` so it does not have to re-deduce any of it.

## Archetype

Selected: `temps réel (real-time)`
Why: boucle continue `setInterval(tick, 90)`, entités (rames) avec position/direction/
vitesse, apparition (spawn) de voyageurs, résolution de score (descente → `voyageurs++`),
condition de défaite (surcharge ≥ 1).
Does not fit:
- Rendu **SVG** généré par `innerHTML`, pas de `<canvas>`. `render/` produit des chaînes SVG/DOM.
- Boucle `setInterval` à pas fixe pilotée par une horloge de domaine (`horloge` +2 min/tick),
  pas de `requestAnimationFrame`, pas de `dt`. La boucle d'origine a été conservée telle quelle.
- **Aucune collision** : le déplacement est une interpolation linéaire le long d'une
  polyligne de stations. Pas de `collision.js` / `physics.js`.
- Une couche **simulation de domaine** (apparition, montée/descente par forme, surcharge)
  plus proche d'une transition par tick que d'une physique → modules `rules/` métier.

## Toolchain

Branch: `zero-build`
Triggering signal: aucun signal Vite présent (pas d'import npm, pas de TypeScript, pas
d'asset à bundler, ~366 lignes < 2000). La branche zéro-build est le défaut.
Node: 22
Test runner: `node:test` + `node:assert/strict`

## Layout

| Module | Responsibility | Came from |
| --- | --- | --- |
| `src/config.js` | Toutes les valeurs magiques nommées (dimensions, timings, capacités, seuils, couleurs, libellés) | consts en tête + littéraux du script inline (l.120-353) |
| `src/rules/rng.js` | Générateur pseudo-aléatoire à graine (LCG), injecté | `rnd`/`ri` autrefois basés sur `Math.random` (l.125-126) |
| `src/rules/trains.js` | Déplacement d'une rame + demi-tour au terminus, alignement à quai | `tick`, l.177-181 |
| `src/rules/boarding.js` | Descente par forme, montée selon formes desservies, capacité 6 | `tick`, l.186-198 |
| `src/rules/network.js` | Tracé d'une ligne + limites 8 arrêts / 4 lignes | `toucheStation` l.239-241, `prendreDotation` l.226 |
| `src/rules/overload.js` | Croissance/décroissance de surcharge bornée, saturation | `tick`, l.204-208 |
| `src/rules/spawn.js` | Heure de pointe, probabilité d'apparition, tirage de forme | `tick`, l.164-170 |
| `src/rules/week.js` | Fin de journée à 24h, forme de station ouverte, station bonus, placement | `tick` l.161, `finDeSemaine` l.216-217, `ajouterStation` l.145-153 |
| `src/state/game.js` | Forme de l'état, factory `nouvellePartie`, `ajouterStation`, `finDeSemaine`, `toucheStation`, `prendreDotation` | `nouvellePartie` l.130, `ajouterStation` l.143, `finDeSemaine` l.213, `prendreDotation` l.221, `toucheStation` l.235 |
| `src/render/carte.js` | SVG de la carte : fond, rivière, lignes, rames, stations, surcharge | `formeSVG` l.246, `carteSVG` l.269 |
| `src/render/hud.js` | Écritures DOM de l'interface (compteurs, horloge, listes, stock, boutons) | `rend` l.299 |
| `src/input/controls.js` | Branche les boutons fixes sur les intentions | wiring boutons l.357-360 |
| `src/loop/tick.js` | Un pas de simulation : orchestration règle → état | `tick` l.157 |
| `src/main.js` | Câblage : graine, état, actions, boucle `setInterval` | l.357-363 |

Sens des dépendances : `config` ← `rules` ← `state` ← `loop`/`render`/`input` ← `main`.
Le rendu reçoit les intentions cliquables via un objet `actions` injecté (il n'importe pas
`input`).

## Rules extracted

| Rule | Module | Test | Notes |
| --- | --- | --- | --- |
| Déplacement + demi-tour rame | `rules/trains.js` `avancerRame` | `tests/trains.test.js` | |
| Alignement à quai | `rules/trains.js` `indexArret` | `tests/trains.test.js` | seuil `SEUIL_ARRET` |
| Descente par forme | `rules/boarding.js` `descendre` | `tests/boarding.test.js` | |
| Montée selon formes desservies | `rules/boarding.js` `monter` + `formesDesservies` | `tests/boarding.test.js` | capacité `CAPACITE_RAME` |
| Tracé de ligne + limite d'arrêts | `rules/network.js` `tracer` | `tests/network.test.js` | |
| Limite de lignes | `rules/network.js` `peutAjouterLigne` | `tests/network.test.js` | |
| Surcharge (croissance/décroissance) | `rules/overload.js` `prochaineSurcharge` | `tests/overload.test.js` | bornée [0,1] |
| Saturation → fin de partie | `rules/overload.js` `estSaturee` | `tests/overload.test.js` | |
| Heure de pointe | `rules/spawn.js` `estHeurePointe` | `tests/spawn.test.js` | |
| Probabilité d'apparition | `rules/spawn.js` `probaApparition` | `tests/spawn.test.js` | |
| Tirage de forme du voyageur | `rules/spawn.js` `formeVoyageur` | `tests/spawn.test.js` | rng injecté, triangle ≥ semaine 3 |
| Fin de journée à 24h | `rules/week.js` `finDeJournee` | `tests/week.test.js` | |
| Forme de la station ouverte | `rules/week.js` `formeNouvelleStation` | `tests/week.test.js` | rng injecté |
| Station bonus bi-hebdo | `rules/week.js` `stationBonus` | `tests/week.test.js` | |
| Placement à distance minimale | `rules/week.js` `placerStation` | `tests/week.test.js` | rng injecté |

## Randomness and time

| Call site | Classification | Handling |
| --- | --- | --- |
| Apparition / tirage de forme (`spawn`, `week`, `state`) | rule-bearing | seeded rng injecté |
| Placement des stations (`week.placerStation`) | rule-bearing | seeded rng injecté |
| Horloge de jeu (`G.horloge`) | rule-bearing | déterministe, aucun accès au temps réel |
| Boucle `setInterval(tick, TICK_MS)` (`main`) | orchestration | pas de `dt` ; le pas est fixe, la boucle d'origine est conservée |

Seed: `from Date.now() in main.js` — variété par partie ; les tests passent une graine fixe
via `createRng(n)`. Aucun appel `Math.random`/`Date.now`/`performance.now` ne subsiste dans
la couche règles. Aucune randomness purement cosmétique n'a été identifiée.

## Deliberately left alone

Behaviour that looks wrong but was preserved, because the refactor must not change the
game. Each entry: what it is, where, and why it was not fixed.

- **Clic souris avalé par le re-rendu** : à l'origine, `render/hud.js` réécrivait `#carte`
  (innerHTML) à chaque tick (~90 ms) et rebranchait les `onclick` par station ; un clic dont
  le `mousedown`/`mouseup` chevauchait un re-rendu ne déclenchait pas de `click` (le nœud
  `.st` était remplacé). Laissé tel quel pendant le refactor (comportement d'origine).
  **Depuis corrigé** (hors périmètre du refactor, sur demande) par délégation d'événements
  sur les conteneurs persistants `#carte` / `#listelignes` / `#stock`, qui ne sont jamais
  remplacés — le `click` remonte jusqu'à eux même si l'enfant a été recréé.
- **`G.perdus`** déclaré (`state/game.js`, ex-l.133) mais jamais incrémenté. Conservé tel quel.
- **`G.stockRames` / `G.stockLignes`** incrémentés dans `prendreDotation` mais jamais lus
  ailleurs. Conservés.
- **Rame de dotation affectée à `G.selLigne`** (`state/game.js prendreDotation`) : le joueur
  peut changer `selLigne` juste avant de valider la dotation. Non documenté comme
  intentionnel, conservé à l'identique.

Note : la seule différence de sortie assumée est que l'aléa provient désormais d'un RNG à
graine (exigé par la dé-randomisation). Le ressenti est identique ; seule la séquence exacte
diffère d'un `Math.random` non graine.

## Post-refactor gameplay changes

Écarts d'équilibrage **assumés** décidés après le refactor (hors « comportement constant »).

- **Capacité par ligne + dotation d'amélioration.** La capacité des rames, autrefois la
  constante globale `CAPACITE_RAME = 6`, est devenue un champ d'état `capacite` porté par
  chaque ligne (`state/game.js`), reçu en argument par `boarding.traiterArret` (la règle
  reste pure). Une 3ᵉ dotation de fin de semaine (`type "capacite"`) améliore la ligne
  sélectionnée. Config : `CAPACITE_RAME_BASE`, `GAIN_CAPACITE`.
- **Base abaissée 6 → 3, gain +1.** La base d'origine (6) dépassait le plafond de file
  (`CAPACITE_FILE = 5`) : une rame vidait un quai entier d'un coup, la capacité n'était
  jamais le facteur limitant et l'amélioration de dotation restait sans effet ressenti.
  Base ramenée à `3` (sous le plafond) et gain à `1` pour que la file/surcharge morde tôt
  et que la progression `3 → 4 → 5 …` se sente. Valeurs à confirmer au playtest.

## Open questions

Decisions the code does not settle and that were not made. Never resolved by guessing.

- Rôle prévu de `G.perdus` (voyageurs perdus ?) — jamais alimenté par le prototype.
- Rôle de `G.stockRames` / `G.stockLignes` comme contrainte éventuelle — absent du code.
- La rame de dotation devrait-elle être affectée à la ligne sélectionnée au moment du clic
  ou à une ligne fixée à l'ouverture de la dotation ? Le prototype ne tranche pas.
