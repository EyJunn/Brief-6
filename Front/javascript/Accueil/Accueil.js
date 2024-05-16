let cards = document.querySelector("#cards");
let logOut = document.querySelector("#LogOut");

logOut.addEventListener("click", () => {
  window.localStorage.clear();

  setTimeout(() => {
    window.location.href = "../../Html/Auth/Login.html";
  }, 1000);
});

async function getAllEquipment() {
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  let apiRequest = await fetch(
    "http://localhost:3006/post/getAllPost",
    request
  );
  let response = await apiRequest.json();
  response.forEach((response) => {
    cards.innerHTML += `<div class= "flex justify-center text-center border-solid border-2 border-white w-1/4 bg-cyan-500 bg-opacity-60 m-10 card rounded  "><div><img src="${
      response.image
    }" class='w-48 h-48 object-cover border-r-2'></div><div class= "w-auto h-auto mx-6 my-6 text-center "> <h2>${
      response.title
    }</h2> <p>${response.description}</p> <p>posté le ${new Date(
      response.date
    ).toLocaleDateString(
      "fr"
    )}</p> <button class="">Like</button> <button class="">Dislike</button>${
      response.role === "admin"
        ? `<button onclick="Modifier('${response._id}')" class="mx-1 modifier ${response._id} ">Modifier</button><button class="mx-1 delete" onclick="deleteArticle('${equipment._id}') ">Supprimer</button>`
        : ""
    }</div></div> `;
  });
}
getAllEquipment();
