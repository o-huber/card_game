"use strict"

const SiteController = require('./SiteController');
const config = require('./../config/config')();
const User = require('./../models/user');
const Cards = require('./../models/card');
const Game = require('./../models/game');


class GameController extends SiteController {

    constructor() {
        super();
    }

    async joingame(request, response) {
        console.log(request.query);
        let [id, token] = request.query.token.split(':');
        console.log("id, token");
        console.log(id, token);
        // let game = new Game();
        // let currentGame = await game.getOne({id: id, token: token});
        // currentGame.user2_id = request.session.user.id;
        // let init = await this._init();
        // let result = await game.save({
        //     id: currentGame.id,
        //     user2_id: request.session.user.id,
        //     deck: JSON.stringify(init.deck),
        //     hand1: JSON.stringify(init.hand1),
        //     hand2: JSON.stringify(init.hand2),
        //     status: 'active'
        // });
        // currentGame = await game.getOne({id: id, token: token});
        //
        //response.redirect('/');
        //response.render('joinGame', this._getProperties({user: request.session.user, add: {game: {id: id, token: token}}}));
        response.render(config.tmpl.game, this._getProperties({user: request.session.user, add: {join: 1, game: {id: id, token: token}}}));
    }


    // async _init() {
    //     let cards = this._shuffleDeck(await (new Cards()).getList());
    //     console.log(cards);
    //     return {
    //         deck: cards.slice(0, -6),
    //         hand1: cards.slice(-3),
    //         hand2: cards.slice(-6, -3)
    //     };
    // }
    // _shuffleDeck(cards) {
    //     let j, temp;
    //     for (let i = cards.length - 1; i > 0; i--) {
    //         j = Math.floor(Math.random() * (i + 1));
    //         temp = cards[j];
    //         cards[j] = cards[i];
    //         cards[i] = temp;
    //     }
    //     return cards;
    // }
    _getCard(count = 1) {

        return
    }
}

module.exports = GameController;