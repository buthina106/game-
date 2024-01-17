// Update and store score function
function updateAndStoreScore(playerName, score) {
    document.getElementById("score").textContent = score;
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("playerScore", score);
    updateLastScoreIcon(playerName, score);
}

// Update last score icon function
function updateLastScoreIcon(playerName, score) { 
    const lastScoreIcon = document.getElementById("lastScoreIcon");
    if (lastScoreIcon) {
        lastScoreIcon.innerHTML = `<img src="path/to/icon.png" alt="Last Score Icon"> ${playerName}: ${score}`;
    }
}