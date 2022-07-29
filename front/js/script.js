/* -------------
 APPEL DE L'API  
---------------- */

fetch('http://localhost:3000/api/products')

  // Promesse 1 : Récupération de la response pour la convertir en JSON
  .then(response => response.json()) 

    // Promesse 2 : Récupération des données de l'API
    .then(dataBase => { 
      products(dataBase);
    })

// Si promesse 1 et 2 non résolue => traitement de l'erreur si pas de réponse de l'url
    .catch((err) => {
      location.assign("erreur.html");
      console.log("Erreur Serveur : " + err);
    });

/* ------------------------------
 AFFICHAGE DYNAMIQUE DES ELEMENTS
--------------------------------- */


function products(dataBase) { 

  // Récupération des élément avec la boucle for...of de la base de donnée

  for (let product of dataBase) {  

      // Variable permettant d'identifier la structure de l'élément HTML : #items    
      let structureProducts = document.querySelector('#items'); 
     
      // Ajout des elements HTML à la référence #items
      structureProducts.innerHTML +=`
      <a href="./product.html?id=${product._id}">
          <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <p class="productDescription">${product.description}</p>
          </article>
      </a>`;    
  }
}
  