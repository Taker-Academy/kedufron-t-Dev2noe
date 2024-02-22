// Fonction pour vérifier si l'élément est partiellement dans le viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = (window.innerHeight || document.documentElement.clientHeight);
    // Vérifie si le haut de l'élément est dans le viewport ou à une distance de 50px du viewport
    return rect.top <= windowHeight - 100;
  }
  
  // Fonction pour ajouter la classe 'visible'
  function toggleVisibilityOnScroll() {
    document.querySelectorAll('.card').forEach(card => {
      if (isInViewport(card)) {
        card.classList.add('visible');
      } else {
        card.classList.remove('visible');
      }
    });
  }
  
  // Écouter l'événement de défilement et exécuter la fonction
  window.addEventListener('scroll', toggleVisibilityOnScroll);
  