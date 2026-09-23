# BAKEYTA Streetwear : boutique en ligne

Vitrine et boutique de la collection 01 « Renaissance » de BAKEYTA. Le site est **statique** (HTML, CSS et JavaScript, sans framework ni base de données) : il s'héberge gratuitement et reste léger sur les connexions mobiles.

Les commandes passent par **WhatsApp**. Le client remplit son panier, indique sa zone de livraison et ses coordonnées, puis le site ouvre WhatsApp avec un message de commande déjà rédigé (numéro de commande, articles, tailles, total). Le paiement (Flooz, T-Money / Mixx by Yas, espèces, transfert international) et la livraison se règlent ensuite directement avec le client.

## Avant la mise en ligne : à faire absolument

1. **Numéro WhatsApp** : dans `assets/js/config.js`, remplacer `22800000000` par le vrai numéro (format international, chiffres uniquement, par exemple `22890123456`).
2. **Prix** : les prix actuels (12 000, 20 000 et 8 000 FCFA) sont **provisoires**. Les ajuster dans `assets/js/produits.js`.
3. **Frais de livraison** : vérifier les montants et délais dans `assets/js/config.js` (`livraison`).
4. **Réseaux sociaux et e-mail** : les renseigner dans `assets/js/config.js` (ils s'affichent automatiquement dans le pied de page).
5. **Photos** : les visuels actuels sont les dessins techniques extraits du dossier technique. Dès que les vraies photos existent, les déposer dans `assets/img/produits/` (format WebP ou JPG, environ 800 px de large) et mettre à jour les chemins dans `produits.js`.

## Structure

```
index.html              page unique (accueil, collection, histoire, tailles, livraison, FAQ)
assets/css/style.css    styles (palette de la charte : Noir Cendre, Orange Feu, Crème Noyau…)
assets/js/config.js     réglages : WhatsApp, devises, zones de livraison, paiements
assets/js/produits.js   catalogue et guides des tailles
assets/js/app.js        panier, fiche produit, message WhatsApp
assets/img/             logo, emblème, étiquettes, images produits
```

## Ajouter ou modifier un article

Dans `assets/js/produits.js`, copier un bloc produit et adapter : `id` (référence), `nom`, `categorie` (`tshirts`, `bas` ou `accessoires`), `coloris`, `prix` (en FCFA), `tailles`, `images`, `description` et `details`.

Le champ `statut` accepte trois valeurs :

- `"disponible"` : vente normale ;
- `"precommande"` : badge « Précommande » et bouton « Précommander » ;
- `"epuise"` : badge « Épuisé », achat désactivé.

## Tester en local

Ouvrir `index.html` dans un navigateur suffit. Pour un test plus fidèle :

```bash
python -m http.server 5500
# puis ouvrir http://localhost:5500
```

## Mettre en ligne gratuitement

Au choix :

- **Netlify** : glisser-déposer le dossier sur https://app.netlify.com/drop ;
- **Cloudflare Pages** ou **Vercel** : connecter le dépôt GitHub, sans commande de build ;
- **GitHub Pages** : pousser le dépôt sur GitHub, puis activer Pages dans *Settings > Pages*.

Un nom de domaine (par exemple `bakeyta.com`) peut ensuite être relié à l'hébergeur pour environ 10 à 15 € par an.

## Évolutions possibles

- Paiement en ligne via un agrégateur local (FedaPay, CinetPay, PayDunya) : nécessite un compte marchand et un petit serveur.
- Gestion du stock et des commandes dans un tableur ou un back-office.
- Version anglaise pour la clientèle internationale.
