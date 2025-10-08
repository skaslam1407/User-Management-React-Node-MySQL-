require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL connection using .env variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect(err => {
  if (err) throw err;
  console.log('MySQL Connected...');
});

// ---- CRUD APIs ----

// Read all users
app.get('/users', (req, res) => {
  db.query('SELECT * FROM users', (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

// Create new user
app.post('/users', (req, res) => {
  const { name, email, age } = req.body;
  db.query('INSERT INTO users (name, email, age) VALUES (?, ?, ?)', [name, email, age], (err, result) => {
    if (err) throw err;
    res.send({ message: 'User added successfully!' });
  });
});

// Update user
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;
  db.query('UPDATE users SET name=?, email=?, age=? WHERE id=?', [name, email, age, id], (err, result) => {
    if (err) throw err;
    res.send({ message: 'User updated successfully!' });
  });
});

// Delete user
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM users WHERE id=?', id, (err, result) => {
    if (err) throw err;
    res.send({ message: 'User deleted successfully!' });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
