async function getPhotographers() {
    const response = await fetch("./data/photographers.json");
    const data = await response.json();
    return data;
}

async function displayData(photographers) {
    const photographersSection = document.querySelector(
        ".photographer_section"
    );

    photographers.forEach((photographer) => {
        const photographerModel = photographerTemplate(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        photographersSection.appendChild(userCardDOM);
    });
}

async function init() {
    // Récupère les datas des photographes
    const photographers = await getPhotographers();
    // displayData with array of photographers from the fetch json file
    displayData(photographers.photographers);
}

init();
