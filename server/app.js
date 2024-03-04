const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const dbUtils = require('./database');

const PORT = process.env.PORT || 5000;
app.use(express.static(path.join(__dirname, '../client/build')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const dbConnection = dbUtils.connectDB();

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.post('/getTodos', (req, res) => {
    const {id} = req.body;
    dbUtils.executeQuery(dbConnection, `SELECT * from todolist WHERE userid = ${id}`)
        .then((response) => {
            const json = JSON.stringify(response.data);
            res.setHeader('Content-Type', 'application/json');
            res.send(json);
        })
        .catch((err) => {
            console.error("Error getting todos:", err);
            res.status(500).send("Unable to fetch todos");
        });
});

app.post('/addTodo', (req, res) => {
    const {name, checked, id} = req.body;
    dbUtils.executeQuery(dbConnection, `INSERT INTO todolist (name, checked, userid) VALUES ('${name}', ${checked}, ${id})`)
        .then(() => {
            res.setHeader('Content-Type', 'application/json');
            res.send('Ok');
        })
        .catch((err) => {
            console.error("Error adding todo:", err);
            res.status(500).send("Unable to add todo");
        });
});

app.post('/deleteTodo', (req, res) => {
    const {name} = req.body;
    dbUtils.executeQuery(dbConnection, `DELETE FROM todolist WHERE name = '${name}'`)
        .then(() => {
            res.setHeader('Content-Type', 'application/json');
            res.send('Ok');
        })
        .catch((err) => {
            console.error("Error deleting todo:", err);
            res.status(500).send("Unable to delete todo");
        });
});

app.post('/selectTodo', (req, res) => {
    const {name, isSelected} = req.body;
    dbUtils.executeQuery(dbConnection, `UPDATE todolist SET checked = ${isSelected} WHERE name = '${name}'`)
        .then(() => {
            res.setHeader('Content-Type', 'application/json');
            res.send('Ok');
        })
        .catch((err) => {
            console.error("Error selecting todo:", err);
            res.status(500).send("Unable to select todo");
        });
});

app.post('/editTodo', (req, res) => {
    const {name, updatedName} = req.body;
    dbUtils.executeQuery(dbConnection, `SELECT * FROM todolist WHERE name = '${name}'`)
        .then((response) => {
            const id = response.data[0].id;
            return dbUtils.executeQuery(dbConnection, `UPDATE todolist SET name = '${updatedName}' WHERE id = ${id}`)
        }).then(() => {
            res.setHeader('Content-Type', 'application/json');
            res.send('Ok');
        }).catch((err) => {
            console.error("Error editing todo:", err);
            res.status(500).send("Unable to edit todo");
        });
});

app.post('/validate', (req, res) => {
    const {usernameFromRequest, passwordFromRequest} = req.body;
    const invalidJson = JSON.stringify({data: 'Invalid'});
    dbUtils.executeQuery(dbConnection, `SELECT * FROM users WHERE username = '${usernameFromRequest}'`)
        .then((response) => {
            const userDetails = response.data;
            if (userDetails.length) {
                const {id, username, password} = userDetails[0];
                if (password === passwordFromRequest) {
                    const json = JSON.stringify({data: 'Ok', userDetails: {id, username}});
                    res.setHeader('Content-Type', 'application/json');
                    res.send(json);
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.send(invalidJson);
                }
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send(invalidJson);
            }
        }).catch((err) => {
            console.error("Error fetching user:", err);
            res.status(500).send("Unable to fetch user");
        });
});

app.post('/addUser', (req, res) => {
    const {usernameFromRequest, passwordFromRequest} = req.body;
    const invalidJson = JSON.stringify({data: 'Invalid'});
    dbUtils.executeQuery(dbConnection, `SELECT username FROM users`)
        .then((response) => {
            if (response.data.length && response.data.some((x) => x.username === usernameFromRequest)) {
                res.setHeader('Content-Type', 'application/json');
                res.send(invalidJson);
            } else {
                return dbUtils.executeQuery(dbConnection, `INSERT INTO users (username, password) VALUES ('${usernameFromRequest}', '${passwordFromRequest}')`)
                    .then((response) => {
                        const id = response.data.insertId;
                        res.setHeader('Content-Type', 'application/json');
                        res.send({data: 'Ok', userDetails: {id, username: usernameFromRequest}});
                    });
            }     
        }).catch((err) => {
            console.error("Error adding user:", err);
            res.status(500).send("Unable to add user");
        });
});

app.listen(PORT, () => {
    console.log(`server is listening at ${PORT}`);
});