// frontend/teachers/script.js
document.addEventListener('DOMContentLoaded', () => {
    const gameButtons = document.querySelectorAll('.game-button');

    gameButtons.forEach(button => {
        button.addEventListener('click', () => {
            const gameName = button.getAttribute('data-game-name');
            startGame(gameName);
        });
    });
});

function startGame(gameName) {
    const gameCode = generateGameId(); // Generate a new game code
    fetch('/api/startGame', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ gameType: gameName, joinCode: gameCode }), // Include the join code in the body
    })
        .then(response => response.json())
        .then(data => {
            const { gameCode, gameType } = data;
            window.location.href = `/teacher/lobby.html?id=${gameCode}&type=${encodeURIComponent(gameType)}`;
        })
        .catch(error => console.error('Error starting the game:', error));
}




function generateGameId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const codeLength = 4;
    let code = '';

    for (let i = 0; i < codeLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }

    return code;
}
