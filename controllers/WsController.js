"use strict"

const SiteController = require('./SiteController');
const config = require('./../config/config')();
const User = require('./../models/user');
const Game = require('./../models/game');
const Turn = require('./../models/turn');
const Result = require('./../models/results');
const Rating = require('./../models/rating');

class WsController extends SiteController {
    //title = config.title;

    constructor(socket) {
        super();
        this.socket = socket;
    }
    async newGame(message) {
        // console.log(message);
        let [user_id, token] = message.split(':');
        // console.log(user_id, token);
        let game = new Game();
        let id = await game.new(user_id);
        console.log('GameStart - id: ' + id);
        return {status: 1, game: (await game.getList({id: id}))[0]};
    }
    async joinGame(message) {
        let [user_id, token, gameToken] = message.split(':');
        let [game_id, game_token] = gameToken.split('-');
        let game = new Game();

        // Проверяем существование игры
        let currentGame = await game.getOne({id: game_id, token: game_token});
        // let currentGame = await game.getOne({id: game_id});
        console.log(currentGame);
        if(!currentGame) {
            return {status: 0};
        }
        // Подключаемся к игре

        let result = await game.join(user_id, currentGame.id);
        // Присоединиться к ней и отправить сокеты старта игры

        return {status: 1, game: (await game.getOne({id: game_id}))};
    }

    async sendState(id, token, mygame) {
        let game = new Game();
        // Проверяем существование игры
        let currentGame = await game.getOne({id: mygame.id, token: mygame.token, status: 'active'});
        if(currentGame) {

            return {status: 1, room: currentGame.id + ':' + currentGame.token, game: currentGame, user1: await this._getUserState(currentGame, currentGame.user1_id), user2: await this._getUserState(currentGame, currentGame.user2_id)};
        } else {
            return {status: 0};
        }

    }
    async turn(mygame) {
        // Удаляем из массыва руки карту которой походили
        mygame.hand = mygame.hand.filter(item => item.id !== mygame.turn.id);
        console.log(mygame);
        let game = new Game();
        // Проверяем существование игры
        let currentGame = await game.getOne({id: mygame.id, token: mygame.token, status: 'active'});
        if(currentGame && mygame.turn?.id) {
            let turn = new Turn();
            // read previous turn
            let lastTurn = await turn.getLast({game_id: mygame.id});

            console.log(lastTurn);
            let currentTurn = {
                game_id: mygame.id,
                user_id: mygame.iam.id,
                card_id: mygame.turn.id,
                type: lastTurn ? ((lastTurn.number % 2) ? 'defence' : 'attack') : 'attack',
                number: lastTurn ? lastTurn.number + 1 : 1
            };
            currentTurn.state = JSON.stringify(await this._getState(currentTurn, lastTurn, mygame, currentGame));

            console.log('-----> State: ----->');
            console.log(JSON.parse(currentTurn.state));

            // записываем в БД
            let result = await turn.save(currentTurn);
            //currentTurn.turn = currentTurn.number;

            // return {
            //     status: 1,
            //     room: currentGame.id + ':' + currentGame.token,
            //     game: Object.assign(currentTurn, {turn: currentTurn.number}),
            //     user1: await this._getUserState(currentTurn, currentGame.user1_id),
            //     user2: await this._getUserState(currentTurn, currentGame.user2_id)};
            return {
                status: 1,
                room: currentGame.id + ':' + currentGame.token,
                game: JSON.parse(currentTurn.state),
                user1: JSON.parse(currentTurn.state).userInfo.user1,
                user2: JSON.parse(currentTurn.state).userInfo.user2};
        } else {
            return {status: 0};
        }
    }

