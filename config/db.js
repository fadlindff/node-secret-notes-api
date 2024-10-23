const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'secret_notes',
});

connection.connect();

connection.query('SELECT 1 + 1 AS solution', (err) => {
  if (err) throw err;
});

module.exports = connection;
