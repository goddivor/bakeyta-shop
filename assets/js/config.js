/*
 * Réglages de la boutique BAKEYTA.
 * C'est le SEUL fichier à modifier pour changer le numéro WhatsApp,
 * les frais de livraison, les moyens de paiement ou les taux de change.
 */
// Adresse de l'API (catalogue et commandes). En local : le serveur de développement.
window.BAKEYTA_API = ["localhost", "127.0.0.1"].includes(location.hostname)
  ? "http://localhost:4000"
  : "https://bakeyta-api.vercel.app";

/*
 * Données de secours : utilisées seulement si l'API ne répond pas.
 * Les vraies valeurs se gèrent désormais depuis le tableau de bord.
 */
window.BAKEYTA_CONFIG = {
  // Numéro WhatsApp qui reçoit les commandes : format international, chiffres uniquement.
  // Exemple pour le Togo : "22890000000" (228 = indicatif du Togo).
  whatsapp: "22892127449",

  email: "", // ex. "contact@bakeyta.com" (laisser vide pour masquer)

  reseaux: {
    instagram: "https://www.instagram.com/mornex_bakeyta",
    tiktok: "https://www.tiktok.com/@mornex_bakeyta",
    youtube: "https://www.youtube.com/@mornex.bakeyta",
    x: "https://x.com/MornexBakeyta",
    facebook: "https://www.facebook.com/p/Mornex-Bakeyta-61579113844569/",
  },

  // Devise de base : tous les prix du catalogue sont en francs CFA (XOF).
  devises: {
    XOF: { libelle: "FCFA", taux: 1 },
    EUR: { libelle: "€", taux: 655.957 }, // parité fixe FCFA / euro
    USD: { libelle: "$", taux: 600 }, // taux indicatif : à mettre à jour de temps en temps
  },

  // Zones de livraison. frais: null = « calculé et confirmé sur WhatsApp ».
  livraison: [
    { id: "lome", nom: "Lomé et environs", delai: "24 à 48 h", frais: 1000 },
    { id: "togo", nom: "Reste du Togo", delai: "2 à 4 jours", frais: 2500 },
    { id: "afrique", nom: "Afrique", delai: "5 à 10 jours", frais: null },
    { id: "monde", nom: "Reste du monde", delai: "7 à 15 jours", frais: null },
  ],

  paiements: [
    "Flooz (Moov Africa)",
    "T-Money / Mixx by Yas",
    "Espèces à la livraison (Lomé)",
    "Western Union, MoneyGram ou Ria (hors Togo)",
  ],
};
