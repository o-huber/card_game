'use strict'

require('dotenv').config();
const list = require('./config.json');

module.exports = function getConfig() {
    let config = {};
    for(let key in list) {
        config = Object.assign(config, require(`./${list[key]}`));
    }
    config = Object.assign(config, require(`./${process.env.FIRST_CONF}`));
    return config;
}