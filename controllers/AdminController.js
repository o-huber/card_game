"use strict"

const SiteController = require('./SiteController');
const config = require('./../config/config')();
const User = require('./../models/user');
const Cards = require('./../models/card');
const nodemailer = require('nodemailer');

class UserController extends SiteController {

    constructor() {
        super();
    }

    async index(request, response) {
        if(request.url !== '/') {
            response.render('404', this._getProperties({title: '404 Page not found!'}));
        } else {
            if (request.session.user) {
                response.render('admin', this._getProperties({add: {class_body: "admin"}}));
            } else {
                response.redirect('/login');
            }
        }

    }
    async cardinit(request, response) {
            let cards = new Cards();
            await cards.initList();
            response.render('admin', this._getProperties({add: {class_body: "admin"}, message: "Карты добавлены в БД"}));

        }


}

module.exports = UserController;