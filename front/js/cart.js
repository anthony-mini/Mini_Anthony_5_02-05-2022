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
    modificationQuantité();
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
  if (produitEnregistreDansLocalStorage === null || produitEnregistreDansLocalStorage.length === 0 ) {
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
      // Appel de la fonction d'affichage du prix et quantité total : 

     afficherQteEtPrixTotal();
     validationFormulaire();
     viderPanier();
     retourPageProduit();
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

      // --------- POPUP FONCTION ----------- //
      let modelContainer = document.querySelector(".model-container");
      let model = document.querySelector(".model");
      let modelH = document.querySelector(".model__h");
      let modelP = document.querySelector(".model__p");
      let btnOui = document.querySelector(".btn--model__oui");
      let btnNon = document.querySelector(".btn--model__non");
      let btnClose = document.querySelector(".close");

      function PopUp() {
      modelContainer.style.transform = "scale(1)";
      model.style.transform = "scale(1)";
      modelH.textContent = "Êtes-vous sûr de vouloir supprimer ce produit"
      modelP.textContent = `${produitEnregistreDansLocalStorage[l].nom} de couleur ${produitEnregistreDansLocalStorage[l].couleur} ?`;

      btnClose.addEventListener('click', (event) => {
        event.preventDefault;

          modelContainer.style.transform = "scale(0)";
          model.style.transform = "scale(0)";

          location.reload();
      });

      btnNon.addEventListener('click', (event) => {
           event.preventDefault;

          modelContainer.style.transform = "scale(0)";
          model.style.transform = "scale(0)";

          location.reload();
      });

      btnOui.addEventListener('click', (event) => {
        event.preventDefault;

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
      });
    };
    PopUp(); 
  });
  }
};

/* -------------------------------
    FONCTION MODIFICATION DE QUANTITES
---------------------------------- */

