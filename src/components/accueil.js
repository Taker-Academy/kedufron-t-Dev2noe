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

function get_item_by_id(itemId)
{
    const imageUrl = `https://api.kedufront.juniortaker.com/item/picture/${itemId}`;

    fetch(imageUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Image not found for item with ID ' + itemId);
        }
        // en blob car nous attendons une image
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

// Appeler cette fonction pour chaque article dont vous avez besoin de récupérer l'image
document.addEventListener('DOMContentLoaded', function() {
    const itemIds = [1, 2, 3, 4, 5, 6];
    itemIds.forEach(get_item_by_id);
});

// Cette fonction va chercher les détails de tous les articles de l'API et les affiche
function fetchItemsAndUpdateUI() {
    // URL de l'API pour récupérer tous les articles
    const itemsUrl = 'https://api.kedufront.juniortaker.com/item/';

    fetch(itemsUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(items => {
        // Supposons que vous avez un conteneur pour vos articles dans votre HTML
        const container = document.querySelector('.cards-container');
        container.innerHTML = ''; // Nettoyez le conteneur avant d'ajouter de nouveaux éléments
        
        // Itérer sur chaque article et construire la structure HTML
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <a href="article.html?articleId=${item._id}">
                    <img src="${item.image}" alt="${item.name}" />
                </a>
                <div class="card-info">
                    <h3>${item.name}</h3>
                    <p>${item.description}</p>
                    <p class="price">${item.price}€</p>
                    <a href="article.html?articleId=${item._id}" class="button">Voir produit</a>
                </div>
            `;
            container.appendChild(card);
        });
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

// Exécutez cette fonction au chargement de la page pour mettre à jour l'interface utilisateur avec les données de l'API
document.addEventListener('DOMContentLoaded', fetchItemsAndUpdateUI);


// Écouter l'événement de défilement et exécuter la fonction
window.addEventListener('scroll', add_visible_class);
