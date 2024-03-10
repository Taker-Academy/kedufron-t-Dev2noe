// article-detail.js
document.addEventListener("DOMContentLoaded", function() {
    // Extrait l'identifiant de l'article depuis l'URL
    const queryParams = new URLSearchParams(window.location.search);
    const articleId = queryParams.get('articleId');

    if (articleId) {
        fetch_Article_Details(articleId);
    } else {
        console.error('Article ID is missing from the URL');
    }
});

function fetch_Article_Details(articleId)
{
    const detailsUrl = `https://api.kedufront.juniortaker.com/item/${articleId}`;

    fetch(detailsUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (!data.ok) {
                throw new Error('Item not found');
            }
            const article = data.item;
            // Mise à jour de l'interface utilisateur avec les détails de l'article
            document.getElementById('articleTitle').innerText = article.name;
            document.getElementById('articleDescription').innerText = article.description;
            document.getElementById('articlePrice').innerText = `${article.price}€`;
            displayArticleImage(articleId);
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
}

function displayArticleImage(articleId) {
    const imageUrl = `https://api.kedufront.juniortaker.com/item/picture/${articleId}`;
    fetch(imageUrl)
        .then(response => response.blob())
        .then(imageBlob => {
            const imageObjectURL = URL.createObjectURL(imageBlob);
            document.getElementById('articleImage').src = imageObjectURL;
        })
        .catch(error => {
            console.error('Failed to load article image:', error);
        });
}

