const modal = document.getElementById("contact_modal");
const header = document.querySelector("header");
const main = document.getElementById("main");
const firstInput = document.getElementById("prenom");
// const lightbox = document.querySelector(".lightbox");

function displayModal() {
    // const photographNameH1 = document.querySelector("h1");
    // const modalName = document.querySelector(".modal h2");
    // modalName.innerHTML = `Contactez moi ${photographNameH1}`;
    header.setAttribute("aria-hidden", "true");
    main.setAttribute("aria-hidden", "true");
    firstInput.focus();
    modal.classList.remove("hide");
    modal.setAttribute("aria-hidden", "false");
    // lightbox.setAttribute("aria-hidden", "true");
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
    if (event.key === "Escape") {
        closeModal();
    } else return;
});
