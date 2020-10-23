'use strict'

class Users{
    constructor(db){
        this.db = db
        this.ref = this.db.ref('/')
        this.collection = this.ref.child('users')
    }

    async create(data){
        const newUser = this.collection.push()
        newUser.set(data)

        return newUser.key
    }
}

module.exports = Users