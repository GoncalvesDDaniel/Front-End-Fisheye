export function photographerTemplate(photographerObj) {
    const { id, name, city, country, price, tagline, portrait } =
        photographerObj;

    const picture = `assets/photographers/Photographers-Id-Photos/${portrait}`;

    const img = document.createElement("img");
    img.setAttribute("src", picture);
    img.setAttribute("alt", "");
    img.className = "photograph-picture";

    const pLocalisation = document.createElement("p");
    pLocalisation.className = "photographe-location";
    pLocalisation.textContent = `${city}, ${country}`;

    const pTagline = document.createElement("p");
    pTagline.textContent = tagline;
    pTagline.className = "photographe-tagline";

    function getUserCardDOM() {
        const article = document.createElement("article");
        const link = document.createElement("a");
        link.setAttribute("href", `./photographer.html?id=${id}`);
        const h2 = document.createElement("h2");
        h2.textContent = name;
        const pPrice = document.createElement("p");
        pPrice.className = "photographe-price";
        pPrice.textContent = `${price}€/jour`;

        link.appendChild(h2);
        link.appendChild(img);

        article.appendChild(link);
        article.appendChild(pLocalisation);
        article.appendChild(pTagline);
        article.appendChild(pPrice);
        return article;
    }
    function getHTMLPicture() {
        return img;
    }
    function getHTMLInfo() {
        const div = document.createElement("div");
        div.className = "photograph-info";
        const h1 = document.createElement("h1");
        h1.textContent = name;
        h1.className = "photograph-name";
        div.appendChild(h1);
        div.appendChild(pLocalisation);
        div.appendChild(pTagline);
        return div;
    }
    return { name, picture, getUserCardDOM, getHTMLInfo, getHTMLPicture };
}
