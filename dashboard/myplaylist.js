
document.addEventListener("DOMContentLoaded", () => {
    const playlistContainer = document.getElementById("playlistItems");
    
    // Get playlist from localStorage
    const playlist = JSON.parse(localStorage.getItem("myPlaylist")) || [];
    
    // If playlist is empty
    if (playlist.length === 0) {
        playlistContainer.innerHTML = `
            <div class="empty-playlist">
                <i class="fas fa-music" style="font-size: 3em; margin-bottom: 20px;"></i>
                <h2>Your playlist is empty</h2>
                <p>Go to the player and add some songs!</p>
            </div>
        `;
        return;
    }
    
    // Display each song in the playlist
    playlist.forEach((song, index) => {
        const playlistItem = document.createElement("div");
        playlistItem.className = "playlist-item";
        console.log(song)
        
        playlistItem.innerHTML = `
            <img src="${song.coverImage}" alt="${song.title}" class="song-image" 
                 onerror="this.src='../images/default-cover.jpg'">

            <div class="song-info">
                <div class="song-title">${song.title}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
           
            <audio src="${song.audioUrl}"controls></audio>

            <button class="remove-button" data-index="${index}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        playlistContainer.appendChild(playlistItem);
    });
    
    // Add event listeners for play buttons
    document.querySelectorAll(".play-button").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            const selectedSong = playlist[index];
            
            // Store the selected song and navigate to player
            localStorage.setItem("selectedSong", JSON.stringify(selectedSong));
            window.location.href = "player.html";
        });
    });
    
    // Add event listeners for remove buttons
    document.querySelectorAll(".remove-button").forEach(button => {
        button.addEventListener("click", () => {
            const index = button.getAttribute("data-index");
            
            // Remove the song from playlist
            playlist.splice(index, 1);
            localStorage.setItem("myPlaylist", JSON.stringify(playlist));
            
            // Refresh the page to update the list
            location.reload();
        });
    });
});
