const mysql = require('mysql');

// mySQL connection for GAE

let config = {
    host: process.env.MYSQL_DB_HOST,
    user: process.env.MYSQL_DB_USER,
    password: process.env.MYSQL_DB_PASSWORD,
    database: process.env.MYSQL_DB_NAME
}

let connection = mysql.createConnection(config);

module.exports = connection;