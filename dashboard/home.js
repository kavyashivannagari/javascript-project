
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get, push, set } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBDGJ5CaMG7XVltrSJ1VEqiaOonivmy0eg",
  authDomain: "audio-alley-authentication.firebaseapp.com",
  projectId: "audio-alley-authentication",
  storageBucket: "audio-alley-authentication.appspot.com",
  messagingSenderId: "265076676307",
  appId: "1:265076676307:web:7c6e8b341fb3d3cf7c6626"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Spinner functions
function showSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'flex';
    }
}

function hideSpinner() {
    const spinner = document.getElementById('loadingSpinner');
    if (spinner) {
        spinner.style.display = 'none';
    }
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navRight = document.getElementById('navright');

    mobileMenuToggle.addEventListener('click', (event) => {
        event.stopPropagation();
        navRight.classList.toggle('active');
        
        const isActive = navRight.classList.contains('active');
        mobileMenuToggle.innerHTML = isActive 
            ? '<i class="fa fa-times"></i>' 
            : '<i class="fa fa-bars"></i>';
    });

    document.addEventListener('click', (event) => {
        if (!navRight.contains(event.target) && 
            !mobileMenuToggle.contains(event.target) && 
            navRight.classList.contains('active')) {
            navRight.classList.remove('active');
            mobileMenuToggle.innerHTML = '<i class="fa fa-bars"></i>';
        }
    });

    navRight.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});

// Song data functions
async function fetchSongData() {
    showSpinner();
    const dbRef = ref(database, 'songs');
    try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            console.log("No data available");
            return null;
        }
    } catch (error) {
        console.error("Error fetching data: ", error);
        return null;
    } finally {
        hideSpinner();
    }
}

function organizeDataByLanguage(data) {
    const organizedData = {};
    for (const language in data) {
        organizedData[language] = [];
        for (const category in data[language]) {
            organizedData[language].push(...Object.values(data[language][category]));
        }
    }
    return organizedData;
}

function setSelectedsong(song) {
    localStorage.setItem('selectedSong', JSON.stringify(song));
}

async function displaySongs() {
    showSpinner();
    try {
        const data = await fetchSongData();
        if (data) {
            const organizedData = organizeDataByLanguage(data);
            const allSongs = Object.values(organizedData).flat();
            
            localStorage.setItem('allSongs', JSON.stringify(allSongs));
            
            const songSlider = document.getElementById("songSlider");
            songSlider.innerHTML = "";

            allSongs.forEach((song, index) => {
                const card = document.createElement("div");
                card.classList.add("songCard");
                const coverImage = song.coverImage || '../images/default-cover.jpg';
                card.innerHTML = `
                    <img src="${coverImage}" alt="${song.title}" onerror="this.src='../images/default-cover.jpg'">
                    <h5>${song.title}</h5>
                    <h6>${song.album}</h6>
                    <p>${song.artist}</p>
                `;
                card.addEventListener("click", () => {
                    setSelectedsong(song);
                    localStorage.setItem('currentSongIndex', index);
                    location.href = "../dashboard/singlesong.html";
                });
                songSlider.append(card);
            });
            
            const sliderWidth = parseFloat(getComputedStyle(songSlider).width);
            const firstCard = document.querySelector(".songCard");

            if (firstCard) {
                const cardStyle = getComputedStyle(firstCard);
                const cardWidth = parseFloat(cardStyle.width);
                const cardMarginLeft = parseFloat(cardStyle.marginLeft);
                const cardMarginRight = parseFloat(cardStyle.marginRight);
                const cardWidthWithMargins = cardWidth + cardMarginLeft + cardMarginRight;
                const cardsPerView = Math.floor(sliderWidth / cardWidthWithMargins);

                document.querySelector(".carousel-control.left").addEventListener("click", () => {
                    songSlider.scrollBy({
                        left: -cardWidthWithMargins * cardsPerView,
                        behavior: "smooth"
                    });
                });

                document.querySelector(".carousel-control.right").addEventListener("click", () => {
                    songSlider.scrollBy({
                        left: cardWidthWithMargins * cardsPerView,
                        behavior: "smooth"
                    });
                });
            }
        } else {
            console.log("No songs found.");
        }
    } catch (error) {
        console.error("Error displaying songs:", error);
    } finally {
        hideSpinner();
    }
}

