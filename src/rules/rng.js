// Générateur pseudo-aléatoire à graine (LCG), injecté dans les règles.
// Seul le point d'entrée choisit la graine ; un test passe une graine fixe
// pour obtenir un résultat déterministe.
export function createRng(seed) {
  let s = seed >>> 0;
  return function next() {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
