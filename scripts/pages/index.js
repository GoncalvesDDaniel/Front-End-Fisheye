import { getAllPhotographerData } from "../utils/api.js";
import { photographerTemplate } from "../templates/photographerFactory.js";

const photographersSection = document.querySelector(".photographer_section");

//take photographersArray and create all photographers cards
async function generateAllPhotographersCard(array) {
    array.forEach((photographer) => {
        // get all info of the photographer
        const photographerModel = photographerTemplate(photographer);
        // create the photographer card
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    // Récupère les datas (photographes + media) des photographes
    const infos = await getAllPhotographerData();
    // displayData with array of photographers from the fetch json file
    generateAllPhotographersCard(infos.photographers);
}

init();
