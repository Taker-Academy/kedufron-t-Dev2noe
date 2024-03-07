// Fonction pour vérifier si l'élément est partiellement dans le viewport
function is_in_viewport(element)
{
    const rect = element.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);

    return rect.top <= windowHeight - 100; // marge de 100
}

// Fonction pour ajouter la classe 'visible'
function add_visible_class()
{
    document.querySelectorAll('.card').forEach(card => {
        if (is_in_viewport(card)) {
            card.classList.add('visible');
        } else {
            card.classList.remove('visible');
        }
    });
}

function get_update_articles()
{
    const itemsUrl = 'https://api.kedufront.juniortaker.com/item/';

    fetch(itemsUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(items => {
        const container = document.querySelector('.cards-container');
        container.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <a href="article.html?articleId=${item._id}">
                    <img data-item-id="${item._id}" alt="${item.name}" />
                </a>
                <div class="card-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p class="price">${item.price}€</p>
                    <a href="article.html?articleId=${item._id}" class="button">Voir produit</a>
                </div>
            `;
            container.appendChild(card);
            // Appeler get_item_by_id pour récupérer l'image de l'article
            get_item_by_id(item._id);
        });
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

// Cette fonction va chercher l'image pour chaque article
function get_item_by_id(itemId) {
    const imageUrl = `https://api.kedufront.juniortaker.com/item/picture/${itemId}`;

    fetch(imageUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Image not found for item with ID ' + itemId);
        }
        return response.blob();
    })
    .then(imageBlob => {
        const imageObjectURL = URL.createObjectURL(imageBlob);
        document.querySelector(`img[data-item-id='${itemId}']`).src = imageObjectURL;
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

// met à jour l'interface utilisateur avec les données de l'API
document.addEventListener('DOMContentLoaded', get_update_articles);

// Écouter l'événement de défilement et exécuter la fonction
window.addEventListener('scroll', add_visible_class);
