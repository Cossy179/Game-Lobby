// frontend/teachers/lobby.js
const gameCodeElement = document.getElementById('gameCode');
const studentScoresList = document.getElementById('studentScores');
const lobbyTitle = document.getElementById('lobbyTitle');

// Function to extract parameters from the URL
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Function to update the game code on the page and store it in sessionStorage
function updateGameCode() {
    const gameId = getUrlParameter('id'); // Get the game ID from the URL
    const storedGameCode = sessionStorage.getItem('gameCode-' + gameId); // Use the game ID as part of the key
    const gameCode = storedGameCode || generateGameCode();
    gameCodeElement.innerText = `Game Code: ${gameCode}`;
    
    // Store the game code in sessionStorage with the game ID as part of the key
    sessionStorage.setItem('gameCode-' + gameId, gameCode);

    // Send the join code to the server
    sendJoinCodeToServer(gameId, gameCode);
}



// Function to update the game type on the page
function updateGameType() {
    const gameType = decodeURIComponent(getUrlParameter('type'));
    lobbyTitle.innerText = `Game Lobby - ${gameType || 'Undefined'}`;
}

// Function to generate a random game code
function generateGameCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const codeLength = 4;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}

function sendJoinCodeToServer(gameCode, joinCode) {
    fetch('/api/updateJoinCode', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameCode, joinCode }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Join code updated successfully');
        } else {
            console.error('Failed to update join code:', data.message);
        }
    })
    .catch(error => console.error('Error updating join code:', error));
}


// Function to update student scores on the page
/* function updateStudentScores(students) {
    studentScoresList.innerHTML = '';

    students.forEach(student => {
        const listItem = document.createElement('li');
        listItem.innerText = `${student.name}: ${student.score}`;
        studentScoresList.appendChild(listItem);
    });
} */

// Initial setup
let students = []; // List to store students

const gameId = getUrlParameter('id');
const gameName = getUrlParameter('name');

updateGameCode();
updateGameType(); // Add this line to update the game type
//updateStudentScores(students);

// Function to fetch players from the server
function fetchPlayers() {
    console.log("tried to fetch players from", gameId)
    fetch(`/api/getPlayers/${gameId}`)
    .then(response => response.json())
    .then(data => {
        // Update player list and count
        const playerList = document.getElementById('playerList');
        const playerCount = document.getElementById('playerCount');
        playerList.innerHTML = ''; // Clear the player list
        data.players.forEach(player => {
            const listItem = document.createElement('li');
            listItem.textContent = player.nickname;
            playerList.appendChild(listItem);
        });
        playerCount.textContent = `Player count: ${data.players.length}`;
    })
    .catch(error => console.error('Error fetching players:', error));
    
}

// Fetch players when the page loads
fetchPlayers();

// Fetch players every 3 seconds
setInterval(fetchPlayers, 3000);

// Function to start the game
function startGame() {
    // Redirect to game.html with game ID, type, and nickname
    // window.location.href = `/game.html?id=${data.id}&type=${encodeURIComponent(data.type)}&nickname=${encodeURIComponent(enteredNickname)}`;
}

// Add event listener to start button
document.getElementById('startButton').addEventListener('click', startGame);


// Example usage:
// simulateStartGame();
// simulateSubmitAnswer('Student1', 8);
