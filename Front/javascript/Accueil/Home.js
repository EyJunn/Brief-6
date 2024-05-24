let cards = document.querySelector("#cards");
let body = document.querySelector("#body");
let logOut = document.querySelector("#LogOut");

logOut.addEventListener("click", () => {
  window.localStorage.clear();

  setTimeout(() => {
    window.location.href = "../../Html/Auth/Login.html";
  }, 1000);
});

async function getAllEquipment() {
  let jwt = window.localStorage.getItem("jwt");

  let request = {
    method: "GET",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  };

  let apiRequest = await fetch(
    "http://localhost:3009/post/getAllPost",
    request
  );

  let response = await apiRequest.json();

  if (jwt) {
    response.forEach((response) => {
      cards.innerHTML += ` 
    <div class= " relative flex justify-between text-center border-solid border-2 border-white w-2/4 bg-cyan-500 bg-opacity-60 m-10 card rounded border border-black  "><div><img src="${
      response.image
    }" class='w-72 h-56   object-cover border-r-2'></div><div class= "w-auto h-auto mx-6 my-6 pr-5 "> <h2 class="text-lg"> ${
        response.title
      }</h2> <br><br>${
        response.description
      }</p> <p class="absolute bottom-0 right-0">  ${new Date(
        response.date
      ).toLocaleDateString(
        "fr"
      )}</p> <br><button class="">Like</button> <button class="">Dislike</button>${
        response.role === "admin"
          ? `<button class="mx-1 delete" onclick="deleteArticle('${response._id}') ">Supprimer</button>`
          : ""
      }</div></div> `;
    });
  } else {
    body.innerHTML = ` <header
      class="flex justify-between w-full h-24 p-5 bg-white text-center bg-opacity-60 sticky top-0 backdrop-blur-sm relative"
    >
      <img src="../../Html/media/ChapiChapo_header.png" class="w-32" />
      <a
        id="connexion"
        href="../../Html/Auth/Login.html"
        class="w-auto rounded-full bg-cyan-500 p-2 hover:bg-opacity-40 absolute right-24 hover:cursor-pointer"
      >
        Connection </a
      >
      <a
        id="register"
        class="w-auto h-10 rounded-full bg-cyan-500 p-2 hover:bg-opacity-40"
        href = "../../Html/Auth/Register.html"
      >
        S'inscrire
      </a>
    </header>
    <div class="flex flex-col justify-center text-center border-solid border-2 border-white w-2/5 h-96 bg-cyan-500 bg-opacity-60 m-10 card rounded"><h2 class= "text-xl"> Bonjour, bienvenue sur ChapiChapo. Le réseau social du moment. </h2> <br>
      <p> Inscrits toi ou connectes toi pour voir les publications de ceux faisant partie du réseau.</p>
      </div>
       <footer class="w-full h-16 p-5 bg-white bg-opacity-80 absolute bottom-0 ">
      <ol class="flex justify-evenly Chapi">
        <li>About us</li>
        <li>Contact</li>
        <li>
          <a href="https://youtu.be/-OMyXgn9NUQ?feature=shared" target="_blank"
            >ChapiChapo</a
          >
        </li>
      </ol>
    </footer>`;
  }
}

getAllEquipment();
