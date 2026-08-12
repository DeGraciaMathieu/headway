import {
  CARTE_W, CARTE_H, COUL,
  RAYON_STATION, CONTOUR_STATION, RAYON_SURCHARGE, CONTOUR_SURCHARGE, MAX_VOYAGEURS_QUAI,
  STATIONS_MIN_LIGNE, RAYON_DEPART, CONTOUR_DEPART,
} from "../config.js";

// SVG d'une station : sa forme, ses voyageurs en attente et son anneau de surcharge.
function formeSVG(s, i) {
  var r = RAYON_STATION;
  var fill = "#fbf9f3", stroke = "#1d1c19";
  var g = '<g class="st" data-i="' + i + '" style="cursor:pointer">';
  if (s.forme === "rond") g += '<circle cx="' + s.x.toFixed(0) + '" cy="' + s.y.toFixed(0) + '" r="' + r + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + CONTOUR_STATION + '"/>';
  else if (s.forme === "carre") g += '<rect x="' + (s.x - r).toFixed(0) + '" y="' + (s.y - r).toFixed(0) + '" width="' + (r * 2) + '" height="' + (r * 2) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + CONTOUR_STATION + '"/>';
  else g += '<polygon points="' + s.x.toFixed(0) + "," + (s.y - r - 2).toFixed(0) + " " + (s.x + r + 1).toFixed(0) + "," + (s.y + r - 3).toFixed(0) + " " + (s.x - r - 1).toFixed(0) + "," + (s.y + r - 3).toFixed(0) + '" fill="' + fill + '" stroke="' + stroke + '" stroke-width="' + CONTOUR_STATION + '"/>';
  /* voyageurs en attente */
  s.attente.slice(0, MAX_VOYAGEURS_QUAI).forEach(function (f, k) {
    var px = s.x - 14 + (k % 4) * 9, py = s.y + (k < 4 ? 18 : 27);
    if (f === "rond") g += '<circle cx="' + px.toFixed(0) + '" cy="' + py.toFixed(0) + '" r="3" fill="#1d1c19"/>';
    else if (f === "carre") g += '<rect x="' + (px - 2.6).toFixed(0) + '" y="' + (py - 2.6).toFixed(0) + '" width="5.2" height="5.2" fill="#1d1c19"/>';
    else g += '<polygon points="' + px.toFixed(0) + "," + (py - 3.4).toFixed(0) + " " + (px + 3).toFixed(0) + "," + (py + 2.4).toFixed(0) + " " + (px - 3).toFixed(0) + "," + (py + 2.4).toFixed(0) + '" fill="#1d1c19"/>';
  });
  if (s.surcharge > 0) {
    var c = 2 * Math.PI * RAYON_SURCHARGE;
    g += '<circle cx="' + s.x.toFixed(0) + '" cy="' + s.y.toFixed(0) + '" r="' + RAYON_SURCHARGE + '" fill="none" stroke="#e0483c" stroke-width="' + CONTOUR_SURCHARGE + '" '
      + 'stroke-dasharray="' + (c * s.surcharge).toFixed(1) + " " + c.toFixed(1) + '" transform="rotate(-90 ' + s.x.toFixed(0) + " " + s.y.toFixed(0) + ')"/>';
  }
  return g + "</g>";
}

// SVG complet de la carte : fond, rivière décorative, lignes, rames, stations.
export function carteSVG(G) {
  var s = '<svg viewBox="0 0 ' + CARTE_W + " " + CARTE_H + '" xmlns="http://www.w3.org/2000/svg">';
  s += '<rect width="' + CARTE_W + '" height="' + CARTE_H + '" fill="#fbf9f3"/>';
  s += '<path d="M0 214 C90 204 150 228 220 218 C290 208 340 224 380 216" fill="none" stroke="#dfe8f2" stroke-width="16"/>';

  G.lignes.forEach(function (l) {
    if (l.stations.length < STATIONS_MIN_LIGNE) return;
    var pts = l.stations.map(function (i) { return G.stations[i].x.toFixed(0) + "," + G.stations[i].y.toFixed(0); }).join(" ");
    s += '<polyline points="' + pts + '" fill="none" stroke="' + COUL[l.id] + '" stroke-width="'
      + (G.selLigne === l.id ? 8 : 6.5) + '" stroke-linecap="round" stroke-linejoin="round" opacity="'
      + (G.selLigne === l.id ? 1 : .85) + '"/>';
  });

  G.rames.forEach(function (r) {
    var l = G.lignes[r.ligne];
    if (!l || l.stations.length < STATIONS_MIN_LIGNE) return;
    var i = Math.floor(r.pos), f = r.pos - i;
    var a = G.stations[l.stations[i]], b = G.stations[l.stations[Math.min(i + 1, l.stations.length - 1)]];
    var x = a.x + (b.x - a.x) * f, y = a.y + (b.y - a.y) * f;
    var ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    s += '<rect x="' + (x - 9).toFixed(0) + '" y="' + (y - 6).toFixed(0) + '" width="18" height="12" fill="#1d1c19" '
      + 'transform="rotate(' + ang.toFixed(0) + " " + x.toFixed(0) + " " + y.toFixed(0) + ')"/>';
    if (r.charge.length)
      s += '<text x="' + x.toFixed(0) + '" y="' + (y - 11).toFixed(0) + '" font-family="Space Grotesk" font-size="10" fill="#1d1c19" text-anchor="middle">' + r.charge.length + "</text>";
  });

  G.stations.forEach(function (st, i) { s += formeSVG(st, i); });

  // Repère du bout actif de la ligne en cours de tracé : la station depuis
  // laquelle le prochain arrêt se relie.
  var sel = G.lignes[G.selLigne];
  if (!G.fini && sel && sel.stations.length) {
    var dep = G.stations[sel.stations[sel.stations.length - 1]];
    s += '<circle cx="' + dep.x.toFixed(0) + '" cy="' + dep.y.toFixed(0) + '" r="' + RAYON_DEPART + '" fill="none" stroke="' + COUL[G.selLigne] + '" stroke-width="' + CONTOUR_DEPART + '" stroke-dasharray="3 3"/>';
  }

  return s + "</svg>";
}
