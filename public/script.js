const URL = "https://5528551b-4b07-4335-9e02-c2b6fc8088a1-00-24cdvltmb1qfe.pike.replit.dev";
const tombol = document.getElementById("btn");
const input = document.getElementById("input");
const list = document.getElementById("list");
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "login.html";
};
function tampilTodo(todo, id) {
  const item = document.createElement("li");
  item.innerText = todo;
  item.dataset.id = id;

  const btn = document.createElement("button");
  btn.innerText = "Hapus";
  btn.addEventListener("click", () => {
    fetch(URL + "/todos/" + id, { method: "DELETE" })
      .then(() => item.remove());
  });

  item.appendChild(btn);
  list.appendChild(item);
}

fetch(URL + "/todos", {
  headers: { "Authorization": token }
})
.then(res => res.json())
.then(data => {
  data.forEach(todo => {
    tampilTodo(todo.todo, todo.id);
  });
});

tombol.addEventListener("click", () => {
  if (input.value === "") {
    alert("Masukkan Peralatan Dulu");
  } else {
    fetch(URL + "/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ todo: input.value })
    })
    .then(res => res.json())
    .then((data) => {
      tampilTodo(input.value, data.id);
      input.value = "";
    });
  }
});