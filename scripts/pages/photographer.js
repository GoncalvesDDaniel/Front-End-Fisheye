//Mettre le code JavaScript lié à la page photographer.html
async function getPhotographerId(id) {
    const response = await fetch("./data/photographers.json");
    const data = await response.json();
    const photographer = data.photographers.filter((elem) => elem.id === id);
    const media = data.media.filter((elem) => elem.photographerId === id);
    return { photographer, media };
}

// get photographer informations from url
const urlPhotographerParams = new URL(window.location).searchParams;
const photographerId = Number.parseInt(urlPhotographerParams.get("id"), 10);

function displayData(array) {
    const photographHeader = document.querySelector(".photograph-header");
    const photographModel = photographerTemplate(array);
    const photographInfo = photographModel.getHTMLInfo();
    const photographPicture = photographModel.getHTMLPicture();
    photographHeader.appendChild(photographInfo);
    photographHeader.appendChild(photographPicture);
}
function displayMedia(array) {
    const card = array.forEach((element) => mediaTemplate(element));
    const gallery = document.querySelector(".gallery");

    array.forEach((media) => {
        const mediaModel = mediaTemplate(media);
        const userMediaCard = mediaModel.getUserMediaCardDOM();
        gallery.appendChild(userMediaCard);
    });
}
async function init() {
    // Récupère les datas (photographes + media) des photographes
    const photograph = await getPhotographerId(photographerId);
    // displayData with array of photographers from the fetch json file
    displayData(photograph.photographer[0]);
    // displayMedia(photograph.media);
    let gallery = photograph.media;
    gallery.sort(function (a, b) {
        return b.likes - a.likes;
    });
    displayMedia(gallery);
    const sortChoice = document.querySelector("select");
    sortChoice.addEventListener("change", () => {
        const galleryCleaner = document.querySelector(".gallery");
        galleryCleaner.innerHTML = "";
        switch (sortChoice.selectedIndex) {
            // popularite
            case 0:
                gallery.sort(function (a, b) {
                    return b.likes - a.likes;
                });
                displayMedia(gallery);
                break;

            // Date
            case 1:
                gallery.sort(function (a, b) {
                    return new Date(b.date) - new Date(a.date);
                });
                displayMedia(gallery);
                break;
            // title
            case 2:
                gallery.sort(function (a, b) {
                    return b.title < a.title ? 1 : -1;
                });
                displayMedia(gallery);
                break;
        }
    });
}

init();
