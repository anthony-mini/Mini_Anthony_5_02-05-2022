/* ---------------------------------------
RÉCUPÉRATION DE L'ID DU PRODUIT À AFFICHER
------------------------------------------ */

// - À l'aide du BOM, récupération de l'ID du produit à afficher via l'URL. 

const urlProduit = new URLSearchParams(document.location.search);

const idProduit = urlProduit.get("id");

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

  // - Boucle for...of pour chercher un indice. 
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

      };    
    };      
  };
};


/* -------------------------------------------------------------------
ÉCOUTE DES EVENEMENTS POUR AFFICHAGE DYNAMIQUE DES COULEURS ET NOMBRES
---------------------------------------------------------------------- */

// ---- COULEURS ---- //

let structureColorOption = document.querySelector("#colors");

structureColorOption.addEventListener("input", (event) => {

  let couleurProduit;

  couleurProduit = event.target.value;

});

// ---- QUANTITE ---- //

let structureQuantiteOption = document.querySelector("#quantity");

let quantiteProduit;

structureQuantiteOption.addEventListener("input", (event) => {

  // Verifie si la quanité n'est pas inférieur à 0 et n'est pas supérieur à 100, sinon --> Prend en compte la valeur de l'input dans la varible quantiteProduit.
  if(quantity.value < 0 || quantity.value > 100) {
    alert("Veuillez selectionner un nombre entre 1 et 100");
    location.reload();
  } else {
    quantiteProduit = event.target.value;
  }
  
});

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

      const quantityForm = document.querySelector("#quantity");    
      const colorsForm = document.querySelector("#colors");    
      const nameForm = document.querySelector("#title").textContent;   
      const priceForm = document.querySelector("#price").textContent;    
      
      const linkUrl = document.location.href;
      console.log("Lien url du produit :");
      console.log(linkUrl);
    
      // ----- Récupération des valeurs du formulaire    

    let optionProduit = {      
      nom: nameForm, 
      id: idProduit,
      quantite: quantityForm.value,    
      couleur: colorsForm.value, 
      url: linkUrl,     
    };      
       
    /* --------------------------------
                LE LOCAL STORAGE              
    ----------------------------------- */      

    //-- Récupération et stockage des valeurs du formulaire "optionProduit" dans le Local Storage    

    let produitEnregistreDansLocalStorage = JSON.parse(localStorage.getItem('produit'));    
    // JSON.parse pour convertir les données au format JSON qui sont dans le local storage en Objet JavaScript.
        
    
    //-- Fonction du message de confirmation sous forme de PopUp.    

    const popUpConfirmation = () => {    
      if(window.confirm(`\n${quantityForm.value} ${nameForm} de couleur ${colorsForm.value}, à ${priceForm} € / unitée.    
      \nÀ été ajouté au panier.    
      \nVoulez-vous accéder au panier ?`)) {
          window.location.href = "cart.html"    
        };    
      };   
      
      
    //-- Fonction ajouter un produit sélectionné dans le localstorage

    const ajoutProduitLocalStorage = () => {

      // Ajout dans le tableau de l'objet avec les valeurs choisi par l'utilisateur
      produitEnregistreDansLocalStorage.push(optionProduit);    

      // Transformation en format JSON et l'envoyer dans la key "produit" du Local Storage
      localStorage.setItem("produit", JSON.stringify(produitEnregistreDansLocalStorage));    

    };

    let update = false;

    if (produitEnregistreDansLocalStorage) {

      produitEnregistreDansLocalStorage.forEach (function (choixProduit, key) { 

        // Si le produit commandé est déjà dans le panier on addition les valeurs de quantité et met à jour l'objet présent dans la clé "produit"

        if (choixProduit.id == idProduit && choixProduit.couleur == colorsForm.value) {
            
          produitEnregistreDansLocalStorage[key].quantite = parseInt(choixProduit.quantite) + parseInt(quantityForm.value);

            // Envoie de mise à jour s'il n'y pas plus de 100 produits au panier :
            if (produitEnregistreDansLocalStorage[key].quantite <= 100)

            popUpConfirmation();

            // Update des informations déjà présente dans la clé "produit" et envoie des nouvelles valeurs.
            localStorage.setItem("produit", JSON.stringify(produitEnregistreDansLocalStorage));
            update = true;
            
        };
      });
        // Si la première condition est fausse : Alors le produit ne se trouve pas dans le panier
        if (!update) {

          popUpConfirmation(); 

          ajoutProduitLocalStorage();

        };
      // Si il n'y a aucun produit présent dans le local storage on envoie les valeurs dans le tableau vide.
    } else {
      // Je crée un tableau pour les élément choisi par les utilisateurs
      produitEnregistreDansLocalStorage = [];

      popUpConfirmation();

      ajoutProduitLocalStorage();
      
    };
  };
});