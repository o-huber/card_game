'use strict'

const Model = require('./model');
const token = require('./../token');
const Cards = require('./card');




class Game extends Model {
    constructor() {  
        super('games');
    }
    async new(user_id) {
        let result = await this.save({
            user1_id: user_id,
            status: 'new',
            deck: '',
            hand1: '',
            hand2: '',
            current_turn: 0,
            token: this._getToken()
        });
        // console.log(result);

        return result.insertId;
    }
    async join(userId, gameId) {
        let init = await this._init();
        let result = await this.save({
            id: gameId,
            user2_id: userId,
            deck: JSON.stringify(init.deck),
            hand1: JSON.stringify(init.hand1),
            hand2: JSON.stringify(init.hand2),
            status: 'active'
        });

        //currentGame = await game.getOne({id: id, token: token});


        console.log(result);

        return result.insertId;
    }

    async _init() {
        let cards = this._shuffleDeck(await (new Cards()).getList());
        //console.log(cards);
        return {
            deck: cards.slice(0, -6),
            hand1: cards.slice(-3),
            hand2: cards.slice(-6, -3)
        };
    }
    _shuffleDeck(cards) {
        let j, temp;
        for (let i = cards.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            temp = cards[j];
            cards[j] = cards[i];
            cards[i] = temp;
        }
        return cards;
    }

    _getToken(){

        return token(10);
    }
}

module.exports = Game;