    async _getState(turn, prevTurn, mygame, game) {
        let prevState = false;
        let dbUser1 = false;
        let dbUser2 = false;
        let battle = {};
        let currentState = {
            id: game.id,
            user1_id: game.user1_id,
            user2_id: game.user2_id,
            status: game.status,
            deck: {},
            current_turn: turn.number,
            token: game.token,
            cards: {},
            battle: {},
            userInfo: {},
            users: {},
            hands: {},
            result: {}
        };

        // Формируем расклад deck, при первом ходе получаем информацию об игроках
        // currentState.deck, currentState.hands, currentState.users, currentState.battle
        {
            if(prevTurn) {
                prevState = JSON.parse(prevTurn.state);
                currentState.deck = prevState.deck;
                currentState.hands = prevState.hands;
                currentState.users = prevState.users;
                currentState.battle = prevState.battle;

            } else {
                currentState.deck = JSON.parse(game.deck);
                currentState.hands.user1 = JSON.parse(game.hand1);
                currentState.hands.user2 = JSON.parse(game.hand2);
                dbUser1 = await (new User()).getOne({id: game.user1_id});
                dbUser2 = await (new User()).getOne({id: game.user2_id});
                currentState.users.user1 = {
                    id: dbUser1.id,
                    photo: dbUser1.photo,
                    login: dbUser1.login,
                    life: 100
                };
                currentState.users.user2 = {
                    id: dbUser2.id,
                    photo: dbUser2.photo,
                    login: dbUser2.login,
                    life: 100
                };
            }
        }

        let iam = mygame.iam;

        // Формирование battle
        // currentState.battle
        {
            if(turn.type === 'attack') {
                currentState.battle = {};
            }
            currentState.battle[turn.type] = {
                userId: turn.user_id,
                card: mygame.turn
            };
        }

        // Формирование карт на руках
        // currentState.hands
        {
            if(currentState.user1_id == iam.id) {
                currentState.hands.user1 = currentState.hands.user1.filter(item => item.id !== mygame.turn.id);
            } else {
                currentState.hands.user2 = currentState.hands.user2.filter(item => item.id !== mygame.turn.id);
            }
            //currentState.hands = hands;
        }

        // Формирование результата хода
        // currentState.result
        {

            // Убираем из расклада две карты
            // и
            // Добавляем в руки по одной карте каждому игроку
            if(turn.type === 'defence') {
                currentState.hands.user1.push((currentState.deck.slice(-1))[0]);
                currentState.hands.user2.push((currentState.deck.slice(-2, -1))[0]);
                currentState.deck = currentState.deck.slice(0, currentState.deck.length - 2);
                currentState.battle.result = await this._getBattleResult(currentState.battle);

                console.log('---------> battle');
                console.log(currentState.battle);
            } else {
                if(turn.number > 1) {
                    prevState.userInfo.user1.battle = {};
                    prevState.userInfo.user2.battle = {};
                }
            }

            // Изменяем уровень жизни пользователей по результатам битвы (в стейте)
            // Записываем полученные данные в стейт

        }

        // Формирование users
        // currentState.users
        {
            // Формирование стейта пользователей
            let user1 = {battle: prevState ? prevState.userInfo.user1.battle : {}};
            let user2 = {battle: prevState ? prevState.userInfo.user2.battle : {}};

            if(game.user1_id == iam.id) {
                user1.battle.iam = mygame.turn;
                user2.battle.enemy = mygame.turn;
                if(currentState.battle.result && currentState.battle.defence.userId == iam.id) {
                    currentState.users.user1.life += currentState.battle.result.lose;
                    user1.battle.lose = {
                        iam: currentState.battle.result.lose,
                        enemy: 0
                    };
                    user2.battle.lose = {
                        iam: 0,
                        enemy: currentState.battle.result.lose
                    };
                }
                battle.user1 = mygame.turn;
                if(turn.number % 2) {
                    user1.myTurn = 0;
                    user2.myTurn = 1;
                } else {
                    user1.myTurn = 1;
                    user2.myTurn = 0;
                }
            } else {
                user2.battle.iam = mygame.turn;
                user1.battle.enemy = mygame.turn;
                if(currentState.battle.result && currentState.battle.defence.userId == iam.id) {
                    currentState.users.user2.life += currentState.battle.result.lose;
                    user1.battle.lose = {
                        iam: 0,
                        enemy: currentState.battle.result.lose
                    };
                    user2.battle.lose = {
                        iam: currentState.battle.result.lose,
                        enemy: 0
                    };
                }
                battle.user2 = mygame.turn;
                if(turn.number % 2) {
                    user1.myTurn = 1;
                    user2.myTurn = 0;
                } else {
                    user1.myTurn = 0;
                    user2.myTurn = 1;
                }
            };
            currentState.users.user1 = Object.assign(currentState.users.user1, user1);
            currentState.users.user2 = Object.assign(currentState.users.user2, user2);
        }

        // Формирование userInfo
        // currentState.userInfo
        {

            let userInfo = {};


            // Формирование информации для игроков
            if (prevState) {
                userInfo = prevState.userInfo;
            } else {
                userInfo = {
                    user1: {
                        iam: {
                            id: game.user1_id,
                            life: 100,
                            login: dbUser1.login,
                            avatar: dbUser1.photo
                        },
                        enemy: {
                            id: game.user2_id,
                            life: 100,
                            login: dbUser2.login,
                            avatar: dbUser2.photo
                        }
                    },
                    user2: {
                        iam: {
                            id: game.user2_id,
                            life: 100,
                            login: dbUser2.login,
                            avatar: dbUser2.photo
                        },
                        enemy: {
                            id: game.user1_id,
                            life: 100,
                            login: dbUser1.login,
                            avatar: dbUser1.photo
                        }
                    }
                };
            }
            userInfo.user1.hand = currentState.hands.user1;
            userInfo.user2.hand = currentState.hands.user2;
            userInfo.user1.id = game.id;
            userInfo.user2.id = game.id;
            userInfo.user1.token = game.token;
            userInfo.user2.token = game.token;
            userInfo.user1.turn = currentState.current_turn;
            userInfo.user2.turn = currentState.current_turn;
            userInfo.user1.cards = currentState.deck.length;
            userInfo.user2.cards = userInfo.user1.cards;
            userInfo.user1.battle = currentState.users.user1.battle;
            userInfo.user2.battle = currentState.users.user2.battle;
            userInfo.user1.myTurn = currentState.users.user1.myTurn;
            userInfo.user2.myTurn = currentState.users.user2.myTurn;
            userInfo.user1.iam.life = currentState.users.user1.life;
            userInfo.user1.enemy.life = currentState.users.user2.life;
            userInfo.user2.iam.life = currentState.users.user2.life;
            userInfo.user2.enemy.life = currentState.users.user1.life;

            currentState.userInfo = userInfo;
        }

        // Проверяем GameOver
        {
            if(currentState.users.user1.life <=0 || currentState.users.user2.life <=0) {

                currentState.result = {
                    status: 'gameOver',
                    winner: (currentState.users.user1.life > currentState.users.user2.life)
                        ? currentState.users.user1.id
                        : currentState.users.user2.id
                };
                currentState.userInfo.user1.result = {
                    status: 'gameOver',
                    winner: (currentState.result.winner == currentState.users.user1.id) ? 'iam' : 'enemy'
                };
                currentState.userInfo.user2.result = {
                    status: 'gameOver',
                    winner: (currentState.result.winner == currentState.users.user2.id) ? 'iam' : 'enemy'
                };
                await this._gameOver(currentState);
            }
        }

        // currentState = {
        //     id: game.id,
        //     user1_id: game.user1_id,
        //     user2_id: game.user2_id,
        //     status: game.status,
        //     deck: 'game.deck',
        //     current_turn: turn.number,
        //     token: game.token,
        //     cards: '',
        //     battle: battle,
        //     userInfo: userInfo,
        //     users: users,
        //     hands: hands,
        //     result: result
        // };
        console.log('-----> currentState.userInfo');
        console.log(currentState.userInfo);
        return currentState;
    }
    async _gameOver(state) {

        // Сохраняем данные в турнирную таблицу
        let result = new Result();
        await result.save({
            game_id: state.id,
            user1_id: state.users.user1.id,
            user2_id: state.users.user2.id,
            score1: state.users.user1.life,
            score2: state.users.user2.life,
            winner_id: state.result.winner,
            winner_score: 0,
        });

        // Сохраняем статистику в рейтинг
        let rating = new Rating();
        await rating.save({
            game_id: state.id,
            user_id: state.users.user1.id,
            score: state.users.user1.life
        });
        await rating.save({
            game_id: state.id,
            user_id: state.users.user2.id,
            score: state.users.user2.life
        });

        // Делаем статус игры finish
        let game = new Game();
        await game.save({
            id: state.id,
            status: 'finish'
        });
    }

