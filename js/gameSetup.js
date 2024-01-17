// Use an event listener for the 'load' event on the window
window.addEventListener('load', function() {
    const playerName = localStorage.getItem("playerName") || 'Player';
    const lastScore = localStorage.getItem(`${playerName}_lastScore`) || '0';

    let message = `Hello, <strong>${playerName}</strong>! Ready to play?`;

    // Check if there's a previous score
    if (lastScore !== '0') {
        message = `Hello, <strong>${playerName}</strong>! Your last score was ${lastScore}. Ready to play?`;
    }

    Swal.fire({
        title: 'Welcome to Falling Emojis!',
        html: message,
        icon: 'info',
        confirmButtonText: 'Play'
    }).then((result) => {
        if (result.isConfirmed) {
            startGame(playerName);
        }
    });
});

function startGame(playerName) {
    document.getElementById("gameContainer").style.display = 'block';
    const level = 'easy';
    new EmojiTetrisGame(playerName, 0, level);
}
