function joinGame() {
    const enteredGameCode = gameCodeInput.value;
    const enteredNickname = nicknameInput.value;

    // Check if both input boxes are not empty
    if (!enteredGameCode || !enteredNickname) {
        alert('Please enter both a game code and a nickname.');
        return;
    }

    fetch(`/api/checkGame/${enteredGameCode}`)
    .then(response => response.json())
    .then(data => {
        console.log('Check game response:', data); // Log the response from /api/checkGame
        if (data.exists) {
            // Add the player to the game on the server
            fetch('/api/addPlayer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ joinCode: enteredGameCode, nickname: enteredNickname }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Add player response:', data); // Log the response from /api/addPlayer
                if (data.success) {
                    // Redirect to game.html with game ID, type, and nickname
                    window.location.href = `/game.html?id=${data.id}&type=${encodeURIComponent(data.type)}&nickname=${encodeURIComponent(enteredNickname)}`;
                } else {
                    console.error('Failed to add player:', data.message);
                }
            })
            .catch(error => console.error('Error adding player:', error));
        } else {
            // Alert the user that the code is invalid
            alert('Invalid game code. Please try again.');
        }
    });
}
