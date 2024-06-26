//Mettre le code JavaScript lié à la page photographer.html
async function getPhotographerId(id) {
    const response = await fetch("./data/photographers.json");
    const data = await response.json();
    const infoOfPhotographers = data.photographers.filter(
        (elem) => elem.id === id
    );
    const mediaOfPhotographers = data.media.filter(
        (elem) => elem.photographerId === id
    );
    const result = {
        photographers: [...infoOfPhotographers],
        media: [...mediaOfPhotographers],
    };
    return result;
    // console.log(mediaOfPhotographers);
    // mediaOfPhotographers.forEach((elem) => console.log(elem.photographerId));
}

// get photographer informations from url
const urlPhotographerParams = new URL(window.location).searchParams;
const photographerId = Number.parseInt(urlPhotographerParams.get("id"), 10);
