const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = new sqlite3.Database('./mydb.sqlite');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      description TEXT,
      duration INTEGER,
      price INTEGER,
      teacher TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      experience INTEGER,
      specialization TEXT,
      rating REAL,
      courses TEXT -- можно хранить в виде JSON строки
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      age INTEGER,
      courses TEXT,  -- JSON строка массива
      grades TEXT,   -- JSON строка массива
      status TEXT
    )
  `);
});

// ======== COURSES ========
app.get('/courses', (req, res) => {
  db.all('SELECT * FROM courses', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    res.json(rows);
  });
});

app.post('/courses', (req, res) => {
  const { name, description, duration, price, teacher } = req.body;
  db.run(
    `INSERT INTO courses (name, description, duration, price, teacher) VALUES (?, ?, ?, ?, ?)`,
    [name, description, duration, price, teacher],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: this.lastID });
    }
  );
});

app.delete('/courses/:id', (req, res) => {
  db.run(`DELETE FROM courses WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.sendStatus(200);
  });
});

app.put('/courses/:id', (req, res) => {
  const { name, description, duration, price, teacher } = req.body;
  db.run(
    `UPDATE courses SET name=?, description=?, duration=?, price=?, teacher=? WHERE id=?`,
    [name, description, duration, price, teacher, req.params.id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.sendStatus(200);
    }
  );
});

// ======== TEACHERS ========
app.get('/teachers', (req, res) => {
  db.all('SELECT * FROM teachers', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    rows = rows.map(row => ({
      ...row,
      courses: row.courses ? JSON.parse(row.courses) : []
    }));
    res.json(rows);
  });
});

app.post('/teachers', (req, res) => {
  const { name, experience, specialization, rating, courses } = req.body;
  const coursesStr = JSON.stringify(courses || []);
  db.run(
    `INSERT INTO teachers (name, experience, specialization, rating, courses) VALUES (?, ?, ?, ?, ?)`,
    [name, experience, specialization, rating, coursesStr],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: this.lastID });
    }
  );
});

app.delete('/teachers/:id', (req, res) => {
  db.run(`DELETE FROM teachers WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.sendStatus(200);
  });
});

app.put('/teachers/:id', (req, res) => {
  const { name, experience, specialization, rating, courses } = req.body;
  const coursesStr = JSON.stringify(courses || []);
  db.run(
    `UPDATE teachers SET name=?, experience=?, specialization=?, rating=?, courses=? WHERE id=?`,
    [name, experience, specialization, rating, coursesStr, req.params.id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.sendStatus(200);
    }
  );
});

// ======== STUDENTS ========
app.get('/students', (req, res) => {
  db.all('SELECT * FROM students', [], (err, rows) => {
    if (err) return res.status(500).send(err.message);
    rows = rows.map(row => ({
      ...row,
      courses: row.courses ? JSON.parse(row.courses) : [],
      grades: row.grades ? JSON.parse(row.grades) : []
    }));
    res.json(rows);
  });
});

app.post('/students', (req, res) => {
  const { name, age, courses, grades, status } = req.body;
  const coursesStr = JSON.stringify(courses || []);
  const gradesStr = JSON.stringify(grades || []);
  db.run(
    `INSERT INTO students (name, age, courses, grades, status) VALUES (?, ?, ?, ?, ?)`,
    [name, age, coursesStr, gradesStr, status],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.json({ id: this.lastID });
    }
  );
});

app.delete('/students/:id', (req, res) => {
  db.run(`DELETE FROM students WHERE id = ?`, [req.params.id], function (err) {
    if (err) return res.status(500).send(err.message);
    res.sendStatus(200);
  });
});

app.put('/students/:id', (req, res) => {
  const { name, age, courses, grades, status } = req.body;
  const coursesStr = JSON.stringify(courses || []);
  const gradesStr = JSON.stringify(grades || []);
  db.run(
    `UPDATE students SET name=?, age=?, courses=?, grades=?, status=? WHERE id=?`,
    [name, age, coursesStr, gradesStr, status, req.params.id],
    function (err) {
      if (err) return res.status(500).send(err.message);
      res.sendStatus(200);
    }
  );
});

app.listen(3000, () => console.log('Server started on http://localhost:3000'));
