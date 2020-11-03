'use strict'

const { writeFile } = require('fs')
const { promisify } = require('util')
const { join } = require('path')
const { v4: uuidv4 } = require('uuid')
const { questions } = require('../models/index');
//wrap writefile con promisify para poder usar async await
const write = promisify(writeFile)

async function createQuestion(req,h) {
    if (!req.state.user){
        return h.redirect('/login')
    }
    let result,filename
    try {
        if(Buffer.isBuffer(req.payload.image)){
            filename = `${uuidv4()}.png`
            await write(join(__dirname,'..','public','uploads', filename),req.payload.image)
        }
        result = await questions.create(req.payload,req.state.user,filename)
        req.log('info',`Pregunta creada con el ID ${result}`)
    } catch (error) {
        req.log('error',`Ocurrio un error: ${error}`)
        return h.view('ask',{
            title: 'Crear pregunta',
            error: 'Problemas creando la pregunta'
        }).takeover()
    }
    return h.redirect(`/question/${result}`)
}

function failValidation(req,h,error) {
    const templates = {
        '/create-question': 'ask'
    }

    return h.view(templates[req.path],{
        title: 'Error de validacion',
        error: 'Por favor complete los campos requeridos'
    }).code(400).takeover()
    //return Boom.badRequest('Fallo la validacion', req.payload)
}

async function answerQuestion(req,h) {
    if (!req.state.user){
        return h.redirect('/login')
    }
    let result
    try {
        result = await questions.answer(req.payload,req.state.user) 
    } catch (error) {
        console.error(error)
    }
    return h.redirect(`/question/${req.payload.id}`)

}

async function setAnswerRight(req,h) {
    if (!req.state.user){
        return h.redirect('/login')
    }
    let result
    try {
        result = await req.server.methods.setAnswerRight(req.params.questionId,req.params.answerId,req.state.user)
        console.log(result)
    } catch (error) {
        console.error(error)
    }
    return h.redirect(`/question/${req.params.questionId}`)
}

module.exports = {
    createQuestion: createQuestion,
    failValidation: failValidation,
    answerQuestion: answerQuestion,
    setAnswerRight: setAnswerRight
}