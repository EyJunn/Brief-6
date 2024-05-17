const main = document.querySelector(".main");
let logOut = document.querySelector("#LogOut");

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

  let apiRequest = await fetch("http://localhost:3006/user/getUsers", request);
  let user = await apiRequest.json();
  user.forEach((user) => {
    main.innerHTML += `<div class=" "><img src="http://localhost:3006/${user.avatar}" alt="User Avatar" class=" rounded-full"/> <div>${user.user_first_name} ${user.user_last_name}</div></div>`;
  });
}
getUser();
