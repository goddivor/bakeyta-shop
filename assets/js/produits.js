/*
 * Catalogue BAKEYTA (Collection 01 : Renaissance).
 * Pour ajouter un article, copier un bloc { … } et adapter les champs.
 * Les prix sont en FCFA. statut : "disponible", "precommande" ou "epuise".
 * Les images sont dans assets/img/produits/ (remplacer par de vraies photos dès qu'elles existent).
 */
window.BAKEYTA_PRODUITS = [
  {
    id: "BKT-TS01-NR",
    nom: "T-shirt oversize Renaissance",
    categorie: "tshirts",
    coloris: "Noir Cendre",
    teinte: "#0E0E0E",
    prix: 12000,
    statut: "disponible",
    tailles: ["S", "M", "L", "XL", "XXL"],
    guide: "tshirt",
    images: [
      { src: "assets/img/produits/tshirt-noir-devant.webp", alt: "T-shirt oversize noir, vue de face, phénix brodé sur la poitrine" },
      { src: "assets/img/produits/tshirt-noir-dos.webp", alt: "T-shirt oversize noir, vue de dos, grand logo BAKEYTA et slogan « Sois le changement. »" },
    ],
    accroche: "Sois le changement.",
    description:
      "Le t-shirt signature de la collection. Phénix brodé en deux couleurs sur la poitrine, grand logo BAKEYTA imprimé au dos avec « Sois le changement. » et « Génération Fenix ».",
    details: [
      ["Coupe", "Oversize carrée, épaules tombantes, manches courtes larges"],
      ["Matière", "Jersey 100 % coton peigné, 240 g/m², pré-rétréci"],
      ["Marquages", "Phénix brodé (poitrine) et logo imprimé DTF (dos)"],
      ["Finitions", "Col bord-côte 2,5 cm, épaules renforcées, ourlets double aiguille"],
    ],
  },
  {
    id: "BKT-TS01-CR",
    nom: "T-shirt oversize Même fruit",
    categorie: "tshirts",
    coloris: "Crème Noyau",
    teinte: "#EFE7DC",
    prix: 12000,
    statut: "disponible",
    tailles: ["S", "M", "L", "XL", "XXL"],
    guide: "tshirt",
    images: [
      { src: "assets/img/produits/tshirt-creme-devant.webp", alt: "T-shirt oversize crème, vue de face, visuel « Même fruit. Nouvelle espèce. » : une mangue qui devient phénix" },
    ],
    accroche: "Même fruit. Nouvelle espèce.",
    description:
      "La mangue devient phénix : on garde les racines, on change de forme. Visuel « Même fruit. Nouvelle espèce. » imprimé sur le devant, sur un coton épais couleur crème.",
    details: [
      ["Coupe", "Oversize carrée, épaules tombantes, manches courtes larges"],
      ["Matière", "Jersey 100 % coton peigné, 240 g/m², pré-rétréci"],
      ["Marquage", "Visuel imprimé DTF sur le devant"],
      ["Finitions", "Col bord-côte 2,5 cm, épaules renforcées, ourlets double aiguille"],
    ],
  },
  {
    id: "BKT-JG01-NR",
    nom: "Jogging Fenix",
    categorie: "bas",
    coloris: "Noir Cendre",
    teinte: "#0E0E0E",
    prix: 20000,
    statut: "disponible",
    tailles: ["S", "M", "L", "XL", "XXL"],
    guide: "jogging",
    images: [
      { src: "assets/img/produits/jogging-devant.webp", alt: "Jogging noir, vue de face, phénix brodé sur la cuisse et logotype BAKEYTA vertical sur la jambe" },
      { src: "assets/img/produits/jogging-dos.webp", alt: "Jogging noir, vue de dos avec poche plaquée" },
    ],
    accroche: "Génération Fenix.",
    description:
      "Jogging ample à jambe fuselée et bas resserré. Molleton gratté tout doux à l'intérieur, phénix brodé sur la cuisse et logotype BAKEYTA vertical le long de la jambe.",
    details: [
      ["Coupe", "Ample, jambe fuselée, bas bord-côte 7 cm"],
      ["Matière", "Molleton gratté 80 % coton, 20 % polyester, 330 g/m²"],
      ["Marquages", "Phénix brodé (cuisse gauche) et logotype sérigraphié (jambe droite)"],
      ["Poches", "2 poches italiennes et 1 poche arrière plaquée"],
      ["Ceinture", "Élastique 4 cm avec cordon plat et œillets métal"],
    ],
  },
  {
    id: "BKT-CP01-NR",
    nom: "Casquette Phénix",
    categorie: "accessoires",
    coloris: "Noir Cendre",
    teinte: "#0E0E0E",
    prix: 8000,
    statut: "disponible",
    tailles: ["Unique"],
    guide: "casquette",
    images: [
      { src: "assets/img/produits/casquette-avant.webp", alt: "Casquette noire, vue de face, phénix brodé en couleurs" },
      { src: "assets/img/produits/casquette-arriere.webp", alt: "Casquette noire, vue arrière, « Sois le changement » brodé au-dessus de la sangle" },
    ],
    accroche: "Sois le changement.",
    description:
      "Casquette six panneaux structurée, visière courbe. Phénix brodé à l'avant, « Sois le changement » brodé à l'arrière et logotype BAKEYTA sur le côté.",
    details: [
      ["Modèle", "6 panneaux structurés, profil moyen, visière courbe"],
      ["Matière", "Sergé 100 % coton"],
      ["Taille", "Unique, réglable de 56 à 60 cm de tour de tête"],
      ["Fermeture", "Sangle en tissu et boucle métal noir mat"],
    ],
  },
];

/* Guides des tailles : mesures du vêtement fini, posé à plat, en cm. */
window.BAKEYTA_GUIDES = {
  tshirt: {
    titre: "T-shirt oversize",
    conseil: "Coupe volontairement large : prends ta taille habituelle pour un effet oversize, une taille en dessous pour un tombé plus classique.",
    tailles: ["S", "M", "L", "XL", "XXL"],
    lignes: [
      ["Longueur totale", 70, 72, 74, 76, 78],
      ["½ tour de poitrine", 57, 60, 63, 66, 69],
      ["Carrure (épaule à épaule)", 54, 56, 58, 60, 62],
      ["Longueur de manche", 22, 23, 24, 25, 26],
    ],
  },
  jogging: {
    titre: "Jogging",
    conseil: "Taille élastique avec cordon : en cas d'hésitation entre deux tailles, prends la plus grande.",
    tailles: ["S", "M", "L", "XL", "XXL"],
    lignes: [
      ["½ tour de taille (relâché)", 34, 36, 38, 40, 42],
      ["½ tour de taille (étiré)", 50, 52, 54, 56, 58],
      ["½ tour de hanches", 52, 54, 56, 58, 60],
      ["Longueur côté", 100, 102, 104, 106, 108],
      ["Entrejambe", 74, 75, 76, 77, 78],
    ],
  },
  casquette: {
    titre: "Casquette",
    conseil: "Taille unique réglable grâce à la sangle arrière.",
    tailles: ["Unique"],
    lignes: [
      ["Tour de tête", "56 à 60"],
      ["Hauteur de couronne", "11,5"],
      ["Longueur de visière", "7"],
    ],
  },
};
