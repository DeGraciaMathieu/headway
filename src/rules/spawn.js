import {
  PROBA_APPARITION_BASE,
  PROBA_APPARITION_PAR_SEMAINE,
  FACTEUR_HEURE_POINTE,
  POINTE_MATIN_DEBUT,
  POINTE_MATIN_FIN,
  POINTE_SOIR_DEBUT,
  POINTE_SOIR_FIN,
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

// Forme de destination d'un nouveau voyageur : une forme présente ailleurs
// dans le réseau et différente de celle de sa station de départ. On ne cible
// qu'une forme qui existe déjà (sinon le voyageur serait indélivrable), et
// jamais la station où l'on se trouve. Rend null si aucune cible valide.
export function formeVoyageur(rng, formeStation, formesPresentes) {
  const cibles = formesPresentes.filter((f) => f !== formeStation);
  if (!cibles.length) return null;
  return cibles[Math.floor(rng() * cibles.length)];
}
