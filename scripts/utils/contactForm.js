const modal = document.getElementById("contact_modal");
const header = document.querySelector("header");
const main = document.getElementById("main");
const firstInput = document.getElementById("prenom");

function displayModal() {
    header.setAttribute("aria-hidden", "true");
    main.setAttribute("aria-hidden", "true");
    firstInput.focus();
    modal.classList.remove("hide");
    modal.setAttribute("aria-hidden", "false");
    const focusableElements =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
    const focusableContent = modal.querySelectorAll(focusableElements);
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

function closeModal() {
    modal.focus();
    modal.classList.add("hide");
    modal.setAttribute("aria-hidden", "true");
    header.setAttribute("aria-hidden", "false");
    main.setAttribute("aria-hidden", "false");
    // lightbox.setAttribute("aria-hidden", "false");
}

document.addEventListener("keydown", (event) => {
    if (!event.key === "Escape") {
        return;
    }
    if (event.key === "Escape") {
        closeModal();
    }
});

document.addEventListener("submit", (event) => {
    const userInputs = document.querySelectorAll("input, textarea");
    event.preventDefault();
    userInputs.forEach((input) => {
        console.log(`${input.id} = ${input.value}`);
    });
    closeModal();
    return;
});
