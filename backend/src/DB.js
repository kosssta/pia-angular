const mysql = require('mysql')

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'rasadnici',
    timezone: '+00:00'
})

pool.once('connection', () => console.log('Connected to DB!'))

module.exports = pool
