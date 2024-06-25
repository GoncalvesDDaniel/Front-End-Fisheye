function photographerTemplate(data) {
    const { name, city, country, id, price, tagline, portrait } = data;

    const picture = `assets/photographers/Photographers-Id-Photos/${portrait}`;

    function getUserCardDOM() {
        const article = document.createElement("article");
        const link = document.createElement("a");
        link.setAttribute("href", `./photographer.html?id=${id}`);
        const img = document.createElement("img");
        img.setAttribute("src", picture);
        const h2 = document.createElement("h2");
        h2.textContent = name;
        const pLocalisation = document.createElement("p");
        pLocalisation.className = "photographe-location";
        pLocalisation.textContent = `${city}, ${country}`;
        const pTagline = document.createElement("p");
        pTagline.textContent = tagline;
        pTagline.className = "photographe-tagline";
        const pPrice = document.createElement("p");
        pPrice.className = "photographe-price";
        pPrice.textContent = `${price}€/jour`;

        link.appendChild(img);
        link.appendChild(h2);

        article.appendChild(link);
        article.appendChild(pLocalisation);
        article.appendChild(pTagline);
        article.appendChild(pPrice);
        return article;
    }
    return { name, picture, getUserCardDOM };
}
