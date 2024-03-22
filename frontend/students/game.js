// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);

// Get game type from URL parameters
const gameType = urlParams.get('type');

// Set game type as the header
document.getElementById('gameType').textContent = decodeURIComponent(gameType);

//hides questions
document.getElementById('questions').style.display = 'none';


// Function to start the game
function startGame() {
    // Hide waiting message
    document.getElementById('waitingMessage').style.display = 'none';

    // Show questions
    document.getElementById('questions').style.display = 'block';
}

// Call startGame when the game starts
// startGame();
