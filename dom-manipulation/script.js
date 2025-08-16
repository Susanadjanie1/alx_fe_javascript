// Quotes Data
const quotes = [
  {
    text: "The best way to predict the future is to create it.",
    category: "Inspiration",
  },
  {
    text: "Life is what happens when you're busy making other plans.",
    category: "Life",
  },
  {
    text: "The only way to do great work is to love what you do.",
    category: "Work",
  },
  {
    text: "Imagination is more important than knowledge.",
    category: "Creativity",
  },
  { text: "An apple a day keeps the doctor away.", category: "Health" },
];

// DOM Elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuoteButton");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const addQuoteButton = document.getElementById("addQuoteButton");

// Local Storage Functions
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes.length = 0; // clear current quotes
    quotes.push(...JSON.parse(storedQuotes));
  }
}


// Session Storage Functions
function saveLastQuote(quote) {
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function loadLastQuote() {
  const last = sessionStorage.getItem("lastQuote");
  return last ? JSON.parse(last) : null;
}


// Show a Random Quote
function showRandomQuote() {
  let randomQuote;

  // If we have a last quote in session, show it first
  const lastQuote = loadLastQuote();
  if (lastQuote) {
    randomQuote = lastQuote;
    sessionStorage.removeItem("lastQuote"); 
  } else {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    randomQuote = quotes[randomIndex];
  }

  // Clear old content
  quoteDisplay.innerHTML = "";

  // Create elements
  const quoteTextEl = document.createElement("p");
  quoteTextEl.id = "quoteText";
  quoteTextEl.textContent = `"${randomQuote.text}"`;

  const quoteCategoryEl = document.createElement("p");
  quoteCategoryEl.id = "quoteAuthor";
  quoteCategoryEl.textContent = `— ${randomQuote.category}`;

  // Append
  quoteDisplay.appendChild(quoteTextEl);
  quoteDisplay.appendChild(quoteCategoryEl);

  // Save this as the last shown quote
  saveLastQuote(randomQuote);
}


// Add a New Quote
function addQuote() {
  const quote = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  if (quote !== "" && category !== "") {
    const newQuote = { text: quote, category: category };
    quotes.push(newQuote);
    saveQuotes();

    newQuoteText.value = "";
    newQuoteCategory.value = "";

     populateCategories();

    showRandomQuote();
  }
}

// Populate Categories for Filtering
function populateCategories() {
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];

  // Clear old options
  categoryFilter.innerHTML = "";

  // Fill dropdown
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter
  const savedFilter = loadFilter();
  categoryFilter.value = savedFilter;
}


// Export / Import JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2); // pretty format
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
    showRandomQuote();
  };
  fileReader.readAsText(event.target.files[0]);
}


// Event Listeners
newQuoteButton.addEventListener("click", showRandomQuote);
addQuoteButton.addEventListener("click", addQuote);
window.onload = function () {
  loadQuotes();
  showRandomQuote();
};


// Dummy Function 

function createAddQuoteForm() {
  console.warn(
    "createAddQuoteForm() was called, but it's not needed. Use addQuote() instead."
  );
}
