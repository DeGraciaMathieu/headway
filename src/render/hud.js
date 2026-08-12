import { NOMS_L, COUL, MAX_LIGNES, STATIONS_MIN_LIGNE } from "../config.js";
import { carteSVG } from "./carte.js";

var $ = function (s) { return document.querySelector(s); };

// Redessine toute l'interface à partir de l'état. Les éléments cliquables
// générés ici (stations, lignes, dotations) sont reliés aux intentions
// fournies dans `actions`.
export function rend(G, actions) {
  var h = Math.floor(G.horloge / 60), m = Math.floor(G.horloge % 60);
  $("#horloge").textContent = (h < 10 ? "0" : "") + h + ":" + (m < 10 ? "0" : "") + m;
  $("#periode").textContent = "semaine " + G.semaine;
  $("#ville").textContent = "Réseau nord · " + G.stations.length + " stations";
  var enAttente = G.stations.reduce(function (a, s) { return a + s.attente.length; }, 0);
  $("#compteurs").innerHTML =
     '<div class="c"><b>' + G.voyageurs + "</b><span>transportés</span></div>"
    + '<div class="c"><b>' + enAttente + "</b><span>sur les quais</span></div>"
    + '<div class="c"><b>' + G.rames.length + "</b><span>rames</span></div>"
    + '<div class="c"><b>' + G.lignes.filter(function (l) { return l.stations.length >= STATIONS_MIN_LIGNE; }).length + "</b><span>lignes actives</span></div>";

  $("#carte").innerHTML = carteSVG(G);
  $("#carte").querySelectorAll(".st").forEach(function (el) {
    el.onclick = function () { actions.toucheStation(+el.dataset.i); };
  });

  $("#consigne").innerHTML = G.fini
    ? "<b>" + G.message + "</b> " + G.voyageurs + " voyageurs transportés en " + G.semaine + " semaines."
    : (G.message || "Les voyageurs descendent dans une station qui a <b>leur forme</b>. Une ligne qui ne dessert pas cette forme ne les prendra pas.");

  $("#modeline").textContent = G.fini ? "terminé" : "ligne " + NOMS_L[G.selLigne].toLowerCase() + " en tracé";
  var ll = $("#listelignes"); ll.innerHTML = "";
  G.lignes.forEach(function (l) {
    var el = document.createElement("div");
    el.className = "ligne" + (G.selLigne === l.id ? " sel" : "");
    var nb = G.rames.filter(function (r) { return r.ligne === l.id; }).length;
    el.innerHTML = '<span class="pastille" style="background:' + COUL[l.id] + '"></span>'
      + '<span class="n">' + NOMS_L[l.id] + "</span>"
      + '<span class="st">' + l.stations.length + " stations · " + nb + " rame" + (nb > 1 ? "s" : "") + "</span>";
    el.onclick = function () { actions.choisirLigne(l.id); };
    ll.appendChild(el);
  });
  if (G.lignes.length < MAX_LIGNES) {
    var el2 = document.createElement("div");
    el2.className = "ligne libre";
    el2.innerHTML = '<span class="pastille" style="background:var(--trait)"></span>'
      + '<span class="n">Ligne supplémentaire — dotation de fin de semaine</span>';
    ll.appendChild(el2);
  }

  var st = $("#stock");
  if (G.dotation) {
    st.innerHTML = '<span class="item on" data-d="rame"><b>+1</b> rame sur la ligne ' + NOMS_L[G.selLigne].toLowerCase() + "</span>"
      + '<span class="item on" data-d="ligne"><b>+1</b> ligne' + (G.lignes.length >= MAX_LIGNES ? " (max atteint)" : "") + "</span>";
    st.querySelectorAll("[data-d]").forEach(function (el) {
      el.onclick = function () { actions.prendreDotation(el.dataset.d); };
    });
  } else {
    st.innerHTML = '<span class="item vide">Prochaine dotation à minuit</span>';
  }

  $("#pause").textContent = G.fini ? "Réseau arrêté" : (G.pause ? "Reprendre" : "Pause");
  $("#pause").disabled = G.fini;
  $("#note").innerHTML = G.fini ? "" : "Une station en surcharge se dégonfle dès qu'une rame la dessert.";
}
