// Constants
const API_URL = "https://api.quotable.io/random";
const LOCAL_STORAGE_KEY = "favorites";

// Selectors
const elements = {
  quote: document.getElementById("quote"),
  author: document.getElementById("author"),
  btn: document.getElementById("btn"),
  favourite: document.getElementById("favourite"),
  list: document.getElementById("list-of-favourite-quotes"),
  copyButton: document.getElementById("copy"),
  showFavouritesButton: document.getElementById("show-list"),
  clearButton: document.getElementById("clear-button"),
  favoriteContainer: document.querySelector(".favorite-container"),
  closeButton: document.getElementById("close-favorite"),
  heartIcon: document.getElementById("favourite").firstElementChild,
};

// State
let favorites = loadFavorites();

// Initialize the application
function initializeApp() {
  updateQuoteText();
  attachEventListeners();
  displayFavorites();
}

// Fetching a new quote from the API
async function fetchQuote() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetching quote failed:", error);
    return null;
  }
}

// Updating the UI with the new quote
async function updateQuoteText() {
  const newQuote = await fetchQuote();
  if (newQuote) {
    elements.quote.textContent = newQuote.content;
    elements.author.textContent = newQuote.author;
    updateHeartIcon(newQuote);
  } else {
    elements.quote.textContent = "Failed to load quote. Please try again.";
    elements.author.textContent = "";
  }
}

// Checking if the quote is already in favorites
function isQuoteFavorited(quote) {
  return favorites.some(
    (fav) => fav.content === quote.content && fav.author === quote.author
  );
}

// Heart icon update based on favorite status
function updateHeartIcon(quote) {
  const isFavorited = isQuoteFavorited(quote);
  elements.heartIcon.classList.toggle("fa-solid", isFavorited);
  elements.heartIcon.classList.toggle("fa-regular", !isFavorited);
  elements.heartIcon.classList.toggle("active", isFavorited);
}

// Adding or removing quote to/from favorites
function toggleFavorite() {
  const currentQuote = {
    content: elements.quote.textContent,
    author: elements.author.textContent,
  };

  if (isQuoteFavorited(currentQuote)) {
    favorites = favorites.filter(
      (fav) =>
        fav.content !== currentQuote.content ||
        fav.author !== currentQuote.author
    );
  } else {
    favorites.push(currentQuote);
  }
  saveFavorites();
  displayFavorites();
  updateHeartIcon(currentQuote);
}

// Display favorite quotes in the list
function displayFavorites() {
  elements.list.innerHTML = "";
  favorites.forEach((quote, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${index + 1}. ${quote.content} - ${quote.author}`;
    elements.list.appendChild(listItem);
  });
}

// Use navigator.clipboard API for copying quote to clipboard
function copyQuoteToClipboard() {
  const quoteText = `${elements.quote.textContent} - ${elements.author.textContent}`;
  navigator.clipboard
    .writeText(quoteText)
    .then(() => {
      alert("Quote copied to clipboard!");
    })
    .catch((err) => {
      console.error("Error in copying text: ", err);
    });
}

// Load favorites from local storage
function loadFavorites() {
  const storedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY);
  return storedFavorites ? JSON.parse(storedFavorites) : [];
}

// Save favorites to local storage
function saveFavorites() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
}

// Clearing all favorites
function clearFavorites() {
  favorites = [];
  saveFavorites();
  displayFavorites();
  hideFavoritesList();
}

// Functions to show/hide favorites list
function showFavoritesList() {
  elements.favoriteContainer.style.display = "block";
}

function hideFavoritesList() {
  elements.favoriteContainer.style.display = "none";
}

// Event listeners
function attachEventListeners() {
  elements.btn.addEventListener("click", updateQuoteText);
  elements.favourite.addEventListener("click", toggleFavorite);
  elements.copyButton.addEventListener("click", copyQuoteToClipboard);
  elements.clearButton.addEventListener("click", clearFavorites);
  elements.showFavouritesButton.addEventListener("click", showFavoritesList);
  elements.closeButton.addEventListener("click", hideFavoritesList);
}

// Initial setup
document.addEventListener("DOMContentLoaded", initializeApp);
