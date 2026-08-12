import {
  SEUIL_SURCHARGE,
  TAUX_SURCHARGE_CROISSANCE,
  TAUX_SURCHARGE_DECROISSANCE,
} from "../config.js";

// Prochain niveau de surcharge d'une station selon son occupation (voyageurs en
// attente + emplacements bloqués) : croît quand l'occupation atteint le seuil,
// décroît sinon. Borné dans [0, 1].
export function prochaineSurcharge(surcharge, occupation) {
  if (occupation >= SEUIL_SURCHARGE)
    return Math.min(1, surcharge + TAUX_SURCHARGE_CROISSANCE * (occupation - (SEUIL_SURCHARGE - 1)));
  return Math.max(0, surcharge - TAUX_SURCHARGE_DECROISSANCE);
}

// Une station est saturée quand sa surcharge atteint 1 : le réseau s'arrête.
export function estSaturee(surcharge) {
  return surcharge >= 1;
}
