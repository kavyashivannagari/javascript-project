import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyBDGJ5CaMG7XVltrSJ1VEqiaOonivmy0eg",
  authDomain: "audio-alley-authentication.firebaseapp.com",
  projectId: "audio-alley-authentication",
  storageBucket: "audio-alley-authentication.firebasestorage.app",
  messagingSenderId: "265076676307",
  appId: "1:265076676307:web:7c6e8b341fb3d3cf7c6626"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth=getAuth(app)

const hamicon = document.getElementById('hamicon');
const homeaside = document.getElementById('homeaside');

 hamicon.addEventListener('click', () => {
  homeaside.style.display = homeaside.style.display === 'none' ? 'block' : 'none';
  if (homeaside.style.display === 'none') {
    homeaside.style.display = 'flex'; 
    homeaside.style.width = '20%';
    homeaside.style.height = '100vh';
    homeaside.style.border = '2px solid orangered';
    // homeaside.style.borderRadius = '30px';
    homeaside.style.padding = '60px 30px';
    homeaside.style.flexDirection = 'column';
    homeaside.style.alignItems = 'center';
    homeaside.style.rowGap = '50px';
    homeaside.style.position = 'fixed';
    homeaside.style.top = '30';
    homeaside.style.left = '0';
    homeaside.style.backgroundColor = '#f0f0f0';
    homeaside.style.zIndex = '100';
  } else {
    homeaside.style.display = 'none';
  }
});
const backIcon = document.createElement('i'); 

backIcon.classList.add('fa-solid', 'fa-xmark'); // Add back icon (X)
backIcon.style.position = 'absolute';
backIcon.style.top = '30px';
backIcon.style.right = '10px';
backIcon.style.fontSize = '20px';
backIcon.style.cursor = 'pointer';

homeaside.appendChild(backIcon); // Append back icon to the aside

hamicon.addEventListener('click', () => {
  if (homeaside.style.display === 'none') {
    homeaside.style.display = 'flex';
    // Apply CSS styles as before
  } else {
    homeaside.style.display = 'none';
  }
});

backIcon.addEventListener('click', () => {
  homeaside.style.display = 'none';
});

const url = "https://spotify-api-1-jycz.onrender.com/songs";
console.log(url);


    async function getSongs() {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        var data = await response.json();
        console.log(data);
        
      } catch (error) {
        console.error("Error fetching songs:", error);
        // Handle errors gracefully, e.g., display an error message to the user
        return []; // Return an empty array to prevent carousel errors
      }
    }
    getSongs()
    const songsSlider=document.getElementById("songsSlider")
    data.forEach(song=>{
      const card = document.createElement("div");
      card.classList.add("songcard")
      card.innerHTML = `
        <img src="${song.coverimage}" alt="${song.title}">
        <h3>${song.title}</h3>
        <p>${song.album}</p>
        <p>${song.artist}</p>`;
    })



