
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

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

const hamicon = document.getElementById('hamicon');
const homeaside = document.getElementById('homeaside');

hamicon.addEventListener('click', () => {
  homeaside.style.display = homeaside.style.display === 'none' ? 'block' : 'none';
  if (homeaside.style.display === 'none') {
    homeaside.style.display = 'flex';
    homeaside.style.width = '20%';
    homeaside.style.height = '100vh';
    homeaside.style.border = '2px solid white';
    homeaside.style.padding = '60px 30px';
    homeaside.style.flexDirection = 'column';
    homeaside.style.alignItems = 'center';
    homeaside.style.rowGap = '50px';
    homeaside.style.position = 'fixed';
    homeaside.style.top = '30';
    homeaside.style.left = '0';
    homeaside.style.backgroundColor = '#f0f0f0';
    homeaside.style.zIndex = '100';
    homeaside.style.boxShadow = '6px 6px 6px #580052';
  }
  else {
    homeaside.style.display = 'none';
  }
});

const backIcon = document.createElement('i');
backIcon.classList.add('fa-solid', 'fa-xmark');
backIcon.style.position = 'absolute';
backIcon.style.top = '30px';
backIcon.style.right = '10px';
backIcon.style.fontSize = '20px';
backIcon.style.cursor = 'pointer';
backIcon.style.color = '#580052';

homeaside.appendChild(backIcon);
hamicon.addEventListener('click', () => {
if (homeaside.style.display === 'none') {
    homeaside.style.display = 'flex';
  }
else {
    homeaside.style.display = 'none';
  }
});

backIcon.addEventListener('click', () => {
  homeaside.style.display = 'none';
});

async function fetchSongData() {
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

async function displaySongs() {
  const data = await fetchSongData(); // Await the promise to get the resolved data
  if (data) {
    const organizedData = organizeDataByLanguage(data);
    const allSongs = Object.values(organizedData).flat(); // Flatten the data into an array of songs

    const songSlider = document.getElementById("songSlider");
    songSlider.innerHTML = ""; // Clear previous content

    allSongs.forEach(song => {
      const card = document.createElement("div");
      card.classList.add("songCard");
      card.innerHTML = `
        <img src="${song.coverImage}" alt="${song.title}">
        <h5>${song.title}</h5>
        <h6>${song.album}</h6>
        <p>${song.artist}</p>
      `;
      card.addEventListener("click", () => {
        location.href = "../dashboard/singlesong.html";
      });
      songSlider.append(card);
    });

    // Left and right buttons for scrolling
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
}

// Call the function to display songs
displaySongs();

// Search functionality
function filterSongs(songs, UserSearch) {
  const UserSearchWords = UserSearch.toLowerCase().split(' '); // Split the query into individual words

  return songs.filter(song => {
    const songTitle = song.title.toLowerCase();
    const songArtist = song.artist.toLowerCase();
    const songAlbum = song.album.toLowerCase();
    const songReleaseyear = song.releaseYear ? song.releaseYear.toLowerCase() : "";
    const songLanguage = song.language ? song.language.toLowerCase() : "";
    const songCategory = song.category ? song.category.toLowerCase() : "";
    const songActors = song.actors ? song.actors.toLowerCase() : "";

    // Check if all query words are present in the song's title, artist, or album
    return UserSearchWords.every(word =>
      songTitle.includes(word) ||
      songArtist.includes(word) ||
      songAlbum.includes(word) ||
      songReleaseyear.includes(word) ||
      songLanguage.includes(word) ||
      songCategory.includes(word) ||
      songActors.includes(word)
    );
  });
}

// Function to display filtered songs in the search results container
function displayFilteredSongs(filteredSongs) {
  const searchResultsContainer = document.getElementById("searchResultsContainer");
  const songSlider = document.getElementById("songSlider");
  const carouselControls = document.querySelectorAll(".carousel-control"); // Define carouselControls

  // Hide the carousel and show the search results container
  songSlider.style.display = "none";
  searchResultsContainer.style.display = "flex";

  // Hide the carousel navigation icons
  carouselControls.forEach(control => {
    control.style.display = "none";
  });

  searchResultsContainer.innerHTML = ""; // Clear previous content

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
        location.href = "../dashboard/singlesong.html";


      });
      searchResultsContainer.append(card);
    });
  } else {
    searchResultsContainer.innerHTML = "<p>No songs found.</p>";
  }
}

// Event listener for search input
const searchInput = document.getElementById("searchInput");
searchInput.addEventListener("input", async () => {
  const UserSearch = searchInput.value.trim();
  console.log("Search Query:", UserSearch); // Debugging

  const data = await fetchSongData(); // Fetch the song data

  if (data) {
    const organizedData = organizeDataByLanguage(data);
    const allSongs = Object.values(organizedData).flat(); // Flatten the data into an array of songs

    if (UserSearch) {
      const filteredSongs = filterSongs(allSongs, UserSearch);
      console.log("Filtered Songs:", filteredSongs); // Debugging
      displayFilteredSongs(filteredSongs);
    } else {
      // If the search query is empty, display all songs in the carousel
      const searchResultsContainer = document.getElementById("searchResultsContainer");
      const songSlider = document.getElementById("songSlider");

      searchResultsContainer.style.display = "none";
      songSlider.style.display = "flex";

      // Show the carousel navigation icons
      carouselControls.forEach(control => {
        control.style.display = "block"; // Or their original display value
      });

      displaySongs();
    }
  } else {
    console.log("No songs found.");
  }
});
export{card}