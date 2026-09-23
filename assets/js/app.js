(() => {
  "use strict";

  const CONFIG = window.BAKEYTA_CONFIG;
  const PRODUITS = window.BAKEYTA_PRODUITS;
  const GUIDES = window.BAKEYTA_GUIDES;
  const NBSP = " ";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // Stockage local protégé : certains navigateurs (navigation privée) le bloquent.
  const store = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sans stockage, le panier vit le temps de la visite */ }
    },
  };

  /* ---------- Prix et devises ---------- */
  let devise = store.get("bkt-devise", "XOF");
  if (!CONFIG.devises[devise]) devise = "XOF";

  const nombre = (n, dec = 0) =>
    new Intl.NumberFormat("fr-FR", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(n).replace(/ /g, NBSP);

  const fcfa = (montant) => `${nombre(montant)}${NBSP}FCFA`;

  function prix(montant, code = devise) {
    if (code === "XOF") return fcfa(montant);
    const d = CONFIG.devises[code];
    const valeur = montant / d.taux;
    return `${code === "USD" ? "≈" + NBSP : ""}${nombre(valeur, 2)}${NBSP}${d.libelle}`;
  }

  /* ---------- WhatsApp ---------- */
  const waUrl = (texte) => `https://wa.me/${CONFIG.whatsapp}${texte ? "?text=" + encodeURIComponent(texte) : ""}`;

  $$(".js-wa-link").forEach((a) => {
    a.href = waUrl("Bonjour BAKEYTA ! J'ai une question sur vos articles.");
  });

  /* ---------- Catalogue ---------- */
  const grille = $("#grille-produits");
  const produitParId = (id) => PRODUITS.find((p) => p.id === id);
  const statutLibelle = { precommande: "Précommande", epuise: "Épuisé" };

  function carteProduit(p) {
    const badge = p.statut !== "disponible" ? `<span class="badge ${p.statut}">${statutLibelle[p.statut]}</span>` : "";
    const imgs = p.images
      .slice(0, 2)
      .map((img, i) => `<img src="${img.src}" alt="${i === 0 ? esc(img.alt) : ""}" loading="lazy" decoding="async" width="600" height="640">`)
      .join("");
    return `
      <li class="card" data-categorie="${p.categorie}">
        <div class="card-media">${badge}${imgs}</div>
        <div class="card-body">
          <h3 class="card-title"><a href="#produit-${p.id}" data-produit="${p.id}">${esc(p.nom)}</a></h3>
          <p class="card-meta"><span class="swatch" style="--c:${p.teinte}"></span>${esc(p.coloris)}</p>
          <p class="price" data-prix="${p.prix}">${prix(p.prix)}</p>
        </div>
      </li>`;
  }

  function afficherCatalogue(filtre = "tout") {
    const liste = PRODUITS.filter((p) => filtre === "tout" || p.categorie === filtre);
    grille.innerHTML = liste.map(carteProduit).join("");
  }

  $$(".chip[data-filtre]").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".chip[data-filtre]").forEach((c) => c.setAttribute("aria-pressed", String(c === chip)));
      afficherCatalogue(chip.dataset.filtre);
    });
  });

  grille.addEventListener("click", (e) => {
    const lien = e.target.closest("[data-produit]");
    if (!lien) return;
    e.preventDefault();
    ouvrirProduit(lien.dataset.produit);
  });

  /* ---------- Fiche produit ---------- */
  const modal = $("#product-modal");
  const modalBody = $("#product-modal-body");

  function ouvrirProduit(id, { historique = true } = {}) {
    const p = produitParId(id);
    if (!p) return;
    const unique = p.tailles.length === 1;
    const epuise = p.statut === "epuise";
    const actionLibelle = p.statut === "precommande" ? "Précommander" : "Ajouter au panier";

    modalBody.innerHTML = `
      <button class="icon-btn pm-close" type="button" data-close aria-label="Fermer la fiche produit">
        <svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22"><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>
      </button>
      <div class="pm-gallery">
        <div class="pm-main"><img id="pm-img" src="${p.images[0].src}" alt="${esc(p.images[0].alt)}"></div>
        ${p.images.length > 1 ? `<div class="pm-thumbs" role="group" aria-label="Autres vues">
          ${p.images.map((img, i) => `<button type="button" data-img="${i}" aria-current="${i === 0}" aria-label="Vue ${i + 1} sur ${p.images.length}"><img src="${img.src}" alt=""></button>`).join("")}
        </div>` : ""}
      </div>
      <div class="pm-info">
        <p class="pm-accroche">${esc(p.accroche)}</p>
        <h2 id="pm-nom">${esc(p.nom)}</h2>
        <p class="pm-ref">Réf. ${p.id} · ${esc(p.coloris)}</p>
        <p class="pm-price">${prix(p.prix)}${devise !== "XOF" ? ` <small class="pm-ref">(${fcfa(p.prix)})</small>` : ""}</p>
        <p class="pm-desc">${esc(p.description)}</p>

        <form id="pm-form" novalidate>
          <p class="option-label" id="pm-taille-label">
            <span>Taille${unique ? "" : " <span aria-hidden=\"true\">*</span>"}</span>
            <a href="#tailles" data-guide="${p.guide}">Guide des tailles</a>
          </p>
          <fieldset class="sizes" aria-labelledby="pm-taille-label">
            ${p.tailles.map((t) => `<label><input type="radio" name="taille" value="${t}" ${unique ? "checked" : ""} required><span>${t}</span></label>`).join("")}
          </fieldset>
          <p class="form-error" id="pm-error" role="alert"></p>

          <div class="buy-row">
            <div class="qty" role="group" aria-label="Quantité">
              <button type="button" data-qty="-1" aria-label="Diminuer la quantité">−</button>
              <output id="pm-qty" aria-live="polite">1</output>
              <button type="button" data-qty="1" aria-label="Augmenter la quantité">+</button>
            </div>
            <button class="btn btn-primary" type="submit" ${epuise ? "disabled" : ""}>${epuise ? "Épuisé" : actionLibelle}</button>
          </div>
          <a class="btn btn-ghost btn-block pm-direct" id="pm-direct" href="#" target="_blank" rel="noopener">Commander directement sur WhatsApp</a>
        </form>

        <dl class="specs">
          ${p.details.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}
          <div><dt>Entretien</dt><dd>30${NBSP}°C sur l'envers, sans sèche-linge</dd></div>
        </dl>
      </div>`;

    let qte = 1;
    const form = $("#pm-form", modalBody);
    const tailleChoisie = () => form.taille?.value || $("input[name=taille]:checked", form)?.value || "";

    const majLienDirect = () => {
      const t = tailleChoisie();
      $("#pm-direct", modalBody).href = waUrl(
        `Bonjour BAKEYTA ! Je souhaite commander :\n• ${p.nom} (${p.coloris})${t ? `, taille ${t}` : ""}, quantité ${qte}\nRéf. ${p.id} · ${fcfa(p.prix * qte)}\n\nMerci de me confirmer la disponibilité.`,
      );
    };
    majLienDirect();

    // onclick (et non addEventListener) : un seul gestionnaire, remplacé à chaque ouverture
    modalBody.onclick = (e) => {
      const thumb = e.target.closest("[data-img]");
      if (thumb) {
        const img = p.images[+thumb.dataset.img];
        const main = $("#pm-img", modalBody);
        main.src = img.src;
        main.alt = img.alt;
        $$("[data-img]", modalBody).forEach((b) => b.setAttribute("aria-current", String(b === thumb)));
      }
      const q = e.target.closest("[data-qty]");
      if (q) {
        qte = Math.min(20, Math.max(1, qte + Number(q.dataset.qty)));
        $("#pm-qty", modalBody).textContent = qte;
        majLienDirect();
      }
      const guide = e.target.closest("[data-guide]");
      if (guide) {
        e.preventDefault();
        fermer(modal);
        choisirGuide(guide.dataset.guide);
        $("#tailles").scrollIntoView();
      }
    };
    form.addEventListener("change", () => {
      $("#pm-error", modalBody).textContent = "";
      majLienDirect();
    });
    $("#pm-direct", modalBody).addEventListener("click", (e) => {
      if (!tailleChoisie()) {
        e.preventDefault();
        $("#pm-error", modalBody).textContent = "Choisis d'abord ta taille.";
      }
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const t = tailleChoisie();
      if (!t) {
        $("#pm-error", modalBody).textContent = "Choisis d'abord ta taille.";
        $("input[name=taille]", form).focus();
        return;
      }
      ajouterAuPanier(p.id, t, qte);
      fermer(modal);
      notifier(`${p.nom} (${t}) ajouté au panier`);
    });

    if (historique && location.hash !== `#produit-${p.id}`) history.pushState({ produit: p.id }, "", `#produit-${p.id}`);
    if (!modal.open) modal.showModal();
    modalBody.scrollTop = 0;
  }

  /* ---------- Panier ---------- */
  let panier = store.get("bkt-panier", []).filter((l) => produitParId(l.id));
  const drawer = $("#cart");
  const form = $("#checkout");
  const zoneSelect = $("#zone");

  zoneSelect.innerHTML =
    `<option value="">Choisis ta zone</option>` +
    CONFIG.livraison.map((z) => `<option value="${z.id}">${esc(z.nom)}</option>`).join("");

  const cle = (id, taille) => `${id}|${taille}`;
  const sauver = () => store.set("bkt-panier", panier);

  function ajouterAuPanier(id, taille, qte) {
    const ligne = panier.find((l) => cle(l.id, l.taille) === cle(id, taille));
    if (ligne) ligne.qte = Math.min(20, ligne.qte + qte);
    else panier.push({ id, taille, qte });
    sauver();
    afficherPanier();
    const compteur = $("#cart-count");
    compteur.classList.remove("bump");
    void compteur.offsetWidth; // relance l'animation
    compteur.classList.add("bump");
  }

  const sousTotal = () => panier.reduce((s, l) => s + produitParId(l.id).prix * l.qte, 0);
  const zoneChoisie = () => CONFIG.livraison.find((z) => z.id === zoneSelect.value);

  function afficherPanier() {
    const n = panier.reduce((s, l) => s + l.qte, 0);
    $("#cart-count").textContent = n;
    $("#cart-empty").hidden = n > 0;
    form.hidden = n === 0;

    $("#cart-items").innerHTML = panier
      .map((l) => {
        const p = produitParId(l.id);
        return `
        <li class="cart-item" data-cle="${cle(l.id, l.taille)}">
          <img src="${p.images[0].src}" alt="" width="64" height="64">
          <div>
            <h3>${esc(p.nom)}</h3>
            <p>${esc(p.coloris)} · Taille ${l.taille}</p>
            <div class="qty" role="group" aria-label="Quantité de ${esc(p.nom)}">
              <button type="button" data-delta="-1" aria-label="Retirer un exemplaire">−</button>
              <output>${l.qte}</output>
              <button type="button" data-delta="1" aria-label="Ajouter un exemplaire">+</button>
            </div>
          </div>
          <div class="cart-item-side">
            ${prix(p.prix * l.qte)}<br>
            <button type="button" class="link-btn" data-supprimer>Retirer</button>
          </div>
        </li>`;
      })
      .join("");

    const st = sousTotal();
    const z = zoneChoisie();
    $("#t-sous-total").textContent = prix(st);
    $("#t-livraison").textContent = !z ? "Choisis ta zone" : z.frais == null ? "Confirmé sur WhatsApp" : prix(z.frais);
    $("#t-total").textContent = prix(st + (z?.frais ?? 0)) + (z && z.frais == null ? " + livraison" : "");
  }

  $("#cart-items").addEventListener("click", (e) => {
    const li = e.target.closest(".cart-item");
    if (!li) return;
    const ligne = panier.find((l) => cle(l.id, l.taille) === li.dataset.cle);
    const delta = e.target.closest("[data-delta]");
    if (delta) ligne.qte += Number(delta.dataset.delta);
    if (e.target.closest("[data-supprimer]") || ligne.qte < 1) panier = panier.filter((l) => l !== ligne);
    else ligne.qte = Math.min(20, ligne.qte);
    sauver();
    afficherPanier();
    if (!panier.length) $("#cart [data-close]").focus();
  });

  // Coordonnées du client mémorisées pour la prochaine commande
  const client = store.get("bkt-client", {});
  ["zone", "nom", "tel", "adresse"].forEach((k) => { if (client[k]) form.elements[k].value = client[k]; });
  zoneSelect.addEventListener("change", afficherPanier);

  function numeroCommande() {
    const d = new Date();
    const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
    return `BKT-${date}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const erreur = $("#form-error");
    let premierInvalide = null;
    ["zone", "nom", "tel", "adresse"].forEach((k) => {
      const champ = form.elements[k];
      const ok = champ.value.trim() !== "" && (k !== "tel" || champ.value.replace(/\D/g, "").length >= 8);
      champ.setAttribute("aria-invalid", String(!ok));
      if (!ok && !premierInvalide) premierInvalide = champ;
    });
    if (premierInvalide) {
      erreur.textContent = premierInvalide.name === "tel" ? "Vérifie ton numéro de téléphone." : "Merci de remplir les champs de livraison.";
      premierInvalide.focus();
      return;
    }
    erreur.textContent = "";

    const v = Object.fromEntries(new FormData(form));
    store.set("bkt-client", { zone: v.zone, nom: v.nom, tel: v.tel, adresse: v.adresse });
    const z = zoneChoisie();
    const st = sousTotal();

    const lignes = panier.map((l) => {
      const p = produitParId(l.id);
      return `• ${l.qte} × ${p.nom} (${p.coloris}), taille ${l.taille} : ${fcfa(p.prix * l.qte)}`;
    });
    const texte = [
      `Bonjour BAKEYTA ! Voici ma commande ${numeroCommande()} :`,
      "",
      ...lignes,
      "",
      `Sous-total : ${fcfa(st)}`,
      `Livraison (${z.nom}) : ${z.frais == null ? "à confirmer" : fcfa(z.frais)}`,
      `Total : ${fcfa(st + (z.frais ?? 0))}${z.frais == null ? " + livraison" : ""}`,
      "",
      `Nom : ${v.nom.trim()}`,
      `Téléphone : ${v.tel.trim()}`,
      `Adresse : ${v.adresse.trim()}`,
      v.note.trim() ? `Message : ${v.note.trim()}` : "",
      "",
      "Merci de me confirmer la disponibilité et le mode de paiement.",
    ]
      .filter((l, i, arr) => l !== "" || arr[i - 1] !== "")
      .join("\n");

    window.open(waUrl(texte), "_blank", "noopener");
    notifier("Commande prête : envoie le message sur WhatsApp");
  });

  /* ---------- Fenêtres ---------- */
  function fermer(dlg) {
    if (!dlg.open) return;
    dlg.close();
  }

  $("#open-cart").addEventListener("click", () => {
    afficherPanier();
    drawer.showModal();
  });

  [modal, drawer].forEach((dlg) => {
    dlg.addEventListener("click", (e) => {
      if (e.target === dlg || e.target.closest("[data-close]")) fermer(dlg);
    });
  });

  modal.addEventListener("close", () => {
    if (location.hash.startsWith("#produit-")) history.replaceState(null, "", location.pathname + location.search + "#collection");
  });

  // Lien direct vers un produit (#produit-BKT-...) et bouton « retour » du téléphone
  function routeur() {
    const m = location.hash.match(/^#produit-(.+)$/);
    if (m && produitParId(m[1])) ouvrirProduit(m[1], { historique: false });
    else fermer(modal);
  }
  window.addEventListener("popstate", routeur);

  /* ---------- Guide des tailles (onglets accessibles) ---------- */
  const guides = $("#guides");
  const cles = Object.keys(GUIDES);
  guides.innerHTML = `
    <div class="tab-list" role="tablist" aria-label="Article">
      ${cles.map((k, i) => `<button class="chip" role="tab" id="tab-${k}" aria-controls="panel-${k}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-tab="${k}">${GUIDES[k].titre}</button>`).join("")}
    </div>
    ${cles
      .map((k, i) => {
        const g = GUIDES[k];
        return `
      <div class="tab-panel" role="tabpanel" id="panel-${k}" aria-labelledby="tab-${k}" ${i === 0 ? "" : "hidden"}>
        <div class="table-scroll" tabindex="0" role="region" aria-label="Mesures ${g.titre} en centimètres">
          <table class="size-table">
            <thead><tr><th scope="col">Mesure (cm)</th>${g.tailles.map((t) => `<th scope="col">${t}</th>`).join("")}</tr></thead>
            <tbody>${g.lignes.map(([nom, ...vals]) => `<tr><th scope="row">${nom}</th>${vals.map((v) => `<td>${typeof v === "number" ? nombre(v) : v}</td>`).join("")}</tr>`).join("")}</tbody>
          </table>
        </div>
        <p class="tab-conseil"><strong>Conseil :</strong> ${g.conseil}</p>
      </div>`;
      })
      .join("")}`;

  function choisirGuide(k) {
    $$("[role=tab]", guides).forEach((t) => {
      const actif = t.dataset.tab === k;
      t.setAttribute("aria-selected", String(actif));
      t.tabIndex = actif ? 0 : -1;
      $(`#panel-${t.dataset.tab}`).hidden = !actif;
    });
  }
  guides.addEventListener("click", (e) => {
    const tab = e.target.closest("[role=tab]");
    if (tab) choisirGuide(tab.dataset.tab);
  });
  guides.addEventListener("keydown", (e) => {
    if (!["ArrowLeft", "ArrowRight"].includes(e.key) || e.target.getAttribute("role") !== "tab") return;
    const i = cles.indexOf(e.target.dataset.tab);
    const suivant = cles[(i + (e.key === "ArrowRight" ? 1 : -1) + cles.length) % cles.length];
    choisirGuide(suivant);
    $(`#tab-${suivant}`).focus();
  });

  /* ---------- Livraison, paiement, contact ---------- */
  function afficherZones() {
    $("#zones").innerHTML = CONFIG.livraison
      .map((z) => `<li><h3>${esc(z.nom)}</h3><p>Délai indicatif : ${esc(z.delai)}</p><p class="frais">${z.frais == null ? "Frais confirmés sur WhatsApp" : prix(z.frais)}</p></li>`)
      .join("");
  }
  $("#paiements").innerHTML = CONFIG.paiements.map((m) => `<li>${esc(m)}</li>`).join("");

  const contact = [`<li><a href="${waUrl()}" target="_blank" rel="noopener">WhatsApp</a></li>`];
  if (CONFIG.email) contact.push(`<li><a href="mailto:${CONFIG.email}">${esc(CONFIG.email)}</a></li>`);
  const noms = { instagram: "Instagram", tiktok: "TikTok", youtube: "YouTube", facebook: "Facebook" };
  Object.entries(CONFIG.reseaux).forEach(([k, url]) => { if (url) contact.push(`<li><a href="${url}" target="_blank" rel="noopener">${noms[k]}</a></li>`); });
  $("#footer-contact").innerHTML = contact.join("");
  $("#annee").textContent = new Date().getFullYear();

  /* ---------- Sélecteur de devise ---------- */
  const deviseSelect = $("#devise");
  deviseSelect.value = devise;
  deviseSelect.addEventListener("change", () => {
    devise = deviseSelect.value;
    store.set("bkt-devise", devise);
    $$("[data-prix]").forEach((el) => { el.textContent = prix(Number(el.dataset.prix)); });
    afficherZones();
    afficherPanier();
  });

  /* ---------- Menu mobile ---------- */
  const menuBtn = $("#menu-btn");
  const menu = $("#menu");
  const basculerMenu = (ouvrir) => {
    menu.classList.toggle("open", ouvrir);
    menuBtn.setAttribute("aria-expanded", String(ouvrir));
  };
  menuBtn.addEventListener("click", () => basculerMenu(!menu.classList.contains("open")));
  menu.addEventListener("click", (e) => { if (e.target.closest("a")) basculerMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("open")) { basculerMenu(false); menuBtn.focus(); }
  });

  /* ---------- Notification ---------- */
  let minuteur;
  function notifier(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(minuteur);
    minuteur = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---------- Données structurées (référencement Google) ---------- */
  const base = location.origin + location.pathname.replace(/index\.html$/, "");
  const jsonLd = document.createElement("script");
  jsonLd.type = "application/ld+json";
  jsonLd.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "ClothingStore", name: "BAKEYTA", slogan: "Sois le changement.", url: base, logo: base + "assets/img/embleme-512.png", address: { "@type": "PostalAddress", addressCountry: "TG", addressLocality: "Lomé" } },
      ...PRODUITS.map((p) => ({
        "@type": "Product",
        sku: p.id,
        name: `BAKEYTA ${p.nom}`,
        color: p.coloris,
        description: p.description,
        image: base + p.images[0].src,
        brand: { "@type": "Brand", name: "BAKEYTA" },
        offers: {
          "@type": "Offer",
          price: p.prix,
          priceCurrency: "XOF",
          availability: `https://schema.org/${p.statut === "epuise" ? "OutOfStock" : p.statut === "precommande" ? "PreOrder" : "InStock"}`,
        },
      })),
    ],
  });
  document.head.appendChild(jsonLd);

  /* ---------- Démarrage ---------- */
  afficherCatalogue();
  afficherZones();
  afficherPanier();
  routeur();
})();
