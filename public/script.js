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

  const editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.addEventListener("click", () => {
    const newTodo = prompt("Edit todo", todo);
    if (newTodo) {
      fetch(URL + "/todos/" + id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": token
                 },
        body: JSON.stringify({ todo: newTodo })
      })
      .then(res => res.json())
      .then (() => {
        item.firstChild.textContent = newTodo;
      });      
      }
    });     
const btnHapus = document.createElement("button");
  btnHapus.innerText = "Hapus";
  btnHapus.addEventListener("click", () => {
    fetch(URL + "/todos/" + id, { 
      method: "DELETE",
      headers: { "Authorization": token }
    })
    .then(() => item.remove());
  });

  item.appendChild(editBtn);
  item.appendChild(btnHapus);
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
      headers: { 
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify({ todo: input.value })
    })
    .then(res => res.json())
    .then((data) => {
      tampilTodo(input.value, data.id);
      input.value = "";
    });
  }
});