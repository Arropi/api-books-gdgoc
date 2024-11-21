const tools = require('mysql')

const db = tools.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "gdgoc_book"
})

module.exports = db