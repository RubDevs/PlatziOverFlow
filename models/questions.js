'use strict'

class Questions {
    constructor (db){
        this.db = db
        this.ref = this.db.ref('/')
        this.collection = this.ref.child('questions')
    }

    async create (data,user){
        const question ={
            ...data
        }
        question.owner = user.name
        console.log(question)
        const newQuestion = this.collection.push(question)
        newQuestion.set(question)

        return newQuestion.key
    }

}

module.exports = Questions