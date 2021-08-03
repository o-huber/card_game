CREATE DATABASE IF NOT EXISTS endgame;
USE endgame;
CREATE USER 'endgame'@'localhost' IDENTIFIED BY 'Dr4_jr*gGh';
GRANT ALL PRIVILEGES ON endgame.* TO 'endgame'@'localhost';
FLUSH PRIVILEGES;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    photo VARCHAR(50) NOT NULL,
    login VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    status ENUM ('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user1_id INT NOT NULL,
    user2_id INT NULL,
    status ENUM('new', 'active', 'finish', 'canceled') NOT NULL DEFAULT 'new',
    deck TEXT,
    current_turn INT,
    token VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT games_users_fk1
    FOREIGN KEY (user1_id)  REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT games_users_fk2
    FOREIGN KEY (user2_id)  REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cards (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(25) NOT NULL,
    image VARCHAR(50) NOT NULL,
    cost INT NOT NULL,
    attack INT NOT NULL,
    defence INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS turns (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    user_id INT NOT NULL,
    card_id INT NOT NULL,
    type ENUM ('attack', 'defence') DEFAULT 'attack',
    number INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT turns_games_fk
    FOREIGN KEY (game_id)  REFERENCES games (id) ON DELETE CASCADE,
    CONSTRAINT turns_users_fk
    FOREIGN KEY (user_id)  REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT turns_cards_fk
    FOREIGN KEY (card_id)  REFERENCES cards (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS results (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    user1_id INT NOT NULL,
    user2_id INT NOT NULL,
    score1 INT NOT NULL,
    score2 INT NOT NULL,
    winner_id INT NOT NULL,
    winner_score INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT results_games_fk
    FOREIGN KEY (game_id)  REFERENCES games (id) ON DELETE CASCADE,
    CONSTRAINT results_users_fk1
    FOREIGN KEY (user1_id)  REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT results_users_fk2
    FOREIGN KEY (user2_id)  REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT results_winner_fk
    FOREIGN KEY (winner_id)  REFERENCES users (id) ON DELETE CASCADE
);

ALTER TABLE games ADD COLUMN hand1 TEXT AFTER deck;
ALTER TABLE games ADD COLUMN hand2 TEXT AFTER hand1;

ALTER TABLE users ADD COLUMN token VARCHAR(25) AFTER status;

ALTER TABLE games MODIFY status ENUM('new', 'active', 'finish', 'canceled') NOT NULL DEFAULT 'new';

ALTER TABLE turns ADD COLUMN state TEXT AFTER number;

CREATE TABLE IF NOT EXISTS rating (
       id INT AUTO_INCREMENT PRIMARY KEY,
       game_id INT NOT NULL,
       user_id INT NOT NULL,
       score INT NOT NULL,
       created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
       CONSTRAINT rating_games_fk
           FOREIGN KEY (game_id)  REFERENCES games (id) ON DELETE CASCADE,
       CONSTRAINT rating_users_fk
           FOREIGN KEY (user_id)  REFERENCES users (id) ON DELETE CASCADE
);
