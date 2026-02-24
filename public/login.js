const nama = document.getElementById("username");
const sandi = document.getElementById("password");
const tombol = document.getElementById("btn");
const pesan = document.getElementById("pesan");

tombol.addEventListener("click", ()  => {
  fetch("https://5528551b-4b07-4335-9e02-c2b6fc8088a1-00-24cdvltmb1qfe.pike.replit.dev/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: nama.value,
      password: sandi.value,
    })
  })
  .then(res => res.json())
  .then(data => {
    localStorage.setItem("token", data.token);
    window.location.href = "index.html"
    pesan.innerHTML = data.message;
  });
  });
