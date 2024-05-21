const LogOUT = document.querySelector("#LogOut");

LogOUT.addEventListener("click", () => {
  window.localStorage.clear();

  setTimeout(() => {
    window.location.href = "../../Html/Auth/Login.html";
  }, 1000);
});

async function createArticle() {
  let image = document.querySelector("#image").value;
  let Description = document.querySelector("#Description").value;
  let title = document.querySelector("#title").value;

  let jwt = window.localStorage.getItem("jwt");

  if (!jwt) {
    window.location.href = "../../Html/Auth/Login.html";
  }

  let post = {
    image: image,
    title: title,
    description: Description,
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      Authorization: `Bearer ${jwt}`,
    },
    body: JSON.stringify(post),
  };

  let apiRequest = fetch("http://localhost:3009/post/addPost", request);

  let response = await apiRequest;

  if (response.status === 200) {
    setTimeout(() => {
      alert("Post create");
      window.location.href = "../../Html/Profil/Profil.html";
    }, 1000);
  }
}
