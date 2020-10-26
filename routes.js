const site = require('./controllers/site')
const user = require('./controllers/user')
const Joi = require('joi')

module.exports = [{
    method: 'GET',
    path: '/',
    handler: site.home
},

{
    method: 'GET',
    path: '/register',
    handler: site.register
},
{
    method: 'GET',
    path: '/login',
    handler: site.login
},
{
    method: 'GET',
    path: '/logout',
    handler: user.logout
},
{
    method: 'POST',
    path: '/validate-user',
    options: {
        validate: {
            payload: Joi.object( {
                email: Joi.string().email().required(),
                password: Joi.string().required().min(6)
            }),
            failAction: user.failValidation
        },
        
    },
    handler: user.validate
},

{
    method: 'POST',
    path: '/create-user',
    options: {
        validate: {
            payload:Joi.object( {
                name: Joi.string().required().min(3),
                email: Joi.string().email().required(),
                password: Joi.string().required().min(6)
            }),
            failAction: user.failValidation
        },
        
    },
    handler: user.create
},
{
    method: 'GET',
    path: '/assets/{param*}',
    handler: {
        directory: {
            path: '.',
            index: ['index.html']
        }
    }
},
{
    method: ['GET', 'POST'],
    path: '/{any*}',
    handler: site.notFound
}]