// Our quote notebook
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

// A map to the HTML pieces.
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuoteButton");
const newQuoteText = document.getElementById("newQuoteText");
const newQuoteCategory = document.getElementById("newQuoteCategory");
const addQuoteButton = document.getElementById("addQuoteButton");

// Show a Random Quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Clear old content
  quoteDisplay.innerHTML = "";

  // Create elements for the new quote
  const quoteTextEl = document.createElement("p");
  quoteTextEl.id = "quoteText";
  quoteTextEl.textContent = `"${randomQuote.text}"`;

  const quoteCategoryEl = document.createElement("p");
  quoteCategoryEl.id = "quoteAuthor";
  quoteCategoryEl.textContent = `— ${randomQuote.category}`;

  // Append them to the display
  quoteDisplay.appendChild(quoteTextEl);
  quoteDisplay.appendChild(quoteCategoryEl);
}

// Add a New Quote
function addQuote() {
  const quote = newQuoteText.value.trim();
  const category = newQuoteCategory.value.trim();

  // Check that inputs are not empty
  if (quote !== "" && category !== "") {
    const newQuote = { text: quote, category: category };
    quotes.push(newQuote);

    // Clear inputs
    newQuoteText.value = "";
    newQuoteCategory.value = "";

    // Show the newly added quote
    showRandomQuote();
  }
}

// Button event listeners
newQuoteButton.addEventListener("click", showRandomQuote);
addQuoteButton.addEventListener("click", addQuote);
window.onload = showRandomQuote;

// Dummy function to avoid missing reference errors
function createAddQuoteForm() {
  console.warn(
    "createAddQuoteForm() was called, but it's not needed. Using addQuote() instead."
  );
}
