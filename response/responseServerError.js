const ResponseServerError = ( err, res ) =>{
    res.status(500), res.json({
        "error" : err
    })
}

module.exports = ResponseServerError