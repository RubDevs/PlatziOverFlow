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
    path: '/{param*}',
    handler: {
        directory: {
            path: '.',
            index: ['index.html']
        }
    }
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
    method: 'POST',
    options: {
        validate: {
            payload:Joi.object( {
                name: Joi.string().required().min(3),
                email: Joi.string().email().required(),
                password: Joi.string().required().min(6)
            })
        }
    },
    path: '/create-user',
    handler: user.create
}]