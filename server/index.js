const express = require("express");
const app = express();
const mysql = require('mysql')
const request = require('request');
const cron = require('node-cron');
const cors = require('cors');

const randomDataGenerator = require('./randomDataGenerator');
const bodyParser = require("body-parser");
const { on } = require("nodemon");
let lastUpdate = Date.now();

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'phs-gameDB',
});


app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended : true }))

// Schedule tasks to be run on the server.
cron.schedule('5 * * * * *', function() {
    console.log("cron job runned")
    randomDataGenerator.randomDataGenerator();
});


// query to get top 10 by score
app.get("/api/get", (req, res) => {           
     const sqlGetTopTen2 =  `
     SELECT p.nickname, p.profile_image, s.value, s.timestamp 
         FROM Players as p 
         INNER JOIN player_has_score as ps ON ps.player_id = p.id 
         INNER JOIN Scores as s ON s.id = ps.score_id 
     ORDER BY s.value DESC LIMIT 0, 10;    
     `;
    db.query(sqlGetTopTen2, (err, result) => {
        res.send(result);
    });
});


app.get("/api/generate", (req, res) => {
    lastUpdate = randomDataGenerator.randomDataGenerator();
    res.send("{"+lastUpdate+"}");
});

app.listen(3001, () => {
    console.log("running on port 3001");
});