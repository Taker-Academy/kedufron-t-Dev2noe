
document.addEventListener("DOMContentLoaded", function()
{
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('articleId');

    axios.get(`../public/articleId.json`)
        .then(function(response) {
            const article = response.data.articles.find(article => article.id === articleId);
            if (article) {
                document.getElementById('articleTitle').innerText = article.title;
                document.getElementById('articleImage').src = article.imageUrl;
                document.getElementById('articleImage').alt = article.title;
                document.getElementById('articleDescription').innerText = article.description;
                document.getElementById('articlePrice').innerText = `${article.price}`;
            } else {
                console.log('Article non trouvé');
            }
        })
        .catch(function(error) {
            console.log(error);
        });
});

document.addEventListener("DOMContentLoaded", function() {
    var headerPlaceholder = document.getElementById('header-placeholder');
    if (headerPlaceholder) {
        fetch('header.html')
            .then(response => response.text())
            .then(data => {
                headerPlaceholder.innerHTML = data;
            })
    }
});

document.addEventListener("DOMContentLoaded", function() {
    // fetch pour chercher 'footer.html'
    fetch('footer.html')
      .then(response => response.text())
      // insère le contenu dans l'élément avec la bonne id
      .then(text => document.getElementById('footer-placeholder').innerHTML = text);
});