function modificationQuantité() {

  // Selection des références de touts les input gérant la quantité

  const inputQuantite = document.querySelectorAll('.itemQuantity');

  // Boucle for pour écouté tout les éléments

  for(let q = 0; q < inputQuantite.length; q++) {
    
    // Ecoute des evements au 'click' sur les input

    inputQuantite[q].addEventListener('change', (event) => {

      
      event.preventDefault();

      produitEnregistreDansLocalStorage[q].quantite = event.target.value;

      // condition si quantité = 0 => renvoie vers la fonction supprimer produit.

      if (
        produitEnregistreDansLocalStorage[q].quantite == 0
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

      if (
        produitEnregistreDansLocalStorage[q].quantite > 0 &&    produitEnregistreDansLocalStorage[q].quantite <= 100 && produitEnregistreDansLocalStorage[q].quantite !=0 ) {

          localStorage.setItem("produit", JSON.stringify(produitEnregistreDansLocalStorage));

          // Second appel de la fonction afficherQteEtPrixTotal pour modifier de maniere dynamique le prix, sans reload la page. 

          afficherQteEtPrixTotal();
      
      } 
        else {
        
        // Actualisation du local storage. 
        alert("ERREUR : Veuillez sélectionner un nombre entre 1 et 100 ");
        
        location.reload();
      }
  });  
  }
};

/* -------------------------------
    FONCTION AFFICHIER PRIX TOTAL ET QUANTITES TOTAL PRODUIT
---------------------------------- */

function afficherQteEtPrixTotal() {

  // Selection des références pour la qté produit, qté total et prix total.
  
  let quantiteProduit = document.querySelectorAll(".itemQuantity");
  
  let strucutreQuantitePanier = document.querySelector("#totalQuantity");
  
  let strucutrePrixTotal = document.querySelector("#totalPrice");

  // Déclaration des valeurs par défauts. 

  let totalQuantitePanier = 0;

  let totalPrix = 0;
  
    for (let i = 0; i < quantiteProduit.length; i++) {
      // L'opérateur d'addition (+=) : permet l'addition de la quantite du dernière objet du tableau + tout les autres elements grâce à la boucle.

      totalQuantitePanier += quantiteProduit[i].valueAsNumber;
    }
  
    strucutreQuantitePanier.textContent = totalQuantitePanier;
  
    for (let i = 0; i < quantiteProduit.length; i++) {
      totalPrix += quantiteProduit[i].valueAsNumber * produitEnregistreDansLocalStorage[i].price;
    }
    
    strucutrePrixTotal.textContent = totalPrix;
};

/* -------------------------------
    FONCTION VIDER PANIER
---------------------------------- */

function viderPanier(){

  // Selection du btn 

  const btnViderPanier = document.querySelector("#btnViderPanier");

  // Ecoute du click sur le bouton 

  btnViderPanier.addEventListener('click', (event) => {

    event.preventDefault;

    let modelContainer = document.querySelector(".model-container");
    let model = document.querySelector(".model");
    let modelH = document.querySelector(".model__h");
    let modelP = document.querySelector(".model__p");
    let btnOui = document.querySelector(".btn--model__oui");
    let btnNon = document.querySelector(".btn--model__non");
    let btnClose = document.querySelector(".close");
    
      modelContainer.style.transform = "scale(1)";
      model.style.transform = "scale(1)";
      modelH.textContent = "Êtes-vous sûr de vouloir vider votre panier ?"
      modelP.textContent = "";

      btnClose.addEventListener('click', (event) => {
        event.preventDefault;

          modelContainer.style.transform = "scale(0)";
          model.style.transform = "scale(0)";
      });

      btnNon.addEventListener('click', (event) => {
           event.preventDefault;

          modelContainer.style.transform = "scale(0)";
          model.style.transform = "scale(0)";
      });

      btnOui.addEventListener('click', (event) => {
        event.preventDefault;
          
          window.localStorage.clear();
          location.reload();
      })
  });
}

/* -------------------------------
    FONCTION CONTINUEZ MES ACAHTS
---------------------------------- */

function retourPageProduit() {

  const btnReturnAcc = document.querySelector("#btnReturnAcc");

  btnReturnAcc.addEventListener('click', (event) => {

    event.preventDefault();

    window.location.href = 'index.html';

  });
};

/* -------------------------------
            REGEX
---------------------------------- */

let nomRegex = new RegExp(/^[a-zA-Zàâäéèêëïîôöùûüç ,.'-]+$/);

let emailRegex = new RegExp(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-z]{2,3})$/);

let adressRegex = new RegExp(/^[0-9 A-Za-z'-]{1,40}$/);


/* -------------------------------
    VALIDATION DU FORMULAIRE
---------------------------------- */

function validationFormulaire() {

  // PRENOM 

  let prenomFamille = document.querySelector("#firstName");

  prenomFamille.addEventListener('input', () => { 

    if (nomRegex.test(prenomFamille.value) === false) {
      document.querySelector("#firstNameErrorMsg").textContent = "Caractères spéciaux non pris en compte pour votre prenom";
    } else {
      document.querySelector("#firstNameErrorMsg").textContent = "";
    };
  });

  // NOM DE FAMILLE  

  let firstName = document.querySelector("#lastName");

  firstName.addEventListener('input', () => { 

    if (nomRegex.test(firstName.value) === false) {
      document.querySelector("#lastNameErrorMsg").textContent = "Caractères spéciaux non pris en compte pour votre nom";
    } else {
      document.querySelector("#lastNameErrorMsg").textContent = "";
    };
  });

  // ADRESSE 

  let address = document.querySelector("#address");

  address.addEventListener('input', () => { 

    if (adressRegex.test(address.value) === false) {
      document.querySelector("#addressErrorMsg").textContent = "Caractères spéciaux non pris en compte pour votre adresse";
    } else {
      document.querySelector("#addressErrorMsg").textContent = "";
    };
  });

    // VILLE

    let city = document.querySelector("#city");

    city.addEventListener('input', () => { 
  
      if (nomRegex.test(city.value) === false) {
        document.querySelector("#cityErrorMsg").textContent = "Caractères spéciaux non pris en compte pour votre ville";
      } else {
        document.querySelector("#cityErrorMsg").textContent = "";
      };
    });

    // EMAIL

    let email = document.querySelector("#email");

    email.addEventListener('input', () => { 
  
      if (emailRegex.test(email.value) === false) {
        document.querySelector("#emailErrorMsg").textContent = "Caractères spéciaux non pris en compte pour votre adresse mail";
      } else {
        document.querySelector("#emailErrorMsg").textContent = "";
      };
    }); 
    
};

/* -------------------------------
    VALIDATION DE LA COMMANDE
---------------------------------- */

function validationCommande() {

  // Selection de la référence pour le bouton 'commander'

  const btnCommander = document.querySelector('#order');

  // Écoute de l'evenement au click du bouton 

  btnCommander.addEventListener('click', (event) => {
    
    event.preventDefault();

    // Condition de confirmation du formulaire : Si tout les Regex ont étés contrôlé et validés.

    if (
      !nomRegex.test(firstName.value) ||
      !nomRegex.test(lastName.value) ||
      !emailRegex.test(email.value) ||
      !nomRegex.test(city.value) ||
      !adressRegex.test(address.value)
    ) {
      alert("Veuillez vérifier les champs de complétion du formulaire");

    } else {

      // Creation d'un tableau pour récupérer les ID produits :

      let productId = [];

      // Boucle for pour parcourir tout les elements :

      for (let i = 0; i < produitEnregistreDansLocalStorage.length; i++) {

        // method PUSH pour ajouter un ou plusieurs elements dans le tableau 'productId'

        productId.push(produitEnregistreDansLocalStorage[i].id);
      }

    // Creation de l'objet contact à partir des données du formulaire et du tableau productId.  

      let order = {
        contact: {
          firstName: firstName.value,
          lastName: lastName.value,
          address: address.value,
          city: city.value,
          email: email.value,
        },
        products: productId,
      };
      
      // Options de la method POST. 

      const options = {
        method: 'POST',
        body: JSON.stringify(order),
        headers: {
          Accept: 'application/json',
          'Content-type': 'application/json',
        },
      };

      // Appel de l'API et Envoie des informations contact & products à l'aide de la méthode POST. 

      fetch('http://localhost:3000/api/products/order', options)
        .then((response) =>  response.json())
        
        .then((dataBase) => {
          
          const orderId = dataBase.orderId;

          //envoie vers la page de de confirmation avec l'orderId en fin de l'URL.
          window.location.href = 'confirmation.html' + '?orderId=' + orderId;
        })
        .catch((error) => {
          alert(error);
        });
    }
  });
}

validationCommande();