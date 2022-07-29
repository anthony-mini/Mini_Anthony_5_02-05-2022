/* -------------------------------
RECUPERATION ET AFFICHAGE DE L'ORDER PRESENT DANS L'URL
---------------------------------- */

function main () {

    // recuperation du l'Url et sélection de l'orderId

    let urlParams = new URLSearchParams(window.location.search);
    let orderId = urlParams.get('orderId');

    // Affichage de l'orderId

    let orderNumber = document.querySelector('#orderId');
    orderNumber.innerHTML = orderId + ' <br> Merci de votre commande !';

    // Suppression du localStorage

    window.localStorage.clear();
};

main ();

