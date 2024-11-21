const express = require('express')
const app = express()
const port = 3000
const body = require('body-parser')
const db = require('./connection')
const ResponseNotFound = require('./response/responseNotFound')
const ResponseServerError = require('./response/responseServerError')



app.use(body.json())

app.get('/', (req, res) =>{
    res.json({
        message: "Welcome to api books"
    })
})

app.get('/api/books', (req,res)=>{
    db.query(('SELECT * FROM api_books'), (err, fields) =>{
        if (err) {
            return ResponseServerError( err, res )
        }
        res.status(200), res.json({
        "data": fields
       })
    })
})


// METHOD GET
app.get('/api/books/:id', (req,res) =>{
    db.query((`SELECT * FROM api_books WHERE id = ${req.params.id}`),(err, fields)=>{
        if (err) {
            return ResponseServerError( err, res )
        }
        if (fields.length) {
            res.status(200).json({
            "data": fields
            })
        } else {
            return ResponseNotFound(res)
        }
    })
})


// METHOD POST
app.post('/api/books', (req,res) => {
    const { title, author, published_at } = req.body
    if ( !title || !author || !published_at ) {
        return res.status(400).json({
            "error" : "Validation error title, author, and published_at cannot be empty"
        }) 
    }
        
    db.query((`INSERT INTO api_books (title, author, published_at) VALUES ('${title}', '${author}', '${published_at}')`), (err, fields) =>{
        const id = (fields.insertId)
        if (err) {
            ResponseServerError ( err, res )
        }
        db.query(`SELECT * FROM api_books WHERE id = ${ id } `, (err, result) =>{
            if (err) {
                return ResponseServerError ( err, res )
            }
            res.status(201).json({
            "message" : "Book created succesfully",
            "data" : result[0]
            })
        })
    })
})


// METHOD PUT
app.put('/api/books/:id', (req,res) => {
    let { title, author, published_at} = req.body
    title = title ?? null,
    author = author ?? null,
    published_at = published_at ?? null
    
    db.query(`UPDATE api_books SET title = COALESCE(?, title) , author = COALESCE(?, author), published_at = COALESCE(?, published_at) WHERE id = ${req.params.id} `, [title, author, published_at], (err, fields) =>{
        if (err) {
            return ResponseServerError(err, res)
        }
        if (fields.affectedRows === 0 ){    
            return ResponseNotFound (res)
        }else {
            db.query(`SELECT * FROM api_books WHERE id = ${req.params.id}`, (err, result) =>{
                if (err) {
                    return ResponseServerError ( err, res )
                }
                res.status(200).json({
                    "message" : "Book edited succesfully",
                    "data" : result[0]
                })
            })
        }   
    })
})


// METHOD DELETE
app.delete('/api/books/:id', (req,res) =>{
    db.query(`DELETE FROM api_books WHERE api_books.id = ${req.params.id}`, (err, fields)=>{
        if (err) {
            return ResponseServerError( err, res )
        }
        if (fields.affectedRows === 0 ){    
            return ResponseNotFound(res)
        }else {
            res.status(200).json({
            "message" : "Book deleted succesfully",
        })}
    })
})


app.listen(port, () =>{
    console.log(`Example app listening on port ${port}`)
})