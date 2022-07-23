/* ----------------------
RÉCUPÉRATION DES INFORMATIONS 
PRÉSENTES DANS LE LOCAL STORAGE    
------------------------- */  

// Récupération des information présente dans le Local Storage :
let produitEnregistreDansLocalStorage = JSON.parse(localStorage.getItem("produit"));

console.log("Tableau des produits enregistrer dans le Local Storage :");
console.log(produitEnregistreDansLocalStorage);

/* -------------------------------
      FONCTION PANIER VIDE
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

/* -------------------------------------
AFFICHAGE DES ELEMENTS : 
MISE EN RELATION DES ELEMENTS DE L'API EN 
FONCTION DES PRODUITS ENREGISTRE DANS LE LOCAL STORAGE
---------------------------------------- */


fetch('http://localhost:3000/api/products')
  .then((response) => response.json())
  .then((dataBase) => {
    if (produitEnregistreDansLocalStorage) {
      for (p of produitEnregistreDansLocalStorage) {
        const produit = dataBase.find((d) => d._id === p.id);
        if (produit) {
          p.price = produit.price;
        }

        const image = dataBase.find((d) => d._id === p.id);
        if(image) {
          p.imageUrl = image.imageUrl;
        }

        const altImage = dataBase.find((d) => d._id === p.id);
        if(altImage) {
          p.altTxt = altImage.altTxt;
        }
      }
    }
    afficherPanier();
    supprimerProduit();
    modificationQuantité()
  })
  .catch((err) => { 
    location.assign("erreur.html");
    console.log("Erreur Serveur : " + err);
    }
  );

/* -------------------------------
      FONCTION AFFICHER PANIER 
---------------------------------- */

function afficherPanier() {
  //Affichage si panier vide :
  if (produitEnregistreDansLocalStorage === null || produitEnregistreDansLocalStorage.length === 0) {
    panierVide();
  } else {
    // si le panier n'est pas vide :
    for (let p in produitEnregistreDansLocalStorage) {
      let article = document.createElement('article');
      document.querySelector('#cart__items').appendChild(article);
      article.classList.add('cart__item');
      article.dataset.id = produitEnregistreDansLocalStorage[p].id;
      article.dataset.color = produitEnregistreDansLocalStorage[p].couleur;

      //creation de la div img
      let divImage = document.createElement('div');
      article.appendChild(divImage);
      divImage.classList.add('cart__item__img');

      // Creation d'un élément 'a', permettant un retour à la page produit. Avec le lien de l'url stocké dans le local storage.
      let linkImage = document.createElement('a');
      divImage.appendChild(linkImage);
      const lienUrl = produitEnregistreDansLocalStorage[p].url;
      linkImage.href = lienUrl;
     
      //Insertion de l'image dans la div img
      let imageInDiv = document.createElement('img');
      linkImage.appendChild(imageInDiv);
      imageInDiv.src = produitEnregistreDansLocalStorage[p].imageUrl;
      imageInDiv.alt = produitEnregistreDansLocalStorage[p].altTxt;
      imageInDiv.classList.add('img__cart')

      //creation de la div cart__item__content
      let divContent = document.createElement('div');
      article.appendChild(divContent);
      divContent.classList.add('cart__item__content');

      //creation de la div cart__item__content__description dans cart__item__content
      let divContentDescription = document.createElement('div');
      divContent.appendChild(divContentDescription);
      divContentDescription.classList.add('cart__item__content__description');

      //creation du h2 dans cart__item__content__description
      let divContentDescriptionH2 = document.createElement('h2');
      divContentDescription.appendChild(divContentDescriptionH2);
      divContentDescriptionH2.textContent = produitEnregistreDansLocalStorage[p].nom;

      //creation du <p></p> pour la color
      let divContentDescriptionP = document.createElement('p');
      divContentDescription.appendChild(divContentDescriptionP);
      divContentDescriptionP.textContent = "Couleur : " + produitEnregistreDansLocalStorage[p].couleur;

      //creation du <p></p> pour le prix
      let divContentDescriptionPrice = document.createElement('p');
      divContentDescription.appendChild(divContentDescriptionPrice);
      divContentDescriptionPrice.textContent = "Prix : " + produitEnregistreDansLocalStorage[p].price + "  €";

      //creation de la div cart__item__content__settings dans la div cart__item__content
      let divContentSettings = document.createElement('div');
      divContent.appendChild(divContentSettings);
      divContentSettings.classList.add('cart__item__content__settings');

      //creation de la div class="cart__item__content__settings__quantity
      let divContentSettingsQuantity = document.createElement('div');
      divContentSettings.appendChild(divContentSettingsQuantity);
      divContentSettingsQuantity.classList.add(
        'cart__item__content__settings__quantity'
      );

      //creation du p dans la div cart__item__content__settings__quantity
      let divContentSettingsQuantityP = document.createElement('p');
      divContentSettingsQuantity.appendChild(divContentSettingsQuantityP);
      divContentSettingsQuantityP.textContent = 'Quantité :';

      //création de <input>
      let inputQuantity = document.createElement('input');
      divContentSettingsQuantity.appendChild(inputQuantity);
      inputQuantity.setAttribute('type', 'number');
      inputQuantity.classList.add('itemQuantity');
      inputQuantity.setAttribute('name', 'itemQuantity');
      inputQuantity.setAttribute('min', '0');
      inputQuantity.setAttribute('max', '100');
      inputQuantity.value = produitEnregistreDansLocalStorage[p].quantite;

      //création de la div cart__item__content__settings__delete
      let itemDelete = document.createElement('div');
      divContentSettings.appendChild(itemDelete);
      itemDelete.classList.add('cart__item__content__settings__delete');

      let itemDeleteP = document.createElement('p');
      itemDelete.appendChild(itemDeleteP);
      itemDeleteP.classList.add('deleteItem');
      itemDeleteP.textContent = 'Supprimer';
    }
  }
};

