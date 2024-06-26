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
    main.innerHTML += `<div class=" relative w-96 rounded-md bg-inherit backdrop-blur-sm flex items-center justify-between "><img src="http://localhost:3006/${user.avatar}" alt="User Avatar" class=" w-1/3 rounded-full"/> <div class="text-white text-3xl ">${user.user_first_name} ${user.user_last_name}</div> <input type="text" id="search-input" oninput="getAll()" placeholder="Enter a First Name or a Email" /> <select><option value="first_name"> First_name</option> <option value="email"> Email </option></select>
    <div id="dropDown" class=" absolute bottom-0 right-2 bg-white">
    <ul class="user"> blob  </ul>
    </div></div>`;
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

  cards.innerHTML = "";

  post.post.forEach((Post) => {
    if (user[0].user_id === Post.userId) {
      cards.innerHTML += `<div class= " relative flex justify-between text-center border-solid border-2 border-white w-2/4 bg-[#eac079] bg-opacity-20 m-10 card rounded border border-black  "><div><img src="${
        Post.image
      }" class='w-56 h-56  object-cover border-r-2'></div><div class= "w-auto h-auto mx-6 my-6 text-center "> <h2 class="text-lg"> ${
        Post.title
      }</h2> <br> <br><p>${
        Post.description
      }</p>  <br> <p class="absolute bottom-0 right-0"> ${new Date(
        Post.date
      ).toLocaleDateString("fr")} </p>${
        user[0].user_id === Post.userId
          ? `<button onclick="Modifier('${Post._id}')" class="mx-1 modifier ${Post._id} ">Modifier</button><button class="mx-1 delete" onclick="deleteArticle('${Post._id}') ">Supprimer</button>`
          : ""
      }${
        Post.role === "admin"
          ? `<button class="mx-1 delete" onclick="deleteArticle('${Post._id}') ">Supprimer</button>`
          : ""
      }</div></div> `;
    }
  });
}

GetPostFromCourantUser();

async function getAllUserByBeAdmin() {
  let jwt = window.localStorage.getItem("jwt");

  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
  };

  let apiRequest = await fetch(
    "http://localhost:3006/user/getAllUser",
    request
  );

  let response = await apiRequest.json();

  cards.innerHTML = "";

  response.forEach((user) => {
    cards.innerHTML += `<div class= " relative flex-col justify-center items-center text-center border-solid border-2 border-white w-3/4 bg-[#eac079] bg-opacity-20 m-10 card rounded border border-white  ">
    <div><img src="http://localhost:3006/${user.avatar}" class='w-72 h-56  object-cover '></div>
    <div class= "w-56 h-auto mx-6 my-6 text-center text-white "> <p class="text-md "> ${user.user_first_name}
     ${user.user_last_name}</p></div></div>`;
  });
}

async function getAll() {
  let jwt = window.localStorage.getItem("jwt");
  const select = document.querySelector("select").value;
  const searchInput = document.querySelector("#search-input").value;
  const users = document.querySelector(".user");
  const dropdown = document.querySelector("#dropDown");
  if (!searchInput) {
    dropdown.classList.add("hidden");
  } else if (select == "email" && searchInput.length > 0) {
    let request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${jwt}`,
      },
    };

    let apiUser = await fetch(
      `http://localhost:3006/user/getUserByEmail/${searchInput}`,
      request
    );
    let responseUser = await apiUser.json();

    if (apiUser.status === 200) {
      dropdown.classList.remove("hidden");
      users.innerHTML = "";

      responseUser.forEach((user) => {
        users.innerHTML += `<li><button onclick="redirectionProfile('${user.id}')">
        <div class="flex flex-row items-center">
        <img src="http://localhost:3006/${user.avatar}" class="w-12 object-cover h-12 rounded-full"> <p class="m-2">${user.user_first_name}</p>
        </div
        </button>
        </li>
        `;
      });
    }
  } else if (select == "first_name" && searchInput.length > 0) {
    let request = {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: `Bearer ${jwt}`,
      },
    };

    let apiUser = await fetch(
      `http://localhost:3006/user/getUserByName/${searchInput}`,
      request
    );
    let responseUser = await apiUser.json();

    if (apiUser.status === 200) {
      dropdown.classList.remove("hidden");
      users.innerHTML = "";

      responseUser.forEach((user) => {
        users.innerHTML += `<li><button onclick="redirectionProfile('${user.id}')">
    <div class="flex flex-row items-center">
    <img src="http://localhost:3006/${user.avatar}" class="w-12 object-cover h-12 rounded-full"> <p class="m-2">${user.user_first_name}</p>
    </div>
    </button>
    </li>
    `;
      });
    }
  }
}
