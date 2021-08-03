'use strict'

const Model = require('./model');
const cardList = require('./cardList');


class Card extends Model {
    constructor() {  
        super('cards');
    }

    async initList() {
        let list = await this.getList();
        if(!list.length) {
            cardList.map(item => {
                 this.save({
                    name: item.name,
                    image: item.ico,
                    cost: item.cost,
                    attack: item.attack,
                    defence: item.defence
                });
            });
        }
    }


}

module.exports = Card;