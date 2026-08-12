import { TICK_MS } from "./config.js";
import { createRng } from "./rules/rng.js";
import { nouvellePartie, toucheStation, prendreDotation } from "./state/game.js";
import { tick } from "./loop/tick.js";
import { rend } from "./render/hud.js";
import { brancherBoutons } from "./input/controls.js";

const CLE_MEILLEUR = "reseau.meilleur";
const rng = createRng(Date.now());
let G = nouvellePartie(rng);
let meilleur = Number(localStorage.getItem(CLE_MEILLEUR) || 0);
const vue = { meilleur, nouveauRecord: false };

function rendu() { rend(G, actions, vue); }

const actions = {
  toucheStation(i) { toucheStation(G, i); rendu(); },
  choisirLigne(id) { G.selLigne = id; rendu(); },
  prendreDotation(type) { prendreDotation(G, type); rendu(); },
};

brancherBoutons({
  pause() { if (!G.fini && !G.dotation) { G.pause = !G.pause; rendu(); } },
  rejouer() { G = nouvellePartie(rng); vue.nouveauRecord = false; rendu(); },
  aide() { G.pause = true; document.querySelector("#modal").classList.add("on"); rendu(); },
  fermer() { document.querySelector("#modal").classList.remove("on"); if (!G.dotation) G.pause = false; rendu(); },
});

rendu();
setInterval(() => {
  if (!tick(G, rng)) return;
  if (G.fini) {
    vue.nouveauRecord = G.voyageurs > meilleur;
    if (vue.nouveauRecord) { meilleur = G.voyageurs; localStorage.setItem(CLE_MEILLEUR, String(meilleur)); }
    vue.meilleur = meilleur;
  }
  rendu();
}, TICK_MS);
