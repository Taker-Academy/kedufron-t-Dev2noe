
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
