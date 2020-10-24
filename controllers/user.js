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
    } catch (error) {
        console.error(error)
        return h.response('Problema al validar usuario').code(500)
    }
    return h.response(result)
}


module.exports = {
    create: createUser,
    validate: validateUser
}