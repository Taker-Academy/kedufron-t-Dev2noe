// fonction pour importer le header

document.addEventListener("DOMContentLoaded", function()
{

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
