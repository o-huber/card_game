"use strict"

const SiteController = require('./SiteController');
const Game = require('./../models/game');

class ApiController extends SiteController {
    // All endpoints for API
    constructor() {
        super();
    }

    async gameStart(request, response) {
        // проверим, есть ли у пользователя уже стартованная игра - если есть перекидываем на нее
        // если нет - создаем игру
        let game = new Game();
        let id = await game.new(request.session.user.id);
        //game.getList({user1_id: })
        console.log('GameStart - id: ' + id);
        response.send({status: "true", message: "Start game id #" + id});
    }
}

module.exports = ApiController;