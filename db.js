const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'ujarma-app',
});

db.connect((err) => {
    if (err) {
        console.error('error connecting to mysql:', err);
        return;
    }
    console.log('connected to mysql database');
});

module.exports = db;
