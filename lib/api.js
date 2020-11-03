'use strict'

const Joi = require('joi')
const { questions } = require('../models/index')
const Boom = require('@hapi/boom')

module.exports = {
    name: 'api-rest',
    version: '1.0.0',
    async register (server, options){
        const prefix = options.prefix || 'api'
        server.route({
            method: 'GET',
            path: `/${prefix}/question/{key}`,
            options: {
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
    }
}