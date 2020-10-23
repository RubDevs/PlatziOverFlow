'use strict'
const { users } = require('../models/index')

function register (req,h) {
    return h.view('register',{
        title:"Registro"
    })
}

async function createUser (req,h) {
    let result
    try {
        result = await users.create(req.payload)
    } catch (error) {
        console.error(error)
        return h.response('Problema al crear el usuario').code(500)
    }

    return h.response(`Usuario creado, ID: ${result}`)
}


module.exports = {
    register: register,
    create: createUser
}