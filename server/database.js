const mysql = require('mysql');

function connectDB() {
    const connection = mysql.createConnection({
        host: "sql6.freesqldatabase.com",
        user: "sql6688103",
        password: "TwPZtvswqW",
        database: "sql6688103"
        /* For local DB */
        //host: "localhost",
        //user: "root",
        //password: "ashwin@mysql123",
        //database: "todolist"
    });
    return connection;
}

function executeQuery(connection, query) {
    return new Promise((resolve, reject) => {
        connection.query(query, (err, data, result) => {
            if (err) {
                reject(err);
            } else {
                resolve({data, result});
            }
        });
    });
}

module.exports = {
    connectDB: connectDB,
    executeQuery: executeQuery
};