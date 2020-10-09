const axios = require('axios');
const mysql = require('mysql');
const bodyParser = require("body-parser");

//unsecure
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'phs-gameDB',
});

function getNumberBetween(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

async function getRandomNickname(){
    return await axios.get('https://randomuser.me/api')
    .then(response => {
        return response.data.results[0].login.username;
    })
    .catch(error => {
        console.log(error);
    });
}

async function getRandomProfileImage(){
    return await axios.get('https://randomuser.me/api')
    .then(response => {
        return response.data.results[0].picture.thumbnail;
    })
    .catch(error => {
        console.log(error);
    });
}

async function insertInScores(value, timestamp) {
    const sqlInsertScore = 'INSERT INTO Scores(value, timestamp) VALUES ( ?, ?);';
    return new Promise(function (resolve, reject) {
        db.query(sqlInsertScore,[value, timestamp], function (error, results, fields) {
        if (error) { return console.log(error); }
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        resolve(results.insertId);
    });}
    )
}

async function insertInPlayers(nickname, profileImage) {
    const sqlInsert = 'INSERT INTO Players(nickname, profile_image) VALUES ( ? , ?);';
    return new Promise(function (resolve, reject) {
        db.query(sqlInsert, [nickname, profileImage], function (error, results, fields) {
        if (error) { return console.log(error); }
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        resolve(results.insertId);
    });}
    )
}


async function generateScoreForPlayer() {
    //mySql
    const nickname = await getRandomNickname();
    console.log(nickname);
    const profileImage = await getRandomProfileImage();
    const timestamp = Date.now();
    const value = getNumberBetween(1, 100);
    
    const scoreId = await insertInScores(value, timestamp);
    const playerId = await insertInPlayers(nickname, profileImage);

    
    const sqlInsertPxS = 'INSERT INTO player_has_score(player_id,score_id) VALUES (?,?);'
    db.query(sqlInsertPxS, [playerId, scoreId], function (error, results, fields) {
    });
    
    
}

function randomDataGenerator() {
    const amountOfPlayers = getNumberBetween(0,10);
    for (i = 0; i < amountOfPlayers; i++) {
        generateScoreForPlayer();
    }
    return Date.now();
}


module.exports = {randomDataGenerator};

    // CREATE TABLE scores
    //     ( id INT(11) NOT NULL AUTO_INCREMENT,
    //     value INT(11) NOT NULL,
    //     timestamp DATE,
    //     CONSTRAINT scores_pk PRIMARY KEY (id)
    //     );
    
    // CREATE TABLE players
    // ( id INT(11) NOT NULL AUTO_INCREMENT,
    //   nickname VARCHAR(8000),
    //   profile_image VARCHAR((8000)),
    //   CONSTRAINT players_pk PRIMARY KEY (id)
    // );

    // CREATE TABLE phs.gameDB.player_has_score
    // ( player_id INT(11) NOT NULL,
    //   score_id INT(11) NOT NULL,
    //   foreign key(player_id) references Players,
    //   foreign key(score_id) references Scores
    // )
