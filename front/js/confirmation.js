// recuperation du lien et de l'orderId

let params = new URLSearchParams(window.location.search);

console.log(params);

const orderId = params.get('orderId');

//insertion de l'orderId dans l'HTML
let orderNumber = document.querySelector('#orderId');
orderNumber.innerHTML = orderId + ' <br> Merci de votre commande !';

//suppression du localStorage
let removeStorage = window.localStorage;
removeStorage.clear();
