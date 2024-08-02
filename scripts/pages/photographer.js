//Mettre le code JavaScript lié à la page photographer.html
import { getAllPhotographerData } from "../utils/api.js";
import { photographerTemplate } from "../templates/photographerFactory.js";
import { displayMedia } from "../templates/mediaFactory.js";

// get photographer informations from url
const urlPhotographerParams = new URL(window.location).searchParams;
const photographerId = Number.parseInt(urlPhotographerParams.get("id"), 10);

//get data from fetch
async function getPhotographerData(id) {
    const data = await getAllPhotographerData();

    const photographer = data.photographers.filter(
        (photographer) => photographer.id === id
    );

    const media = data.media.filter((elem) => elem.photographerId === id);
    return { photographer, media };
}

//get H1 with name and some info + photographer picture
function displayData(array) {
    const photographHeader = document.querySelector(".photograph-header");
    const photographContactBtn = document.querySelector(".contact_button");

    //photographerTemplate should return name picture card etc...
    const photographModel = photographerTemplate(array);
    const photographInfo = photographModel.getHTMLInfo();
    const photographPicture = photographModel.getHTMLPicture();

    photographContactBtn.insertAdjacentElement("beforebegin", photographInfo);
    photographHeader.appendChild(photographPicture);
}

function generateGallery(array) {
    const gallery = document.querySelector(".gallery");

    array.forEach((media) => {
        const singleMedia = displayMedia(media);
        const userMediaCard = singleMedia.getUserMediaCardDOM();
        gallery.appendChild(userMediaCard);
    });
}
async function init() {
    const photograph = await getPhotographerData(photographerId);

    // displayData with array of photographers from the fetch json file
    displayData(photograph.photographer[0]);

    // sort by likes set by default
    photograph.media.sort(function (a, b) {
        return b.likes - a.likes;
    });

    generateGallery(photograph.media);
    sortGalleryListener(photograph.media, photograph);
    likeCounterAndPrice(photograph);
    lightbox();
}

// lightbox
function lightbox() {
    const lightbox = document.querySelector(".lightbox");
    const gallery = document.querySelector(".gallery");
    const header = document.querySelector("header");
    const main = document.getElementById("main");
    const closeLightboxButton = document.querySelector(".lightbox-close");
    gallery.addEventListener("click", (event) => {
        const clickedElement = event.target.closest(".gallery-content");
        if (!clickedElement) return;
        let galleryNodeEl = document.querySelectorAll(".gallery-content");
        let lightboxArrayGallery = Array.from(galleryNodeEl);
        lightbox.classList.remove("hide");
        lightbox.setAttribute("aria-hiden", "false");
        main.setAttribute("aria-hidden", "true");
        main.classList.add("no-scroll");
        header.setAttribute("aria-hidden", "true");
        closeLightboxButton.focus();
        let index;

        // find index of the clicked media
        lightboxArrayGallery.forEach((element, i) => {
            if (element.src === event.target.src) {
                index = i;
            }
        });

        lightboxDisplayMedia(index, lightboxArrayGallery);

        function displayNextMedia() {
            index++;
            if (index < lightboxArrayGallery.length - 1) {
                lightboxDisplayMedia(index, lightboxArrayGallery);
            } else {
                index = 0;
                lightboxDisplayMedia(index, lightboxArrayGallery);
            }
        }
        function displayPreviousMedia() {
            index--;
            if (index >= 0) {
                lightboxDisplayMedia(index, lightboxArrayGallery);
            } else {
                index = lightboxArrayGallery.length - 1;
                lightboxDisplayMedia(index, lightboxArrayGallery);
            }
        }

        const nextLightboxButton = document.querySelector(".lightbox-next");
        const previousLightboxButton =
            document.querySelector(".lightbox-previous");

        previousLightboxButton.addEventListener("click", () => {
            displayNextMedia();
        });
        nextLightboxButton.addEventListener("click", () => {
            displayNextMedia();
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                displayPreviousMedia();
            }
            if (event.key === "ArrowRight") {
                displayNextMedia();
            }
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
        closeLightboxButton.addEventListener("click", () => {
            lightbox.classList.add("hide");
            lightbox.setAttribute("aria-hiden", "true");
            main.setAttribute("aria-hidden", "false");
            main.classList.remove("no-scroll");
            header.setAttribute("aria-hidden", "false");
        });
        document.addEventListener("click", (event) =>
            console.log(event.target)
        );
    });
}

// sort medias gallery with select options
function sortGalleryListener(gallery, photographer) {
    const sortChoice = document.querySelector("select");

    sortChoice.addEventListener("change", () => {
        const galleryCleaner = document.querySelector(".gallery");
        //clear the html before new display
        galleryCleaner.innerHTML = "";

        switch (sortChoice.selectedIndex) {
            // popularity (set by default on html)
            case 0:
                gallery.sort(function (a, b) {
                    return b.likes - a.likes;
                });
                generateGallery(gallery);
                break;

            // Date
            case 1:
                gallery.sort(function (a, b) {
                    return new Date(b.date) - new Date(a.date);
                });
                generateGallery(gallery);
                break;
            // title
            case 2:
                gallery.sort(function (a, b) {
                    return b.title < a.title ? 1 : -1;
                });
                generateGallery(gallery);
                break;
        }
        likeCounterAndPrice(photographer);
    });
}

function likeCounterAndPrice(obj) {
    const photographHeader = document.querySelector(".media-gallery");
    let totalLikes = obj.media.reduce((a, b) => a + b.likes, 0);

    const div = document.createElement("div");
    div.className = "total-likes";

    const likesText = document.createElement("div");
    likesText.className = "photograph-likes";

    const pTotalLikes = document.createElement("p");
    pTotalLikes.className = "photograph-likes-count";
    pTotalLikes.textContent = `${totalLikes}`;

    const heart = document.createElement("img");
    heart.src = "assets/icons/Black-Heart.svg";
    heart.alt = "total likes";
    heart.className = "total-likes__heart";

    const pPrice = document.createElement("p");
    pPrice.className = "photograph-price";
    pPrice.textContent = `${obj.photographer[0].price}€/jour`;

    photographHeader.appendChild(div);
    div.appendChild(likesText);
    likesText.appendChild(pTotalLikes);
    likesText.appendChild(heart);
    div.appendChild(pPrice);

    // likeIncrementation();

    // function likeIncrementation() {
    const likedMedia = document.querySelectorAll(".gallery-heart");

    likedMedia.forEach((heart) =>
        heart.addEventListener("click", (event) => {
            const clickedElement = event.target.closest(".gallery-heart");
            if (!clickedElement) return;
            let numberOfLikes = parseInt(
                event.target.previousElementSibling.textContent
            );
            event.target.previousElementSibling.textContent = numberOfLikes + 1;

            const numberOfTotalLikesEl = document.querySelector(
                ".photograph-likes-count"
            );
            let numberOfTotalLikes = parseInt(numberOfTotalLikesEl.textContent);
            numberOfTotalLikesEl.textContent = numberOfTotalLikes + 1;
        })
    );
    // }
}
init();
