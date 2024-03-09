document.addEventListener("DOMContentLoaded", display_cart_items);

document.getElementById('addToCartButton').addEventListener('click', () => {
    const queryParams = new URLSearchParams(window.location.search);
    const articleId = queryParams.get('articleId');

    if (articleId) {
        fetchArticleDetailsAndAddToCart(articleId);
    } else {
        console.error('Article ID is missing from the URL');
    }
});

function fetchArticleDetailsAndAddToCart(articleId)
{
    const detailsUrl = `https://api.kedufront.juniortaker.com/item/${articleId}`;

    fetch(detailsUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.ok && data.item) {
                const article = {
                    id: data.item._id,
                    name: data.item.name,
                    description: data.item.description,
                    price: data.item.price,
                    image: data.item.image,
                    quantity: 1
                };
                add_basket(article);
                alert("Article ajouté avec succès au panier!");
            } else {
                throw new Error('Item not found');
            }
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
            alert("Erreur lors de l'ajout de l'article au panier. Veuillez réessayer.");
        });
}


function save_basket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket));
}

function get_basket()
{
    let basket = localStorage.getItem("basket");

    if (basket == null) {
        return []; // on créer un new basket
    } else {
        return JSON.parse(basket); //on return le tableau chiffré en json
    }
}

function add_basket(article)
{
    let basket = get_basket(); // Récupère le panier actuel
    let foundProductIndex = basket.findIndex(p => p.id === article.id);

    if (foundProductIndex !== -1) {
        basket[foundProductIndex].quantity++; // Augmente la quantité si le produit existe déjà
    } else {
        basket.push(article); // Ajoute le nouvel article au panier
    }
    save_basket(basket); // Sauvegarde le panier dans le localStorage
}

function remove_from_basket(productId)
{
    let basket = get_basket();

    basket = basket.filter(p => p.id != productId);
    save_basket(basket);
}


function calculate_total()
{
    let basket = get_basket();
    let total = 0;

    if (basket == []) {
        return total;
    }
    basket.forEach(item => {
        let price = Number(item.price.replace('€', ''));
        if (!isNaN(price) && typeof item.quantity === 'number') {
            total += price * item.quantity;
        } else {
            console.error('Invalid item in basket:', item);
        }
    });
    return total.toFixed(2);
}

function attachEventHandlers(item) {
    // Gestionnaire pour le bouton de réduction de la quantité
    document.querySelector(`.quantity-minus[data-id='${item.id}']`).addEventListener('click', function() {
        change_quantity(item.id, item.quantity - 1);
        display_cart_items();
    });

    // Gestionnaire pour le bouton d'augmentation de la quantité
    document.querySelector(`.quantity-plus[data-id='${item.id}']`).addEventListener('click', function() {
        change_quantity(item.id, item.quantity + 1);
        display_cart_items();
    });

    // Gestionnaire pour le bouton de suppression d'article
    document.querySelector(`.remove-item[data-id='${item.id}']`).addEventListener('click', function() {
        remove_from_basket(item.id);
        display_cart_items();
    });
}

function change_quantity(productId, newQuantity)
{
    let basket = get_basket();
    let foundProduct = basket.find(p => p.id == productId);

    if (foundProduct) {
        foundProduct.quantity = newQuantity;
        if (foundProduct.quantity < 1) {
            foundProduct.quantity = 1;
        }
        save_basket(basket);
    }
}

function display_cart_items()
{
    let basket = get_basket();
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = ''; // Vide le conteneur à chaque appel pour reconstruire les éléments du panier

    basket.forEach(item => {
        const itemElement = create_cart_item(item);
        cartItemsContainer.appendChild(itemElement);
        update_cart_item(item, itemElement);
        attachEventHandlers(item, itemElement); // Attacher les gestionnaires d'événements ici
    });
    updateTotal(); // Mise à jour du montant total
}

function update_cart_item(item, itemElement)
{
    const imgId = `cart-img-${item.id}`;
    const imageElement = itemElement.querySelector(`img[data-id="${item.id}"]`);
    if (imageElement.src !== item.image) {
        displayArticleImageForCart(item.id, imgId);
    }
    // Mise à jour du texte des prix et des quantités
    itemElement.querySelector('.cart-item-price').textContent = `${item.price}€`;
    itemElement.querySelector('.cart-item-total').textContent = `${(item.price * item.quantity).toFixed(2)}€`;
    itemElement.querySelector('.quantity-input').value = item.quantity;
}

function create_cart_item(item)
{
    const itemElement = document.createElement('div');
    itemElement.className = 'cart-item';
    itemElement.setAttribute('data-id', item.id);
    const imgId = `cart-img-${item.id}`;
    itemElement.innerHTML = `
        <img class="cart-item-image" src="" alt="Product Image" id="${imgId}" data-id="${item.id}">
        <span class="cart-item-price">${item.price}€</span>
        <div class="cart-quantity-control">
            <button class="quantity-minus" data-id="${item.id}">-</button>
            <input type="number" class="quantity-input" data-id="${item.id}" value="${item.quantity}" min="1">
            <button class="quantity-plus" data-id="${item.id}">+</button>
        </div>
        <button class="remove-item" data-id="${item.id}"><i class="fa fa-trash"></i></button>
        <span class="cart-item-total">${(item.price * item.quantity).toFixed(2)}€</span>
    `;
    return itemElement;
}

function displayArticleImageForCart(articleId, imgElementId) {
    const imageUrl = `https://api.kedufront.juniortaker.com/item/picture/${articleId}`;
    fetch(imageUrl)
        .then(response => response.blob())
        .then(imageBlob => {
            const imageObjectURL = URL.createObjectURL(imageBlob);
            document.getElementById(imgElementId).src = imageObjectURL;
        })
        .catch(error => {
            console.error('Failed to load article image:', error);
        });
}