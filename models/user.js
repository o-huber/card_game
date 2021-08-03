'use strict'

const Model = require('./model');



class User extends Model {
    constructor() {  
        super('users');
    }

}

module.exports = User;