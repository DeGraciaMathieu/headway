import {
  PROBA_APPARITION_BASE,
  PROBA_APPARITION_PAR_SEMAINE,
  FACTEUR_HEURE_POINTE,
  POINTE_MATIN_DEBUT,
  POINTE_MATIN_FIN,
  POINTE_SOIR_DEBUT,
  POINTE_SOIR_FIN,
  PROBA_EVITE_MEME_FORME,
  FORMES,
} from "../config.js";

// Heure de pointe : plage du matin ou plage du soir.
export function estHeurePointe(horloge) {
  return (horloge > POINTE_MATIN_DEBUT && horloge < POINTE_MATIN_FIN)
      || (horloge > POINTE_SOIR_DEBUT && horloge < POINTE_SOIR_FIN);
}

// Probabilité qu'un voyageur apparaisse à ce tick : croît avec la semaine et
// est amplifiée en heure de pointe.
export function probaApparition(semaine, pointe) {
  const base = PROBA_APPARITION_BASE + semaine * PROBA_APPARITION_PAR_SEMAINE;
  return base * (pointe ? FACTEUR_HEURE_POINTE : 1);
}

// Forme de destination d'un nouveau voyageur. Le triangle n'est possible qu'à
// partir de la semaine 3, et on évite le plus souvent la forme de la station
// de départ.
export function formeVoyageur(rng, semaine, formeStation) {
  const maxIndex = Math.min(2, semaine > 2 ? 2 : 1);
  let cible;
  do {
    cible = FORMES[Math.floor(rng() * (maxIndex + 1))];
  } while (cible === formeStation && rng() < PROBA_EVITE_MEME_FORME);
  return cible;
}
