document.addEventListener("DOMContentLoaded", displayCartItems);

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
                    image: data.item.image, // Utilisez l'URL complète ici
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

function displayCartItems() {
    let basket = get_basket();
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    basket.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        const imgElement = document.createElement('img');
        imgElement.className = 'cart-item-img'; // Ajout de la classe pour appliquer le style
        imgElement.id = `article-img-${item.id}`; // ID unique pour chaque image
        itemElement.innerHTML = `
            <div class="cart-item-price">${item.price}€</div>
            <div class="cart-item-quantity">${item.quantity}</div>
            <div class="cart-item-total">${(item.price * item.quantity).toFixed(2)}€</div>
        `;
        itemElement.prepend(imgElement); // Ajoute l'image au début de l'élément de l'article
        cartItemsContainer.appendChild(itemElement);

        // Affichage de l'image avec la fonction modifiée
        displayArticleImageForCart(item.id, imgElement.id);
    });
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