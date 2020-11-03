'use strict'

const Joi = require('joi')
const { questions } = require('../models/index')
const Boom = require('@hapi/boom')
const {users} = require('../models/index')

module.exports = {
    name: 'api-rest',
    version: '1.0.0',
    async register (server, options){
        const prefix = options.prefix || 'api'
        await server.register(require('@hapi/basic'))

        server.auth.strategy('simple','basic',{ validate })
        server.auth.default('simple')

        server.route({
            method: 'GET',
            path: `/${prefix}/question/{key}`,
            options: {
                auth: 'simple',
                validate: {
                    params: Joi.object({
                        key: Joi.string().required()
                    }),
                    failAction: failValidation
                },
            },
            handler: async (req, h)=> {
                let result
                try {
                    result = await questions.getOne(req.params.key)
                    if (!result){
                        return Boom.notFound('Pregunta no econtrada')
                    }
                } catch (error) {
                    return Boom.badImplementation(`Error buscando ${req.params.key} error: ${error}`)
                }
                return result
            }
            
        })

        server.route({
            method: 'GET',
            path: `/${prefix}/questions/{amount}`,
            options: {
                auth: 'simple',
                validate: {
                    params: Joi.object({
                        amount: Joi.number().integer().min(1).max(20).required()
                    }),
                    failAction: failValidation
                },
                
            },
            handler: async (req, h)=> {
                let result
                try {
                    result = await questions.getLast(req.params.amount)
                    if (!result){
                        return Boom.notFound('Preguntas no econtrada')
                    }
                } catch (error) {
                    return Boom.badImplementation(`Error buscando recuperando las preguntas, error: ${error}`)
                }
                return result
            }
            
        })

        function failValidation(req,h,error) {
            return Boom.badRequest('Por favor ingrese los parametros requeridos')
        }

        async function validate(req,username,password,h) {
            let user 
            try {
                user = await users.validate({
                    email: username,
                    password: password  
                })
            } catch (error) {
                server.log('error', error)
            }
            return {
                credentials: user || {},
                isValid: (user !== false)
            }
        }
    }
}