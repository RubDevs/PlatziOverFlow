'use strict'
const { users } = require('../models/index')
const Boom = require('@hapi/boom')

async function createUser (req,h) {
    let result
    try {
        result = await users.create(req.payload)
    } catch (error) {
        console.error(error)
        return h.view('register',{
            title: 'Registro',
            error: 'Error creando el usuario'
        })
    }
    return h.view('register',{
        title: 'Registro',
        success: 'Usuario creado exitosamente.'
    })
}

async function validateUser(req,h) {
    let result
    try {
        result = await users.validate(req.payload)
        if (!result){
            return h.view('login',{
                title: 'Login',
                error: 'Usuario y/o contraseña incorrectos'
            })
        }
    } catch (error) {
        console.error(error)
        return h.view('login',{
            title: 'Login',
            error: 'Problemas validando al usuario'
        })
    }
    return h.redirect('/').state('user',{
        name: result.name,
    })
}

function logout(req,h) {
    return h.redirect('/login').unstate('user')
}

function failValidation(req,h,error) {
    return Boom.badRequest('Fallo la validacion', req.payload)
}


module.exports = {
    create: createUser,
    validate: validateUser,
    logout: logout,
    failValidation: failValidation
}