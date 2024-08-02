// {
// 	"id": 342550,
// 	"photographerId": 82,
// 	"title": "Fashion Yellow Beach",
// 	"image": "Fashion_Yellow_Beach.jpg",
// 	"likes": 62,
// 	"date": "2011-12-08",
// 	"price": 55
// },

export function displayMedia(data) {
    const { id, photographerId, title, likes, image, video } = data;
    const div = document.querySelector(".gallery");
    let media;
    let content;
    //  check if image or video exist and display appropriate content
    if (!!image) {
        media = `./assets/photographers/${photographerId}/${image}`;
        content = `<img src=${media} alt="${title}" class="gallery-content"></img>`;
    }
    if (!!video) {
        media = `./assets/photographers/${photographerId}/${video}`;
        content = `<video  src="${media}#t=0.1" type="video/mp4" preload="metadata" class="gallery-content"></video>`;
    }

    function getUserMediaCardDOM() {
        const divCard = document.createElement("div");
        divCard.className = "gallery-card";

        divCard.innerHTML = `   
          ${content}
          <div class="gallery-text">
            <p class="gallery-title">${title}</p>
            <div class="gallery-likes">
              <p class="likes-count">${likes}</p>
              <img src="assets/icons/Heart.svg" alt="" class="gallery-heart">
            </div>
        </div>
    `;
        return divCard;
    }
    return { id, media, getUserMediaCardDOM };
}
