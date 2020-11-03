'use strict'

const Hapi = require('@hapi/hapi')
const handlebars = require('./lib/helpers')
const vision = require('@hapi/vision')
const blankie = require('blankie')
const scooter = require('@hapi/scooter')
const inert = require('inert')
const hapiDevErrors = require('hapi-dev-errors')
const good = require('@hapi/good')
const path = require('path')
const site = require('./controllers/site')
const routes = require('./routes')
const { encode } = require('querystring')
const methods = require('./lib/methods')

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {
        files: {
            relativeTo: path.join(__dirname,'public')
        }
    }
})

async function init(){
    

    try {
        await server.register(inert)
        await server.register(vision)
        await server.register({
            plugin: good,
            options: {
                ops: {
                    interval: 2000,
                },
                reporters: {
                    myConsoleReporters: [
                        {
                            module: require('@hapi/good-console')
                        },
                        'stdout',
                    ],
                },
            },
        });

        await server.register({
            plugin: require('@hapi/crumb'),
            options: {
                cookieOptions: {
                    isSecure: process.env.NODE_ENV === 'prod'
                }
            }
        })

        await server.register({
            plugin: require('./lib/api'),
            options: {
                prefix: 'api'
            }
        })

        await server.register([scooter,{
            plugin: blankie,
            options: {
                defaultSrc: `'self' 'unsafe-inline'`,
                styleSrc: `'self' 'unsafe-inline' https://maxcdn.bootstrapcdn.com/`,
                fontSrc: `'self' 'unsafe-inline' data:`,
                scriptSrc: `'self' 'unsafe-inline https://cdnjs.cloudflare.com/ https://maxcdn.bootstrapcdn.com/ https://code.jquery.com/'`,
                generateNonces: false
            }
        }])

        await server.register({
            plugin: hapiDevErrors,
            options: {
                showErrors: process.env.NODE_ENV !== 'prod'
            }
        })

        server.method('setAnswerRight',methods.setAnswerRight)
        server.method('getLast',methods.getLast,{
            cache: {
                expiresIn: 1000*60,
                generateTimeout: 2000
            }
        })

        server.state('user',{
            ttl: 1000 * 60 * 60 * 24 * 7,
            isSecure: process.env.NODE_ENV === 'prod',
            encoding: 'base64json'
        })

        server.views({
            engines: {
                hbs: handlebars
            },
            relativeTo: __dirname,
            path: 'views',
            layout: true,
            layoutPath: 'views'
        })

        server.ext('onPreResponse', site.fileNotFound)
        server.route(routes)
    
        await server.start()

    } catch (error) {
        console.error(error)
        process.exit(1)   
    }

    server.log('info',`Servidor escuchando en: ${server.info.uri}`)
}

process.on('unhandledRejection',error => {
    server.log('UnhandledRejection',error.message,error)
})

process.on('uncaughtException',error => {
    server.log('UncaughtException', error.message, error)
})

init()