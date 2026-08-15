import { TICK_MS } from "./config.js";
import { createRng } from "./rules/rng.js";
import { nouvellePartie, toucheStation, prendreDotation, effacerLigne } from "./state/game.js";
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
  choisirVitesse(v) { G.vitesse = v; rendu(); },
  effacerLigne(id) { effacerLigne(G, id); rendu(); },
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
  // Accélérer le temps = jouer plusieurs pas de simulation par intervalle réel.
  let avance = false;
  for (let n = 0; n < G.vitesse; n++) {
    if (!tick(G, rng)) break;
    avance = true;
    if (G.fini) {
      vue.nouveauRecord = G.voyageurs > meilleur;
      if (vue.nouveauRecord) { meilleur = G.voyageurs; localStorage.setItem(CLE_MEILLEUR, String(meilleur)); }
      vue.meilleur = meilleur;
      break;
    }
  }
  if (avance) rendu();
}, TICK_MS);
