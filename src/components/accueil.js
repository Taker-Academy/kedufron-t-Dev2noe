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

function fetchItemImageById(itemId)
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
    itemIds.forEach(fetchItemImageById);
});

// Écouter l'événement de défilement et exécuter la fonction
window.addEventListener('scroll', add_visible_class);
