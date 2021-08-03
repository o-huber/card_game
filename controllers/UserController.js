"use strict"

const SiteController = require('./SiteController');
const config = require('./../config/config')();
const User = require('./../models/user');
const nodemailer = require('nodemailer');

class UserController extends SiteController {

    constructor() {
        super();
    }

    async register (req, res) {

        // Валидация
        let valid = await this._validate(req.body);
        //Создание
        if (valid.status) {
            //создание пользователя
            let user = new User();
            let result = user.save({
                photo: req.body.photo,
                login: req.body.login,
                password: req.body.password,
                email: req.body.email
            });
            if (result) {
                if (req.body.password === req.body.confirmPass) {
                    res.render('registerDone')
                }
            }
        } else {
            // let avatar = user.getAvatar({login: req.body.login})
            // console.log(avatar)
            res.render('registration', { text: valid.error });
            // ошибкa
        }

    }

    async login (req, res) {
        let sess = req.session;
        let user = new User();

        if (sess.user) {
            res.redirect('/');
        } else {
            let result = await user.getList({ login: req.body.login });
            if (result.length > 0 && req.body.password === result[0].password) {
                // user.update({where: {id: result[0].id}, values: {token: this._getToken(result[0].login)}})
                let token = this._getToken();
                let rows = await user.save({id: result[0].id, token: token});
                sess.user = result[0];
                sess.cookie.user = {id: result[0].id, token: token};
                sess.user.token = token;
                res.cookie('token', result[0].id + '-' + token);
                if(req.query.url) {
                    res.redirect(req.query.url);
                } else {
                    res.redirect('/');
                }

            } else {
                res.render('login', { text: 'Wrong password - <a href="/reminder">Password Reminder</a>' });
            }
        }
    }

    async logout (req, res) {
        req.session.destroy(err => {
            if (err) {
                return console.log(err);
            }
            res.redirect('/');
        });
    }

    async home (req, res) {
        if (req.session.user) {
            res.render('startGame');
        } else {
            res.redirect('/login');
        }
    }

    async reminder (req, res) {
        let user = new User();
        let result = await user.getList({
            email: req.body.email
        });
        let message = "";
        if (result.length > 0) {
            await this._sendEmail(result[0].email, result[0].password);
            message = "Ваш пароль отправлен на Ваш email";
        } else {
            message = "Пользователя с таким email не существует!";
        }
        res.render('reminder', { text: message })

    }

    async _validate(data) {
        let user = new User();
        let status = true;
        let error = '';
        let result = await user.getList({ login: data.login });
        if (result.length > 0) {
            status = false;
            error += "Login already used, please change! ";

        };
        let result1 = await user.getList({ email: data.email });
        if (result1.length > 0) {
            status = false;
            error += "Email already used, please change! ";
        };

        return { status: !(result.length + result1.length), error: error };
    }

    async _sendEmail (email, pass) {
        let testAccount = await nodemailer.createTestAccount();

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass
            }
        })
        let info = await transporter.sendMail({
            from: '"ohubernator" <ohubernator@student.ucode.world',
            to: email,
            subject: "Important! Password reminder.",
            text: "Your password is: <b>" + pass + "<b>",
            html: "Your password is: <b>" + pass + "<b>"
        })
        console.log('Message sent: %s', info.messageId);

        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }
}

module.exports = UserController;