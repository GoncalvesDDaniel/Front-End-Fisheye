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
    lightbox();
}

function lightbox() {
    const lightbox = document.querySelector(".lightbox");
    const gallery = document.querySelector(".gallery");
    const header = document.querySelector("header");
    const main = document.getElementById("main");
    const body = document.querySelector("body");

    function displayLightbox() {
        lightbox.classList.remove("hide");
        lightbox.setAttribute("aria-hidden", "false");
        main.setAttribute("aria-hidden", "true");
        body.classList.add("no-scroll");
        header.setAttribute("aria-hidden", "true");
        trapFocus();
    }

    function closeLightbox() {
        lightbox.classList.add("hide");
        lightbox.setAttribute("aria-hiden", "true");
        main.setAttribute("aria-hidden", "false");
        header.setAttribute("aria-hidden", "false");
        body.classList.remove("no-scroll");
    }

    function trapFocus() {
        const focusableElements = 'button, [tabindex]:not([tabindex="-1"])';
        // select the modal by it's id
        const firstFocusableElement =
            lightbox.querySelectorAll(focusableElements)[0];
        const focusableContent = lightbox.querySelectorAll(focusableElements);
        const lastFocusableElement =
            focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

        document.addEventListener("keydown", function (e) {
            let isTabPressed = e.key === "Tab";

            if (!isTabPressed) {
                return;
            }

            if (e.shiftKey) {
                // if shift key pressed for shift + tab combination
                if (document.activeElement === firstFocusableElement) {
                    lastFocusableElement.focus(); // add focus for the last focusable element
                    e.preventDefault();
                }
            } else {
                // if tab key is pressed
                if (document.activeElement === lastFocusableElement) {
                    // if focused has reached to last focusable element then focus first focusable element after pressing tab
                    firstFocusableElement.focus(); // add focus for the first focusable element
                    e.preventDefault();
                }
            }
        });

        firstFocusableElement.focus();
    }

    gallery.addEventListener("click", (event) => {
        const clickedElement = event.target.closest(".gallery-content");
        if (!clickedElement) return;
        let galleryNodeEl = document.querySelectorAll(".gallery-content");
        let lightboxArrayGallery = Array.from(galleryNodeEl);
        displayLightbox();
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

        function lightboxDisplayMedia(index, array) {
            let mediaType = array[index].localName;
            let mediaImageTitle = array[index].alt;
            let mediaVideoTitle = array[index].dataset.title;
            let lightboxEl = document.querySelector(".lightbox-content");
            if (mediaType === "img") {
                lightboxEl.innerHTML = `<${mediaType} src=${array[index].src} alt=${array[index].alt} class='lightbox-content_media'></${mediaType}><p class='lightbox-title'>${mediaImageTitle}</p>`;
            }

            if (mediaType === "video") {
                lightboxEl.innerHTML = `<${mediaType} controls src=${array[index].src} alt=${array[index].alt} type="video/mp4" preload="metadata" class='lightbox-content_media'></${mediaType}><p class='lightbox-title'>${mediaVideoTitle}</p>`;
            }
        }

        lightbox.addEventListener("click", (event) => {
            const pointerClick = event.target.className;
            switch (pointerClick) {
                case "lightbox-next":
                    displayNextMedia();
                    break;
                case "lightbox-previous":
                    displayPreviousMedia();
                    break;
                case "lightbox-close":
                    closeLightbox();
                    break;
            }
        });

        lightbox.addEventListener("keydown", (event) => {
            if (event.key === "ArrowLeft") {
                displayPreviousMedia();
                event.preventDefault();
            }
            if (event.key === "ArrowRight") {
                displayNextMedia();
                event.preventDefault();
            }
            if (event.key === "Escape") {
                closeLightbox();
                event.preventDefault();
            }
        });
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
init();
