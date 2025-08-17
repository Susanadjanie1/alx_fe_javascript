let selectedCategory = "all";


// Quotes Data
const quotes = [
  { text: "The best way to predict the future is to create it.", category: "Inspiration" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "The only way to do great work is to love what you do.", category: "Work" },
  { text: "Imagination is more important than knowledge.", category: "Creativity" },
  { text: "An apple a day keeps the doctor away.", category: "Health" },
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuoteButton");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const addQuoteButton = document.getElementById("addQuoteButton");
const categoryFilter = document.getElementById("categoryFilter");


// Local Storage Functions
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes.length = 0;
    quotes.push(...JSON.parse(storedQuotes));
  }
}

function saveFilter(category) {
  localStorage.setItem("selectedCategory", category);
}

function loadFilter() {
  return localStorage.getItem("selectedCategory") || "all";
}


// Session Storage Functions
function saveLastQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function loadLastQuote() {
  const last = sessionStorage.getItem("lastQuote");
  return last ? JSON.parse(last) : null;
}

// Show Quotes
function showRandomQuote() {
  const category = selectedCategory;
  const filtered = category === "all"
    ? quotes
    : quotes.filter((q) => q.category === category);

  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes in this category.";
    return;
  }

  let randomQuote;
  const lastQ = loadLastQuote();

  if (lastQ && lastQ.category === category) {
    randomQuote = lastQ;
    sessionStorage.removeItem("lastQuote");
  } else {
    randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  }

  quoteDisplay.innerHTML = "";

  const pText = document.createElement("p");
  pText.id = "quoteText";
  pText.textContent = `"${randomQuote.text}"`;

  const pCat = document.createElement("p");
  pCat.id = "quoteAuthor";
  pCat.textContent = `— ${randomQuote.category}`;

  quoteDisplay.appendChild(pText);
  quoteDisplay.appendChild(pCat);

  saveLastQuote(randomQuote);
}

// Add Quote
function addQuote() {
  const quote = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (quote && category) {
    quotes.push({ text: quote, category: category });
    saveQuotes();
    syncQuotesToServer();
    newQuoteText.value = "";
    newQuoteCategory.value = "";

    populateCategories();
    showRandomQuote();
  }
}


// Populate and Filter Category
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];
  categoryFilter.innerHTML = "";

  categories.forEach((cat) => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(opt);
  });

  selectedCategory = loadFilter();
  categoryFilter.value = selectedCategory;
}

function filterQuote() {
  selectedCategory = categoryFilter.value;
  saveFilter(selectedCategory);
  showRandomQuote();
}


// Export / Import
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    alert("Quotes imported!");
    showRandomQuote();
  };
  reader.readAsText(event.target.files[0]);
}


// Server Sync Simulation 

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    // Convert server response 
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));

    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error("Error fetching server quotes:", error);
  }
}

// Simulate sending quotes to the server
async function syncQuotesToServer() {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(quotes),
      headers: { "Content-Type": "application/json" }
    });
    console.log("Quotes synced with server!");
  } catch (error) {
    console.error("Error syncing quotes to server:", error);
  }
}

// Conflict resolution
function resolveConflicts(serverQuotes) {
  const merged = [...serverQuotes, ...quotes];
  // remove duplicates by text
  const unique = [];
  const seen = new Set();

  merged.forEach(q => {
    if (!seen.has(q.text)) {
      seen.add(q.text);
      unique.push(q);
    }
  });

  quotes.length = 0;
  quotes.push(...unique);
  saveQuotes();
  showRandomQuote();
  alert("Quotes updated from server!");
}

// Periodic sync 
setInterval(fetchQuotesFromServer, 30000);


// Event Listeners
newQuoteButton.addEventListener("click", showRandomQuote);
addQuoteButton.addEventListener("click", addQuote);
window.onload = function () {
  loadQuotes();
  populateCategories();
  filterQuote();
};

// Compatibility Dummy
function createAddQuoteForm() {
  console.warn("createAddQuoteForm() not needed");
}
