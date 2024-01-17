document.getElementById("startButton").addEventListener("click", function() {
    let playerName = document.getElementById("playerName").value.trim();
    const regex = /^[A-Za-z]+$/; // Regular expression to check for letters only

    if (!playerName) {
        Swal.fire({
            title: 'Please enter your name!',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    if (!regex.test(playerName)) {
        Swal.fire({
            title: 'Name should contain letters only!',
            icon: 'error',
            confirmButtonText: 'Ok'
        });
        return;
    }

    // Convert the player name to lowercase before storing
    playerName = playerName.toLowerCase();

    localStorage.setItem("playerName", playerName);
    const selectedLevel = document.getElementById("level").value;
    localStorage.setItem("selectedLevel", selectedLevel);
    window.location.href = "game.html";
});
