document.addEventListener("DOMContentLoaded", function()
{
    const cartItemsContainer = document.getElementById('cart-items');
    const cartItemTemplate = document.getElementById('cart-item-template').content;

    // Fonction pour charger et afficher les articles du panier
    function loadCartItems() {
        const basket = get_basket();
        cartItemsContainer.innerHTML = '';

        basket.forEach(product => {
            const cartItem = cartItemTemplate.cloneNode(true);

            // Mise à jour des éléments du clone avec les données du produit
            cartItem.querySelector('.cart-item-image').src = product.imageUrl;
            cartItem.querySelector('.cart-item-title').textContent = product.title;
            cartItem.querySelector('.cart-item-price').textContent = `${product.price}`;
            cartItem.querySelector('input[type=number]').value = product.quantity;
            cartItem.querySelector('.cart-item-total').textContent = `${(parseInt(product.price, 10) * product.quantity).toFixed(2)}`;

            // gestionnaires d'événements pour les boutons plus, moins, remove, quantité
            cartItem.querySelector('.remove-item').addEventListener('click', function() {
                remove_from_basket(product.id);
                loadCartItems();
            });
            cartItem.querySelector('.quantity-plus').addEventListener('click', function() {
                change_quantity(product.id, 1);
                loadCartItems();
            });
            cartItem.querySelector('.quantity-minus').addEventListener('click', function() {
                change_quantity(product.id, -1);
                loadCartItems();
            });
            const quantityInput = cartItem.querySelector('input[type=number]'); // changer la quantité manuellement
            quantityInput.addEventListener('change', function() {
                let newQuantity = parseInt(quantityInput.value, 10);  //transforme le string de la quantité en integer
                if (isNaN(newQuantity) || newQuantity < 1) {
                    alert('La quantité ne peut pas être inférieure à 1.');
                    quantityInput.value = product.quantity;
                    return;
                }
                change_quantity(product.id, newQuantity - product.quantity);
                loadCartItems();
            });
            cartItemsContainer.appendChild(cartItem);
        });
    }
    loadCartItems(); // Appelez cette fonction pour charger les articles lorsque la page est chargée
});

function save_basket(basket)
{
    localStorage.setItem("basket", JSON.stringify(basket));
}

function get_basket()
{
    let basket = localStorage.getItem("basket");

    if (basket == null) {
        return []; // on créer un new cart (tableau vide)
    } else {
        return JSON.parse(basket); //on return le tableau chiffré en json
    }
}

function add_basket(product)
{
    let basket = get_basket();
    let found_product = basket.find(p => p.id == product.id);

    if (found_product != undefined) {
        found_product.quantity++;
    } else {
        product.quantity = 1;
        basket.push(product);
    }
    save_basket(basket);
}

function remove_from_basket(productId)
{
    let basket = get_basket();

    basket = basket.filter(p => p.id != productId);
    save_basket(basket);
}

function change_quantity(productId, quantity)
{
    let basket = get_basket();
    let found_product = basket.find(p => p.id == productId);

    if (found_product != undefined) {
        found_product.quantity += quantity;
        if (found_product.quantity < 1) {
            found_product.quantity = 1;
        }
        save_basket(basket);
    }
}
