// Relie les boutons fixes de l'interface aux intentions correspondantes.
export function brancherBoutons({ pause, rejouer, aide, fermer }) {
  const $ = (s) => document.querySelector(s);
  $("#pause").onclick = pause;
  $("#rejouer").onclick = rejouer;
  $("#aide").onclick = aide;
  $("#fermer").onclick = fermer;
}
