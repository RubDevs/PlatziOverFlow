'use strict'

function register (req,h) {
    return h.view('register',{
        title:"Registro"
    })
}

function createUser (req,h) {
    console.log(req.payload)
    return 'Usuario creado'
}


module.exports = {
    register: register,
    create: createUser
}