/* -------------------------------
    FONCTION SUPPRESSION PRODUIT
---------------------------------- */

function supprimerProduit() {

  // Sélection de toutes les références des boutons supprimer
  const btnSupprimer = document.querySelectorAll(".deleteItem");

  // Boucle for qui va parcourir tout les éléments
  for (let l = 0; l < btnSupprimer.length; l++) {
    btnSupprimer[l].addEventListener("click" , (event) => {
      event.preventDefault(); //eviter le comportement par defaut des boutons (rechargement de la page)

      if(
        window.confirm(
          `\n                     Voulez vous supprimer l'article suivant ? 
          \n                                           ${produitEnregistreDansLocalStorage[l].nom} 
          \n                                           Couleur : ${produitEnregistreDansLocalStorage[l].couleur}
          \n                                           Quantités : ${produitEnregistreDansLocalStorage[l].quantite}
          `)
      ) {
        // Selection de l'id et couleur du produit à retirer du localstorage.

        const idProduitASupprimer = produitEnregistreDansLocalStorage[l].id;
        const couleurProduitASupprimer = produitEnregistreDansLocalStorage[l].couleur;

        // Fitler method : Permet de garder en mémoire tout les éléments du tableau, hormis l'élément produits selectionner par le btn Supprimer. 

        produitEnregistreDansLocalStorage = produitEnregistreDansLocalStorage.filter((element) => 
        element.id !== idProduitASupprimer || 
        element.couleur !== couleurProduitASupprimer);

        // Actualisation de la clés "produit" puis un reload de la page. 

        localStorage.setItem("produit", JSON.stringify(produitEnregistreDansLocalStorage)); 
        location.reload();
      }
    });
  }
}

/* -------------------------------
    FONCTION MODIFICATION DE QUANTITES
---------------------------------- */

function modificationQuantité() {

  // Selection des références de touts les input gérant la quantité

  const inputQuantite = document.querySelectorAll('.itemQuantity');

  // Boucle for pour écouté tout les éléments

  for(let q = 0; q < inputQuantite.length; q++) {
    
    // Ecoute des evements au 'click' sur les input

    inputQuantite[q].addEventListener('click', (event) => {

      event.preventDefault();

      produitEnregistreDansLocalStorage[q].quantite = event.target.value;

      // condition si quantité = 0 => renvoie vers la fonction supprimer produit.

      if (
        produitEnregistreDansLocalStorage[q].quantite == 0 
        && produitEnregistreDansLocalStorage[q].quantite <= 100
        && window.confirm(
          `\n                     Voulez vous supprimer l'article suivant ? 
          \n                                           ${produitEnregistreDansLocalStorage[q].nom} 
          \n                                           Couleur : ${produitEnregistreDansLocalStorage[q].couleur}
          `)
      ) {
        const idProduitASupprimer = produitEnregistreDansLocalStorage[q].id;
        const couleurProduitASupprimer = produitEnregistreDansLocalStorage[q].couleur;

        // Fitler method 

        produitEnregistreDansLocalStorage = produitEnregistreDansLocalStorage.filter((element) => 
        element.id !== idProduitASupprimer || 
        element.couleur !== couleurProduitASupprimer);

        // Actualisation de la clés "produit" puis un reload de la page. 

        localStorage.setItem("produit", JSON.stringify(produitEnregistreDansLocalStorage)); 
        location.reload();
      } 
      
      if (produitEnregistreDansLocalStorage[q].quantite > 100 
        || produitEnregistreDansLocalStorage[q].quantite < 0 ) {

          alert("Error")
          location.reload();
      
      } else {
        
        // Actualisation du local storage. 

        localStorage.setItem("produit", JSON.stringify(produitEnregistreDansLocalStorage));
        
      }
    });  
  }
};

