/* ----------------------------------------------------------
RÉCUPÉRATION DES INFORMATIONS PRÉSENTES DANS LE LOCAL STORAGE    ------------------------------------------------------------- */  

// Récupération des information présente dans le Local Storage :
let produitEnregistreDansLocalStorage = JSON.parse(localStorage.getItem("produit"));

console.log("Tableau des produits enregistrer dans le Local Storage :");
console.log(produitEnregistreDansLocalStorage);


/* -------------------------------
SI PANIER VIDE => MESSAGE D'ERREUR
---------------------------------- */

const panierVide = () => {
    if (produitEnregistreDansLocalStorage === null || produitEnregistreDansLocalStorage == 0) {
        const structureMsgPanierVide = document.querySelector("h1");

        document.querySelector(".cart").textContent = "";

        structureMsgPanierVide.textContent = "";
        structureMsgPanierVide.innerHTML += `<div class="msg_panierVide"> <h2> Votre panier est vide !</h2> <img src="../images/icon_emptycart.svg" alt="icone-panier-vide" class="empty_cart"> </div> <div class="contentAccueilBtn">
        <a href="index.html" class="btnAccueil"> Découvrez nos produits </a>
      </div> `;
    };
};

panierVide();

/* -------------------------------------
SI PRODUIT(S) PRESENT DANS LE LOCAL STORAGE  
---------------------------------------- */


