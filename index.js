const express = require('express');
const cors = require("cors");
const path = require("path");
const Database = require("better-sqlite3");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = "#Admin123";
function authMiddleware(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res.json({ message: "Token tidak ditemukan" });
  }

try {
  const data = jwt.verify(token, SECRET);
  req.user = data;
  next();
}  catch (e) {
    res.json({ message: "Token tidak valid" });
  }
}

const db = new Database("todos.db");
db.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    todo TEXT NOT NULL
  )
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    password TEXT NOT NULL
  )
`)
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.post("/todos", (req, res) => {
  const todo = req.body.todo;
  const result = db.prepare("INSERT INTO todos (todo) VALUES (?)").run(todo);
  res.json({ message: "Todo ditambahkan", id: result.lastInsertRowid });
});

app.get("/todos", authMiddleware, (req, res) => {
  const todos = db.prepare("SELECT * FROM todos").all();
  res.json(todos);
});

app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;
  db.prepare("DELETE FROM todos WHERE id = ?").run(id);
  res.json({ message: "Todo dihapus"});
});
app.get('/', (req, res) => {
  res.send("server pertamamu Jalan!");
});
app.get('/tentang', (req, res) => {
  res.json({
    nama: "Louise Koruwa",
    mimpi: "Fullstack Developer",
    umur: 16
  });
});
app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.json({ message: "Username dan password harus diisi" });
  }
  const hash = await bcrypt.hash(password, 10);

  try {
  db.prepare("INSERT INTO users (username, password) VALUES (?, ?)").run(username, hash);
  res.json({ message: "User berhasil didaftarkan" });
} catch (e) {
  res.json({ message: "Username sudah digunakan" });
}
   });
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username);
  if (!user) {
    return res.json({ message: "Username tidak ditemukan" });
  }

  const cocok = await bcrypt.compare(password, user.password);

  if(!cocok) {
    return res.json({ message: "Password salah" });
  }
  const token = jwt.sign({ id: user.id }, SECRET);
  res.json({ message: "Login berhasil", token });
})

app.listen(3000, () => {
   console.log("Server berjalan di port 3000");
});