const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post("/api/notes", (req, res) => {
  const newNote = req.body;
  newNote.id = uuid.v4();

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);
    notes.push(newNote);

    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
      if (err) throw err;

      res.json(newNote);
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    const notes = JSON.parse(data);
    const noteIndex = notes.findIndex((note) => note.id === id);

    if (noteIndex > -1) {
      notes.splice(noteIndex, 1);

      fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
        if (err) throw err;

        res.json(notes);
      });
    } else {
      res.status(404).send("Note not found");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});