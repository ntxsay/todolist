﻿const express = require("express")
const cors = require("cors")
const connection = require('./db');
const req = require("express/lib/request");
const app = express();
const categoryRoutes = require("./routes/categoryRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use(cors());
app.use(express.json());


app.use('/api/categories', categoryRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/todos', (req, res) => {
    connection.query('SELECT * FROM todos', (err, results) => {
        if (err) {
            res.status(500).send('Erreur du serveur');
        } else {
            res.json(results);
        }
    });
});


app.delete('/todos/:id', (req, res) => {
    const {id} = req.params
    connection.query("DELETE FROM todos WHERE id = ?", [id], (err, results)=>{
        if (err) {
            res.status(500).send('Erreur du serveur');
        } else {
            res.status(200).send('TODO supprimée');
        }
    })
})

app.post('/todos', (req, res) => {
    const {task, actif } = req.body

    connection.query('INSERT INTO todos (task, actif) VALUES (?, ?)', [task, actif || true], (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send('TODO supprimée');
        }
    })
})

module.exports = app;