    async _getBattleResult(battle) {
        let result = battle.defence.card.defence - battle.attack.card.attack;

        return {lose: (result > 0) ? 0 : result}
    }

    async _getUserState(game, user) {
        let iam, enemy;
        if(game.turn) {
            let turn = new Turn();
            // read previous turn
            let lastTurn = await turn.getLast({game_id: game.id});
            return lastTurn.state;

        } else {

            let user1 = await (new User()).getOne({id: game.user1_id});
            let user2 = await (new User()).getOne({id: game.user2_id});

            if(user1.id === user) {
                iam = {
                    coin: 1,
                    id: user1.id,
                    life: 100,
                    login: user1.login,
                    avatar: user1.photo
                };
                enemy = {
                    id: user2.id,
                    life: 100,
                    login: user2.login,
                    avatar: user2.photo
                };
            }
            if(user2.id === user) {
                iam = {
                    id: user2.id,
                    life: 100,
                    login: user2.login,
                    avatar: user2.photo
                };
                enemy = {
                    id: user1.id,
                    life: 100,
                    login: user1.login,
                    avatar: user1.photo
                };
            }

            return {
                id: game.id,
                token: game.token,
                turn: game.current_turn,
                iam: iam,
                enemy: enemy,
                hand: (user === 1) ? game.hand1 : game.hand2,
                cards: JSON.parse(game.deck).length
            }
        }


    }


}

module.exports = WsController;