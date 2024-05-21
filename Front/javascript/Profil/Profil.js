const main = document.querySelector(".main");
const logOut = document.querySelector("#LogOut");
const cards = document.querySelector(".cards");

logOut.addEventListener("click", () => {
  window.localStorage.clear();

  setTimeout(() => {
    window.location.href = "../../Html/Auth/Login.html";
  }, 1000);
});

async function getUser() {
  let jwt = window.localStorage.getItem("jwt");
  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };

  let apiRequest = await fetch("http://localhost:3006/user/getUser", request);
  let user = await apiRequest.json();
  user.forEach((user) => {
    main.innerHTML += `<div class="border border-black w-96 rounded-md bg-slate-400 flex items-center justify-between"><img src="http://localhost:3006/${user.avatar}" alt="User Avatar" class=" w-1/3 rounded-full"/> <div class="text-white text-3xl ">${user.user_first_name} ${user.user_last_name}</div></div>`;
  });
}
getUser();

async function GetPostFromCourantUser() {
  let jwt = window.localStorage.getItem("jwt");

  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };

  let apiUser = await fetch("http://localhost:3006/user/getUser", request);
  let user = await apiUser.json();

  let apiPost = await fetch("http://localhost:3009/post/getAllPost", request);
  let post = await apiPost.json();
  console.log(user[0].user_id);
  console.log(post[0].userId);
  post.forEach((Post) => {
    if (user[0].user_id === post[0].userId) {
      cards.innerHTML += `<div class= "flex justify-between text-center border-solid border-2 border-white w-2/4 bg-cyan-500 bg-opacity-60 m-10 card rounded border border-black  "><div><img src="${
        Post.image
      }" class='w-56 h-56  object-cover border-r-2'></div><div class= "w-auto h-auto mx-6 my-6 text-center "> <h2 class="text-lg"> ${
        Post.title
      }</h2> <p><span class="text-white">Coeur de la publication:</span> <br>${
        Post.description
      }</p> <p><span class="text-white">posté le:</span> <br> ${new Date(
        Post.date
      ).toLocaleDateString("fr")}${
        Post.role === "admin"
          ? `<button onclick="Modifier('${Post._id}')" class="mx-1 modifier ${Post._id} ">Modifier</button><button class="mx-1 delete" onclick="deleteArticle('${Post._id}') ">Supprimer</button>`
          : ""
      }</div></div> `;
    }
  });
}

GetPostFromCourantUser();
