
document.addEventListener("DOMContentLoaded", function()
{
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('articleId');

    axios.get(`../public/articleId.json`)
        .then(function(response) {
            // on vas vérifié si l'article existe
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
    // Obtenir l'ID de l'article à partir de l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('articleId');

    document.getElementById('addToCartButton').addEventListener('click', function() {
        axios.get('../../public/articleId.json')
            .then(function(response) {
                const article = response.data.articles.find(p => p.id == articleId);
                if (article) {
                    add_basket(article);
                    alert('Article ajouté au panier.');
                } else {
                    alert('Article non trouvé.');
                }
            })
            .catch(function(error) {
                console.error('Erreur lors de la récupération des détails de l\'article :', error);
            });
    });
});
