async function HandleLogin() {
  let email = document.querySelector("#email").value;
  let password = document.querySelector("#password").value;

  let user = {
    email: email,
    password: password,
  };

  let request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(user),
  };

  let apiRequest = fetch("http://localhost:3006/user/login", request);
  let response = await apiRequest;
  let data = await response.json();
  if (response.status === 200) {
    let jwt = data.jwt;
    let role = data.role;
    window.localStorage.setItem("jwt", jwt);

    window.location.href = "../../Html/Profil/Profil.html";
  } else {
    alert("Wrong Credentials");
  }
}

async function HandleRegister() {
  let image = document.querySelector(".image");
  const formData = new FormData();

  formData.append("image", image.files[0]);

  const response = await fetch("http://localhost:3006/user/imageUser", {
    method: "POST",
    body: formData,
  });

  if (response.status === 200) {
    let data = await response.json();
    let uploadedImage = data.newFileName;

    let firstName = document.querySelector(".first_name").value;
    let lastName = document.querySelector(".last_name").value;
    let email = document.querySelector(".mail").value;
    let password = document.querySelector(".Password").value;

    let user = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
      image: uploadedImage,
    };

    let request = {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(user),
    };

    let apiRequest = fetch("http://localhost:3006/user/register", request);
    let res = await apiRequest;
    if (res.status === 200) {
      setTimeout(() => {
        window.location.href = "../../Html/Auth/Login.html";
      }, 1000);
    }
  }
}
