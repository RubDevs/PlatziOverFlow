'user strict'

const handlebars = require('handlebars')

function registerHelpers() {
    handlebars.registerHelper('answerNUmber',(answers)=>{
        if (!answers){
            return 0
        }
        const keys = Object.keys(answers)
        return keys.length
    })

    handlebars.registerHelper('ifEquals',(user, questionUser,options) =>{
        if(user === questionUser){
            return options.fn(this)
        }
        return options.inverse(this)
    })
    return handlebars
}

module.exports = registerHelpers()