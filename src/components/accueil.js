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


// Écouter l'événement de défilement et exécuter la fonction
window.addEventListener('scroll', add_visible_class);
