/* ---------------------------------------
RÉCUPÉRATION DE L'ID DU PRODUIT À AFFICHER
------------------------------------------ */

// - À l'aide du BOM, récupération de l'ID du produit à afficher via l'URL. 

const urlProduit = new URLSearchParams(document.location.search);

console.log("Affichage de l'url produit :");
console.log(document.location);

const idProduit = urlProduit.get("id");

console.log("Identification de l'id du produit :");
console.log(idProduit);

// -- Récupération des produits via l'API.

fetch('http://localhost:3000/api/products')

  .then((response) => response.json())
    .then((dataBase) => { 

      // - Appel de la fonction produit
      produits(dataBase);

    }) .catch((err) => { 

      location.assign("erreur.html");
      console.log("Erreur Serveur : " + err);
    }
  );


/* --------------------------------------------
AFFICHAGE DYNAMIQUE D'UN PRODUIT ET SES OPTIONS
----------------------------------------------- */


// Fonction d'affichage dynamique des éléments du produit sélectionné.

function produits (produit) {

  // Déclaration des variables pour les éléments de structure HTML.

  let titreProduit = document.querySelector("#title");

  let prixProduit = document.querySelector("#price");

  let imageProduit = document.querySelector(".item__img");

  let descriptionProduit = document.querySelector("#description");

  let choixCouleurs = document.querySelector("#colors");

  // - Boucle for... pour chercher un indice. 
  for (let choixProduit of produit) {
        // - si id (définit par l'url) est identique à un _id d'un des produits du tableau, on récupère son indice de tableau qui sert pour les éléments produit à ajouter

        if (idProduit === choixProduit._id) {
            
            titreProduit.textContent = `${choixProduit.name}`;

            prixProduit.textContent = `${choixProduit.price}`;

            imageProduit.innerHTML = `<img src="${choixProduit.imageUrl}" alt="${choixProduit.altTxt}">`;

            descriptionProduit.textContent = `${choixProduit.description}`;

            // -- Boucle pour chercher les valeurs des options de couleur. 
            for (let optionCouleur of choixProduit.colors) {

              choixCouleurs.innerHTML += `<option value="${optionCouleur}">${optionCouleur}</option>`;

              console.log("Visualisation des couleurs disponible selon le produit :");
              console.log(optionCouleur);
            }
        }
    }
}


/* -------------------------------------------------------------------
ÉCOUTE DES EVENEMENTS POUR AFFICHAGE DYNAMIQUE DES COULEURS ET NOMBRES
---------------------------------------------------------------------- */

// ---- COULEURS ---- //

let structureColorOption = document.querySelector("#colors");

structureColorOption.addEventListener("input", (event) => {

  let couleurProduit;

  couleurProduit = event.target.value;

  console.log("Visualisation de la couleur sélectionné :");
  console.log(couleurProduit);

  }
);

// ---- QUANTITE ---- //

let structureQuantiteOption = document.querySelector("#quantity");

let quantiteProduit;

structureQuantiteOption.addEventListener("input", (event) => {

  quantiteProduit = event.target.value;
  
  console.log("Visualisation de la quantitée sélectionné :");
  console.log(quantiteProduit);

  }
);


/* ---------------------------------------------------
AJOUT DES PRODUITS DANS LE PANIER À L'ÉCOUTE DU BOUTON 
------------------------------------------------------ */

// Selection du bouton dans le DOM

const envoyerPanier = document.querySelector("#addToCart");

// Écouter le bouton et envoyer le panier 

//--------------- AddEventListener ---------------
// ------------------------------------------------

envoyerPanier.addEventListener("click", (event) => {
    
event.preventDefault() // voir mdn    

// Permet de vérifier qu'une Couleur est séléctionnée : Si le param. value n'a pas de valeur -> Affichage du message d'erreur  
if (!colors.value) return (alert ('Aucune couleur séléctionnée'))    
// Si param. quantity rempli les contions si dessous on récupère les valeurs.   
if (quantity.value > 0 && quantity.value <= 100 && quantity.value != 0){    
      
    // -------- Déclaration des variables contenant les choix d'options de l'utilisateur présent dans le formulaire.   

    const quantityForm = document.querySelector("#quantity").value;    
    const colorsForm = document.querySelector("#colors").value;    
    const nameForm = document.querySelector("#title").textContent;   
    const priceForm = document.querySelector("#price").textContent;      
  
    // ----- Récupération des valeurs du formulaire    

  let optionProduit = {      
    id: idProduit,    
    couleur: colorsForm,      
    quantite: quantityForm,      
    nom: nameForm,        
  };      

  console.log("Vérification des options enregistré dans le formulaire");      
  console.log(optionProduit);    
    

  /* --------------------------------
              LE LOCAL STORAGE              
  ----------------------------------- */      

  //-- Récupération et stockage des valeurs du formulaire "optionProduit" dans le Local Storage    

  let produitEnregistreDansLocalStorage = JSON.parse(localStorage.getItem('keyProduit'));    
  // JSON.parse pour convertir les données au format JSON qui sont dans le local storage en Objet JavaScript.
      
  console.log("Valeur de produitEnregistreDansLocalStorage : (null si pas de clés");    
  console.log(produitEnregistreDansLocalStorage);    


  //-- Fonction du message de confirmation sous forme de PopUp.    

  const popUpConfirmation = () => {    
    if(window.confirm(`Le ${nameForm} de couleur ${colorsForm}, à ${priceForm} € / unitée.    
    \nÀ été ajouté au panier.    
    \nVoulez-vous accéder au panier ?`)) {
        window.location.href = "cart.html"    
      }     
    };    

  // - Vérification de la présence d'une clé    

  // s'il y a deja des produit d'enregistré dans le local storage :     

  if(produitEnregistreDansLocalStorage) {    

    produitEnregistreDansLocalStorage.push(optionProduit);    
    localStorage.setItem("keyProduit", JSON.stringify(produitEnregistreDansLocalStorage));    

    popUpConfirmation();    

    console.log("Stockage d'autres options si la condition est vrai");    
    console.log(produitEnregistreDansLocalStorage);  
    
    // S'il n'y à pas de produit enregistré dans le localstorage   :
    } else { 

    produitEnregistreDansLocalStorage = [];    

    // -- Insérer le contenus présent dans la variable optionProduit 
    produitEnregistreDansLocalStorage.push(optionProduit);    

    // Envoyer les objets dans le local storage et définir la clés :    
    localStorage.setItem("keyProduit", JSON.stringify(produitEnregistreDansLocalStorage));    

    popUpConfirmation();    

    console.log("Valeur de l'array du tableau envoyer dans le local storage");    
    console.log(produitEnregistreDansLocalStorage);    
    }    
  }
});