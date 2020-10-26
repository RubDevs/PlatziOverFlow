'use strict'
const { users } = require('../models/index')


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

async function validateUser(req,h) {
    let result
    try {
        result = await users.validate(req.payload)
        if (!result){
            return h.response('Usuario y/o contraseña incorrectos').code(401)
        }
    } catch (error) {
        console.error(error)
        return h.response('Problema al validar usuario').code(500)
    }
    return h.redirect('/').state('user',{
        name: result.name,
    })
}

function logout(req,h) {
    return h.redirect('/login').unstate('user')
}


module.exports = {
    create: createUser,
    validate: validateUser,
    logout: logout
}