// Search functionality
function filterSongs(songs, UserSearch) {
    const UserSearchWords = UserSearch.toLowerCase().split(' ');
    return songs.filter(song => {
        const songTitle = song.title.toLowerCase();
        const songArtist = song.artist.toLowerCase();
        const songAlbum = song.album.toLowerCase();
        const songReleaseyear = song.releaseYear ? song.releaseYear.toLowerCase() : "";
        const songLanguage = song.language ? song.language.toLowerCase() : "";
        const songCategory = song.category ? song.category.toLowerCase() : "";
        const songActors = song.actors ? song.actors.toLowerCase() : "";

        let searchKey = UserSearchWords[0];
        return (
            songTitle.includes(searchKey) ||
            songArtist.includes(searchKey) ||
            songAlbum.includes(searchKey) ||
            songReleaseyear.includes(searchKey) ||
            songLanguage.includes(searchKey) ||
            songCategory.includes(searchKey) ||
            songActors.includes(searchKey)
        );
    });
}

function displayFilteredSongs(filteredSongs) {
    const searchResultsContainer = document.getElementById("searchResultsContainer");
    const songSlider = document.getElementById("songSlider");
    const carouselControls = document.querySelectorAll(".carousel-control");

    songSlider.style.display = "none";
    searchResultsContainer.style.display = "flex";
    carouselControls.forEach(control => control.style.display = "none");

    searchResultsContainer.innerHTML = "";

    if (filteredSongs.length > 0) {
        filteredSongs.forEach(song => {
            const card = document.createElement("div");
            card.classList.add("songCard");
            card.innerHTML = `
                <img src="${song.coverImage}" alt="${song.title}">
                <h5>${song.title}</h5>
                <h6>${song.album}</h6>
                <p>${song.artist}</p>
            `;
            card.addEventListener("click", () => {
                setSelectedsong(song);
                location.href = "../dashboard/singlesong.html";
            });
            searchResultsContainer.append(card);
        });
    } else {
        searchResultsContainer.innerHTML = "<p>No songs found.</p>";
    }
}

const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", async () => {
    const UserSearch = searchInput.value.trim();
    showSpinner();
    try {
        const data = await fetchSongData();
        if (data) {
            const organizedData = organizeDataByLanguage(data);
            const allSongs = Object.values(organizedData).flat();

            if (UserSearch) {
                const filteredSongs = filterSongs(allSongs, UserSearch);
                displayFilteredSongs(filteredSongs);
            } else {
                const searchResultsContainer = document.getElementById("searchResultsContainer");
                const songSlider = document.getElementById("songSlider");
                const carouselControls = document.querySelectorAll(".carousel-control");

                searchResultsContainer.style.display = "none";
                songSlider.style.display = "flex";
                carouselControls.forEach(control => control.style.display = "block");
                displaySongs();
            }
        } else {
            console.log("No songs found.");
        }
    } catch (error) {
        console.error("Error during search:", error);
    } finally {
        hideSpinner();
    }
});

// Playlist functions
async function createPlaylist(playlistName) {
    showSpinner();
    const userPlaylists = ref(database, 'playlists');
    try {
        const newPlaylistRef = push(userPlaylists);
        await set(newPlaylistRef, {
            name: playlistName,
            songs: [],
            createdAt: new Date().toISOString()
        });
        return newPlaylistRef.key;
    } catch (error) {
        console.error("Error creating playlist:", error);
        return null;
    } finally {
        hideSpinner();
    }
}

async function addSongToPlaylist(playlistId, song) {
    showSpinner();
    const playlistRef = ref(database, `playlists/${playlistId}/songs`);
    try {
        const snapshot = await get(playlistRef);
        let songs = [];
        if (snapshot.exists()) {
            songs = snapshot.val();
        }
        
        const songExists = songs.some(s => s.title === song.title && s.artist === song.artist);
        if (songExists) {
            alert('Song already exists in playlist!');
            return false;
        }
        
        songs.push(song);
        await set(playlistRef, songs);
        alert('Song added to playlist successfully!');
        return true;
    } catch (error) {
        console.error("Error adding song to playlist:", error);
        return false;
    } finally {
        hideSpinner();
    }
}

// Logout functionality
document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            showSpinner();
            signOut(auth).then(() => {
                console.log("User signed out successfully");
                window.location.href = "../index.html";
            }).catch((error) => {
                console.error("Logout Error:", error);
                alert("Failed to log out. Please try again.");
            }).finally(() => {
                hideSpinner();
            });
        });
    }

    // Hide auth-only elements for guests
    const isGuest = !auth.currentUser;
    if (isGuest) {
        const authElements = document.querySelectorAll('.auth-only');
        authElements.forEach(element => {
            element.style.display = 'none';
        });
    }
});

// Initialize the app
displaySongs();