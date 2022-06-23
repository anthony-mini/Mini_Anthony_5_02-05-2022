// À l'aide du BOM, récupération de l'ID du produit à afficher via l'URL. 

const urlProduit = new URLSearchParams(document.location.search);

console.log("Affichage de l'url produit :");
console.log(document.location);

const idProduit = urlProduit.get("id");

console.log("Identification de l'id du produit :");
console.log(idProduit);

// Récupération des produits via l'API.

fetch('http://localhost:3000/api/products')

  .then((response) => response.json())
    .then((dataBase) => { 

      // Appel de la fonction produit
      produits(dataBase);
      
      // console.log(dataBase);
    })

    .catch((err) => { 

      location.assign("erreur.html");
      // document.querySelector(".item").innerHTML = ` <h1 style="margin: 60px 0px">😵‍💫 Une Erreur est survenu... </h1> `;
      console.log("Erreur Serveur : " + err);
    });

  
// Fonction d'affichage dynamique des éléments du produit sélectionné.

function produits (produit) {

  // Déclaration des variables pour les éléments de structure HTML.

  let titreProduit = document.querySelector("#title");

  let prixProduit = document.querySelector("#price");

  let imageProduit = document.querySelector(".item__img");

  let descriptionProduit = document.querySelector("#description");

  let choixCouleurs = document.querySelector("#colors");

  for (let choixProduit of produit) {
        
        if (idProduit === choixProduit._id) {
            
            titreProduit.textContent = `${choixProduit.name}`;

            prixProduit.textContent = `${choixProduit.price}`;

            imageProduit.innerHTML = `<img src="${choixProduit.imageUrl}" alt="${choixProduit.altTxt}">`;

            descriptionProduit.textContent = `${choixProduit.description}`;

            // Boucle pour chercher les valeurs des options de couleur. 
            for (let optionCouleur of choixProduit.colors) {

              choixCouleurs.innerHTML += `<option value="${optionCouleur}">${optionCouleur}</option>`;

              console.log("Visualisation des couleurs disponible selon le produit :");
              console.log(optionCouleur);
            }
        }
    }
}


///////////////// choix dynamique des couleurs et des quantités /////////////////

let structureColorOption = document.querySelector("#colors");

structureColorOption.addEventListener("input", (event) => {

  let couleurProduit;

  couleurProduit = event.target.value;

  console.log("Visualisation de la couleur sélectionné :");
  console.log(couleurProduit);
});


// QUANTITEE : Ajout des listeners pour la quantitée


let choixQuantité = document.querySelector('input[id="quantity"]');

let quantitéProduit;

choixQuantité.addEventListener("input", (event) => {

  quantitéProduit = event.target.value;
  
  console.log("Visualisation de la quantitée sélectionné :");
  console.log(quantitéProduit);
});


//--------- Récupération de la sélection du panier ------------// 
