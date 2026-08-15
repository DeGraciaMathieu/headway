// Traite l'arrêt d'une rame en station selon le routage.
// `distParForme` : forme -> tableau de distances par index de station
// (voir rules/routing.js). `charge` : formes à bord. `attente` : file de la
// station (`{ f, age }`). `ligneStations` : indices des arrêts de la ligne.
// `iStation` : index global de la station de l'arrêt. `capacite` : nombre de
// voyageurs que peut embarquer une rame de cette ligne.
//
// Descentes d'abord, puis montées :
// - un voyageur à bord dont la station est de sa forme (distance 0) est arrivé ;
// - sinon, si la station est le meilleur point de sortie de cette ligne vers sa
//   forme (distance minimale de la ligne), il descend pour prendre une
//   correspondance et rejoint la file ;
// - un voyageur en attente monte si cette ligne le rapproche de sa forme.
//
// Rend la nouvelle charge, la nouvelle file et le nombre d'arrivées.
export function traiterArret(charge, attente, ligneStations, iStation, distParForme, capacite) {
  const minSurLigne = (f) => Math.min.apply(null, ligneStations.map((i) => distParForme[f][i]));

  let transportes = 0;
  const nouvelleCharge = [];
  const correspondances = [];
  charge.forEach((f) => {
    const d = distParForme[f][iStation];
    if (d === 0) transportes++;
    else if (Number.isFinite(d) && d === minSurLigne(f)) correspondances.push(f);
    else nouvelleCharge.push(f);
  });

  const file = attente.concat(correspondances.map((f) => ({ f, age: 0 })));
  const reste = [];
  file.forEach((t) => {
    const d = distParForme[t.f][iStation];
    const rapproche = d > 0 && minSurLigne(t.f) < d;
    if (rapproche && nouvelleCharge.length < capacite) nouvelleCharge.push(t.f);
    else reste.push(t);
  });

  return { charge: nouvelleCharge, attente: reste, transportes };
}
