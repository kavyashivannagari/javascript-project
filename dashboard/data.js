import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// Spotify color palette
const spotifyColors = {
    green: '#1DB954',
    darkGreen: '#1ED760',
    black: '#191414',
    white: '#FFFFFF'
};

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

// 🎵 Add Song to Firebase
document.getElementById("songdata").addEventListener("submit", async (e) => {
    e.preventDefault(); // Prevent form refresh

    // Get values from form
    const songData = {
        id: document.getElementById("id").value.trim(),
        title: document.getElementById("songname").value.trim(),
        album: document.getElementById("songalbum").value.trim(),
        artist: document.getElementById("artist").value.trim(),
        coverImage: document.getElementById("coverimage").value.trim(),
        audioUrl: document.getElementById("audiourl").value.trim(),
        musicDirector: document.getElementById("musicdirector").value.trim(),
        actors: document.getElementById("actors").value.trim(),
        writer: document.getElementById("writer").value.trim(),
        releaseYear: document.getElementById("releaseyear").value.trim(),
        language: document.getElementById("language").value.trim(),
        category: document.getElementById("category").value.trim()
    };

    // Validate required fields
    const requiredFields = ['title', 'artist', 'language', 'category'];
    const missingFields = requiredFields.filter(field => !songData[field]);

    if (missingFields.length > 0) {
        Swal.fire({
            title: 'Missing Information',
            text: `Please fill in the following required fields: ${missingFields.join(', ')}`,
            icon: 'warning',
            confirmButtonColor: spotifyColors.green,
            background: spotifyColors.black,
            color: spotifyColors.white
        });
        return;
    }

    const language = songData.language;
    const category = songData.category;

    // Reference to the specific language and category in the database
    const dbref = ref(database, `songs/${language}/${category}`);

    try {
        // Push the song data to the database
        await push(dbref, songData);
        
        // Show success message
        Swal.fire({
            title: 'Success!',
            text: 'Track added successfully',
            icon: 'success',
            confirmButtonColor: spotifyColors.green,
            background: spotifyColors.black,
            color: spotifyColors.white
        }).then(() => {
            // Redirect after successful upload
            location.href = "./home.html";
        });

        e.target.reset(); // Reset the form
    } catch (error) {
        // Show error message
        Swal.fire({
            title: 'Upload Failed',
            text: 'Error in adding data: ' + (error.message || error),
            icon: 'error',
            confirmButtonColor: spotifyColors.green,
            background: spotifyColors.black,
            color: spotifyColors.white
        });
        console.error(error);
    }
});