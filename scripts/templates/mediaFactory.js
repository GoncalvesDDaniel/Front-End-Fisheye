// {
// 	"id": 342550,
// 	"photographerId": 82,
// 	"title": "Fashion Yellow Beach",
// 	"image": "Fashion_Yellow_Beach.jpg",
// 	"likes": 62,
// 	"date": "2011-12-08",
// 	"price": 55
// },
function mediaTemplate(data, photographName) {
    const { id, title, likes, date, price, image } = data;
    const picture = `assets/photographers/${photographName}/${image}`;

    const img = document.createElement("img");
    img.setAttribute("src", picture);

    function getUserCardDOM() {}
    return { name, picture, getUserCardDOM, getHTMLInfo, getHTMLPicture };
}
