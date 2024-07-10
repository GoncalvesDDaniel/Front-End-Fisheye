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
    let medias = photograph.media;

    // sort and display gallery content by likes by default
    medias.sort(function (a, b) {
        return b.likes - a.likes;
    });
    displayMedia(medias);
    sortGalleryListener(medias);
    lightbox();
}

// lightbox
function lightbox() {
    const lightbox = document.querySelector(".lightbox");
    const gallery = document.querySelector(".gallery");
    gallery.addEventListener("click", (event) => {
        lightbox.classList.remove("hide");
        let galleryNodeEl = document.querySelectorAll(".gallery-content");
        let lightboxArrayGallery = Array.from(galleryNodeEl);
        let index;

        // find index of the clicked media
        lightboxArrayGallery.forEach((element, i) => {
            if (element.src === event.target.src) {
                index = i;
            }
        });

        lightboxDisplayMedia(index, lightboxArrayGallery);

        const nextLightboxButton = document.querySelector(".lightbox-next");
        const previousLightboxButton =
            document.querySelector(".lightbox-previous");

        nextLightboxButton.addEventListener("click", () => {
            index++;
            if (index < lightboxArrayGallery.length - 1) {
                lightboxDisplayMedia(index, lightboxArrayGallery);
            } else {
                index = 0;
                lightboxDisplayMedia(index, lightboxArrayGallery);
            }
        });
        previousLightboxButton.addEventListener("click", () => {
            index--;
            if (index >= 0) {
                lightboxDisplayMedia(index, lightboxArrayGallery);
            } else {
                index = lightboxArrayGallery.length - 1;
                lightboxDisplayMedia(index, lightboxArrayGallery);
            }
        });
    });
    function lightboxDisplayMedia(index, array) {
        let mediaType = array[index].localName;
        let lightboxEl = document.querySelector(".lightbox-content");
        if (mediaType === "img") {
            lightboxEl.innerHTML = `<${mediaType} src=${array[index].src} alt=${array[index].alt}></${mediaType}>`;
        }

        if (mediaType === "video") {
            lightboxEl.innerHTML = `<${mediaType} controls src=${array[index].src} alt=${array[index].alt} type="video/mp4" preload="metadata"></${mediaType}>`;
        }
    }
    const closeLightboxButton = document.querySelector(".lightbox-close");
    closeLightboxButton.addEventListener("click", () =>
        lightbox.classList.add("hide")
    );
}
// sort medias with select options
function sortGalleryListener(gallery) {
    const sortChoice = document.querySelector("select");
    console.log(gallery);
    sortChoice.addEventListener("change", () => {
        const galleryCleaner = document.querySelector(".gallery");
        galleryCleaner.innerHTML = "";
        switch (sortChoice.selectedIndex) {
            // popularity set by default on html
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
