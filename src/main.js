import { TICK_MS } from "./config.js";
import { createRng } from "./rules/rng.js";
import { nouvellePartie, toucheStation, prendreDotation } from "./state/game.js";
import { tick } from "./loop/tick.js";
import { rend } from "./render/hud.js";
import { brancherBoutons } from "./input/controls.js";

const rng = createRng(Date.now());
let G = nouvellePartie(rng);

function rendu() { rend(G, actions); }

const actions = {
  toucheStation(i) { toucheStation(G, i); rendu(); },
  choisirLigne(id) { G.selLigne = id; rendu(); },
  prendreDotation(type) { prendreDotation(G, type); rendu(); },
};

brancherBoutons({
  pause() { if (!G.fini && !G.dotation) { G.pause = !G.pause; rendu(); } },
  rejouer() { G = nouvellePartie(rng); rendu(); },
  aide() { G.pause = true; document.querySelector("#modal").classList.add("on"); rendu(); },
  fermer() { document.querySelector("#modal").classList.remove("on"); if (!G.dotation) G.pause = false; rendu(); },
});

rendu();
setInterval(() => { if (tick(G, rng)) rendu(); }, TICK_MS);
