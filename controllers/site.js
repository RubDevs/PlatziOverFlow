'use strict'

function home (req,h) {
    return h.view('index',{
        title:"Home"
    })
}

module.exports = {
    home: home
}