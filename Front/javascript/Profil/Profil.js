const main = document.querySelector(".main");

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
    console.log(user.avatar);
    main.innerHTML += `<div class=" border-slate-950 rounded-full"><img src="http://localhost:3006/${user.avatar}" alt="User Avatar"/></div>`;
  });
}
getUser();
