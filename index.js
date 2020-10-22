'use strict'

const Hapi = require('@hapi/hapi')

const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost'
})

async function init(){
    server.route({
        method: 'GET',
        path: '/',
        handler: (req,h) => {
            return 'Hola mundo!'
        }
    })

    try {
        await server.start()
    } catch (error) {
        console.error(error)
        procces.exit(1)   
    }

    console.log(`Servidor escuchando en: ${server.info.uri}`)
}

init()