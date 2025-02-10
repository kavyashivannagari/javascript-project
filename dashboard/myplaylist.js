// playlist.js
document.addEventListener('DOMContentLoaded', () => {
    displayPlaylist();
});

function displayPlaylist() {
    const playlistContainer = document.getElementById('playlistItems');
    const playlist = JSON.parse(localStorage.getItem('playlist')) || [];
    
    if (playlist.length === 0) {
        playlistContainer.innerHTML = `
            <div class="empty-playlist">
                <i class="fas fa-music" style="font-size: 48px; margin-bottom: 20px;"></i>
                <p>Your playlist is empty. Add some songs!</p>
            </div>
        `;
        return;
    }
    
    playlistContainer.innerHTML = playlist.map((song, index) => `
        <div class="playlist-item">
            <img src="${song.coverImage}" alt="${song.title}">
            <div class="song-info">
                <h3>${song.title}</h3>
                <p>${song.artist}</p>
                <p>${song.album}</p>
            </div>
            <button class="remove-btn" onclick="removeSong(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function removeSong(index) {
    let playlist = JSON.parse(localStorage.getItem('playlist')) || [];
    playlist.splice(index, 1);
    localStorage.setItem('playlist', JSON.stringify(playlist));
    displayPlaylist();
}