const lightboxEl = document.querySelector(".lightbox");
const galleryEl = document.querySelector(".gallery");
const headerEl = document.querySelector("header");
const mainEl = document.getElementById("main");
const bodyEl = document.querySelector("body");

export function lightbox() {
    // const galleryContents = document.querySelectorAll('.gallery-content')
    //     galleryContents.forEach((content) =>
    //         content.addEventListener("keydown", (event) => {
    //             if (
    //                 document.activeElement.className === "gallery-content" &&
    //                 event.key === "Enter"
    //             ) {
    //                 displayLightbox()
    //             }
    //         })
    //     );

    galleryEl.addEventListener("click", (event) => {
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

        lightboxEl.addEventListener("click", (event) => {
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

        lightboxEl.addEventListener("keydown", (event) => {
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

function displayLightbox() {
    lightboxEl.classList.remove("hide");
    lightboxEl.setAttribute("aria-hidden", "false");
    mainEl.setAttribute("aria-hidden", "true");
    bodyEl.classList.add("no-scroll");
    headerEl.setAttribute("aria-hidden", "true");
    trapFocus();
}

function closeLightbox() {
    lightboxEl.classList.add("hide");
    lightboxEl.setAttribute("aria-hiden", "true");
    mainEl.setAttribute("aria-hidden", "false");
    headerEl.setAttribute("aria-hidden", "false");
    bodyEl.classList.remove("no-scroll");
}

function trapFocus() {
    const focusableElements = 'button, [tabindex]:not([tabindex="-1"])';
    // select the modal by it's id
    const firstFocusableElement =
        lightboxEl.querySelectorAll(focusableElements)[0];
    const focusableContent = lightboxEl.querySelectorAll(focusableElements);
    const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last element to be focused inside modal

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
