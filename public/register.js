const btn  = document.getElementById("btn");
const username = document.getElementById("username");
const password = document.getElementById("password");
const pesan = document.getElementById("pesan");

btn.addEventListener("click", () => {
  fetch("https://5528551b-4b07-4335-9e02-c2b6fc8088a1-00-24cdvltmb1qfe.pike.replit.dev/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username.value,
      password: password.value,
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.message === "User berhasil didaftarkan") {
    window.location.href = "login.html";
    } else {
    pesan.innerHTML = data.message;
      }
  });
   });
