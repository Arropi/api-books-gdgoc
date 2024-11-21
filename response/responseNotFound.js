const ResponseNotFound = ( res ) =>{
    res.status(404), res.json({
        "message" : "Books not found"
    })
}

module.exports = ResponseNotFound