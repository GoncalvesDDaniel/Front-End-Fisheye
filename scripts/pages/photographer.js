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
async function init() {
    // Récupère les datas (photographes + media) des photographes
    const photograph = await getPhotographerId(photographerId);
    // displayData with array of photographers from the fetch json file
    displayData(photograph.photographer[0]);
}

init();
