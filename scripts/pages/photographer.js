//Mettre le code JavaScript lié à la page photographer.html
async function getPhotographerId() {
    const response = await fetch("./data/photographers.json");
    const data = await response.json();
    // dataParse = JSON.parse(data.photographers);
    console.log(data.photographers);
    return data;
}
const photographerId = getPhotographerId();
