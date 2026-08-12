// Dimensions de la carte (viewBox SVG)
export const CARTE_W = 380;
export const CARTE_H = 300;

// Boucle et horloge
export const TICK_MS = 90;                  // durée d'un tick
export const MINUTES_PAR_TICK = 2;          // avance de l'horloge par tick
export const MINUTES_PAR_JOUR = 24 * 60;    // longueur d'une journée simulée
export const HORLOGE_DEPART = 6 * 60;       // 06:00

// Couleurs et libellés des lignes, formes des voyageurs
export const COUL = ["#e0483c", "#2f6fd0", "#f0b429", "#3f9e6a"];
export const NOMS_L = ["Rouge", "Bleue", "Jaune", "Verte"];
export const FORMES = ["rond", "carre", "triangle"];
export const INDEX_FORMES_MAX = 2;          // dernier index de FORMES (le triangle)
export const STATIONS_MIN_LIGNE = 2;        // arrêts minimum pour qu'une ligne soit active

// Mise en place initiale
export const STATIONS_INITIALES = 5;
export const RONDS_INITIAUX = 3;            // les 3 premières stations sont des ronds

// Placement des stations
export const MARGE_X = 40;
export const MARGE_Y = 36;
export const DISTANCE_MIN_STATIONS = 58;
export const ESSAIS_PLACEMENT_MAX = 200;

// Apparition des voyageurs
export const PROBA_APPARITION_BASE = 0.020;
export const PROBA_APPARITION_PAR_SEMAINE = 0.006;
export const FACTEUR_HEURE_POINTE = 1.8;
export const POINTE_MATIN_DEBUT = 7 * 60;
export const POINTE_MATIN_FIN = 10 * 60;
export const POINTE_SOIR_DEBUT = 16 * 60;
export const POINTE_SOIR_FIN = 19 * 60;
export const PROBA_EVITE_MEME_FORME = 0.8;  // re-tirage si la forme = celle de la station de départ

// Capacités
export const CAPACITE_FILE = 14;            // file d'attente d'une station
export const CAPACITE_RAME = 6;             // voyageurs embarqués

// Rames
export const VITESSE_RAME = 0.035;          // stations par tick
export const SEUIL_ARRET = 0.036;           // proximité d'un arrêt

// Surcharge
export const SEUIL_SURCHARGE = 8;           // taille de file où la surcharge commence
export const TAUX_SURCHARGE_CROISSANCE = 0.0032;
export const TAUX_SURCHARGE_DECROISSANCE = 0.010;

// Croissance du réseau
export const PROBA_TRIANGLE = 0.35;
export const SEMAINE_TRIANGLE_MIN = 3;      // semaine à partir de laquelle le triangle apparaît
export const MAX_ARRETS_LIGNE = 8;
export const MAX_LIGNES = 4;

// Rendu SVG
export const RAYON_STATION = 11;
export const CONTOUR_STATION = 3.5;
export const RAYON_SURCHARGE = 18;
export const CONTOUR_SURCHARGE = 3;
export const MAX_VOYAGEURS_QUAI = 8;        // voyageurs dessinés sur un quai
