'use strict'

const config = require('./../config/config')();
const bcrypt = require("bcrypt");
const token = require('./../token');

class SiteController {

    constructor() {
    }

    _getProperties(param = {}) {
        // let result = param;
        let result = {
            title: config.title + ' - ' + (param.title ? param.title : ''),
            menu: param.menu,
            message: param.message
        }
        if(param.user) {
            result.user = param.user;
            if(param.user.status === 'admin') {
                result.user.admin = true;
            }
        }
        return Object.assign(param.add ? param.add : {}, result) ;
    }

    _getToken(data){

        return token();
    }
}

module.exports = SiteController;