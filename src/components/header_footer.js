// fonction pour importer le header
document.addEventListener("DOMContentLoaded", function()
{
    updateCartBadge();
    var headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch("header.html")
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
            })
            .catch(error => console.error('Error loading the header:', error));
    }
});



// fonction pour importer le footer
document.addEventListener("DOMContentLoaded", function()
{
    fetch('footer.html')
    .then(response => response.text())
      // insère le contenu dans l'élément avec la bonne id
      .then(text => document.getElementById('footer-placeholder').innerHTML = text);
});



function updateCartBadge()
{
    const basket = get_basket(); // Assurez-vous que cette fonction renvoie votre panier depuis localStorage
    const badge = document.querySelector('.cart-badge');

    if (badge) {
        badge.textContent = basket.length; // Met à jour le badge avec le nombre d'articles dans le panier
    }
}
