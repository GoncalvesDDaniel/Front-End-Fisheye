import { getAllPhotographerData } from "../utils/api.js";
import { photographerTemplate } from "../templates/photographerFactory.js";
import { displayMedia } from "../templates/mediaFactory.js";
import { lightbox } from "../utils/lightbox.js";
import { lightbox2 } from "../utils/lightbox2.js";

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
    const photographMediaGallery = document.querySelector(".photograph-header");
    const photographContactBtn = document.querySelector(".contact_button");
    const formTitle = document.querySelector(".modal-title");
    const photographPrice = document.querySelector(".photograph-price");

    //photographerTemplate should return name picture card etc...
    const photographModel = photographerTemplate(array);
    const photographInfo = photographModel.getHTMLInfo();
    const photographPicture = photographModel.getHTMLPicture();

    photographContactBtn.insertAdjacentElement("beforebegin", photographInfo);
    photographMediaGallery.appendChild(photographPicture);

    // display price on bottom right corner
    photographPrice.innerText = `${photographModel.price}€/jour`;
    // display the name in the modal title
    formTitle.innerText = `Contactez-moi
    ${photographModel.name}`;
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
    likeCounter(photograph);
    initLightbox();
    // lightbox();
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
        // counter place here because no back end avaliable now.
        // Every time a sort is appl,y reset le number of like. To be coherent, I have placed here so it reset too.
        likeCounter(photographer);
    });
}

function likeCounter(obj) {
    const totalLikesEl = document.querySelector(".photograph-likes-count");
    let totalLikes = obj.media.reduce((a, b) => a + b.likes, 0);
    totalLikesEl.innerText = totalLikes;

    const likedMedia = document.querySelectorAll(".gallery-heart");
    likedMedia.forEach((heart) =>
        heart.addEventListener("click", (event) => {
            const clickedElement = event.target.closest(".gallery-heart");
            if (!clickedElement) return;

            //previous = number before the heart img
            let totalLikesOfMediaEl = event.target.previousElementSibling;
            incrementLikes(totalLikesOfMediaEl);
        })
    );
    likedMedia.forEach((heart) =>
        heart.addEventListener("keydown", (event) => {
            if (
                document.activeElement.className === "gallery-heart" &&
                event.key === "Enter"
            ) {
                incrementLikes(event.target.previousElementSibling);
            }
        })
    );
    function incrementLikes(elLiked) {
        let numberOfMediaLikes = parseInt(elLiked.textContent);
        let numberOfTotalLikes = parseInt(totalLikesEl.textContent);

        elLiked.textContent = numberOfMediaLikes + 1;
        totalLikesEl.textContent = numberOfTotalLikes + 1;
    }
}

function initLightbox() {
    const mediaContents = document.querySelectorAll(".gallery-content");

    mediaContents.forEach((content) => {
        content.addEventListener("click", (event) => {
            if (!event.target.className === "gallery-content") return;
            else {
                lightbox2(event);
            }
        });

        content.addEventListener("keydown", (event) => {
            if (event.key !== "Enter") return;
            if (
                document.activeElement.className === "gallery-content" &&
                event.key === "Enter"
            ) {
                // console.log(event);
                // debugger;
                lightbox2(event);
            }
        });
    });
}

init();
