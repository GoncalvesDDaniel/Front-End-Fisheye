// {
// 	"id": 342550,
// 	"photographerId": 82,
// 	"title": "Fashion Yellow Beach",
// 	"image": "Fashion_Yellow_Beach.jpg",
// 	"likes": 62,
// 	"date": "2011-12-08",
// 	"price": 55
// },

function mediaTemplate(data) {
    const { id, title, likes, image } = data;
    const div = document.querySelector(".gallery");
    const media = `./assets/photographers/${photographerId}/${image}`;
    function getUserMediaCardDOM() {
        const divCard = document.createElement("div");
        divCard.className = "gallery-card";
        // const img = document.createElement('img')
        // img.setAttribute = ('src', media)
        // img.setAttribute = ('alt', title)
        // const title = document.createElement('p')
        // title.innerText = `${title}`

        divCard.innerHTML = `   
          <img src=${media} alt="${title}" class="gallery-img">
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
