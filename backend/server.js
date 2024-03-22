// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const shortid = require('shortid');
const app = express();
const port = 3000;

app.use(bodyParser.json());
// Serve static files from the 'frontend' directory
app.use(express.static(path.join(__dirname, '../frontend')));

const games = [];

// Function to find a game by code
function findGameByCode(gameCode) {
    return games.find(game => game.code === gameCode);
}

function generateId() {
    return Math.random().toString(36).substr(2, 6);
}


// Function to update or create a game
function updateOrCreateGame(gameCode, gameType, joinCode) {
    const existingGame = findGameByCode(gameCode);

    if (existingGame) {
        // Update the existing game
        existingGame.type = gameType;
        existingGame.joinCode = joinCode; // Store the join code
    } else {
        // Create a new game
        games.push({
            code: gameCode,
            type: gameType,
            joinCode,
            questions: [],
            players: []
        }); // Initialize the players array
    }

    // Print the updated games list to the console
    //console.log('Updated Games List:', games);
}


app.post('/api/updateJoinCode', (req, res) => {
    const {
        gameCode,
        joinCode
    } = req.body;
    const game = findGameByCode(gameCode);

    if (game) {
        game.joinCode = joinCode;
        console.log('Updated Games List:', games); // Move this line here
        res.json({
            success: true
        });
    } else {
        res.status(404).json({
            success: false,
            message: 'Game not found'
        });
    }
});

// Function to find a game by join code
function findGameByJoinCode(joinCode) {
    return games.find(game => game.joinCode === joinCode);
}

app.post('/api/joinGame', (req, res) => {
    const {
        joinCode,
        nickname
    } = req.body;
    const game = findGameByJoinCode(joinCode);
    console.log("Someone is trying to join with the username", nickname, "and the code is", joinCode)

    if (game) {
        // Assign an id to the player and add them to the players array
        const playerId = game.players.length + 1;
        game.players.push({
            id: playerId,
            nickname
        });
        res.json({
            success: true,
            playerId
        });
        console.log(playerId + ":", nickname, "Joined game:", joinCode)
    } else {
        res.status(404).json({
            success: false,
            message: 'Game not found'
        });
    }
});


app.post('/api/addPlayer', (req, res) => {
    const { joinCode, nickname } = req.body;
    const game = games.find(game => game.joinCode === joinCode);
    if (game) {
        const playerId = generateId();
        const newPlayer = { id: playerId, nickname };
        game.players.push(newPlayer);
        console.log(playerId + ":", nickname, "Joined game:", joinCode);
        res.json({ success: true, id: game.code, type: game.type });
    } else {
        res.json({ success: false, message: 'Game not found' });
    }
});





app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/students/index.html'));
});

app.get('/game.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/students/game.html'));
});

app.get('/teacher', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/teachers/index.html'));
});

app.get('/teacher/lobby.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/teachers/lobby.html'));
});

// Add this route to handle requests for starting a new game
app.post('/api/startGame', (req, res) => {
    const gameCode = req.body.gameCode || shortid.generate(); // Use the game code from the request body, or generate a new one if it's not provided
    const gameType = req.body.gameType || 'Default'; // Default to 'Default' if not provided
    const joinCode = req.body.joinCode; // Extract the join code from the request body
    updateOrCreateGame(gameCode, gameType, joinCode); // Pass the join code to the updateOrCreateGame function
    res.json({
        gameCode,
        gameType,
        joinCode
    }); // Include the join code in the response
});




app.post('/api/createGame', (req, res) => {
    const gameCode = shortid.generate();
    games.push({
        code: gameCode,
        questions: []
    });
    updateOrCreateGame(gameCode, 'Default'); // Default game type for createGame
    res.json({
        gameCode
    });
});

app.get('/api/getGames', (req, res) => {
    res.json(games);
});
app.get('/api/getQuestions/:gameCode', (req, res) => {
    const game = games.find(game => game.code === req.params.gameCode);
    res.json(game ? game.questions : []);
});

app.get('/api/getPlayers/:gameId', (req, res) => {
    const gameId = req.params.gameId;
    const game = games.find(game => game.code === gameId);
    console.log("Tried updating server-side players on", game)
    if (game) {
        res.json({ players: game.players });
    } else {
        res.json({ players: [] });
    }
});



app.post('/api/checkAnswer', (req, res) => {
    const score = checkAnswer(req.body.teacherAnswer, req.body.studentAnswer);
    res.json({
        score
    });
});
app.get('/api/checkGame/:gameCode', (req, res) => {
    const gameCode = req.params.gameCode;
    const game = games.find(game => game.joinCode === gameCode);
    console.log("Checking Game")

    if (game) {
        res.json({
            exists: true,
            id: game.id,
            type: game.type
        });
        console.log("Check Succ");

    } else {
        res.json({
            exists: false
        });
        console.log("Check fail");

    }
});



app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});