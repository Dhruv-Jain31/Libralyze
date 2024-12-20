const fs = require("fs");
const readline = require("readline");
const issueBook = require("./bookIssue"); // Import issueBook function
const { searchBooks, SearchType } = require("./searchBooks");
const bookReturn = require("./bookReturn.js");

// Path to your JSON file
const libraryDataPath = "../shared/libraryData.json";

// Create an interface for reading user input
let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to load book data from JSON file
function loadLibraryData() {
  try {
    const data = fs.readFileSync(libraryDataPath, "utf-8");
    const booksArray = JSON.parse(data); // Parse JSON array of arrays
    return new Map(booksArray); // Directly convert array of arrays to Map
  } catch (error) {
    console.error("Error loading library data:", error);
    return new Map();
  }
}

// Function to save updated library data back to the JSON file
function saveLibraryData(libraryData) {
  const booksArray = Array.from(libraryData.entries()); // Convert map back to array of arrays
  fs.writeFileSync(libraryDataPath, JSON.stringify(booksArray, null, 2));
}

// Load the initial library data
let libraryData = loadLibraryData();

// Function to display the menu
function displayMenu() {
  console.log("\nLibralyze - Client Menu");
  console.log("1. Show Available Books");
  console.log("2. Search Book by ISBN, Author, Title, or Genre");
  console.log("3. Issue Book");
  console.log("4. Return Book");
  console.log("5. Exit");
}

// Function to display all available books
function showAvailableBooks() {
  console.log("\nAvailable Books in the Library:");
  if (libraryData.size === 0) {
    console.log("No books available at the moment.");
  } else {
    libraryData.forEach((book, isbn) => {
      console.log(`\nTitle: ${book.title}`);
      console.log(`Author: ${book.author}`);
      console.log(`Genre: ${book.genre}`);
      console.log(`Year: ${book.year}`);
      console.log(`Quantity: ${book.quantity}`);
      console.log(`ISBN: ${isbn}`);
    });
  }
}

// Function to handle the user's menu choice
function handleChoice(choice) {
  switch (choice) {
    case "1":
      showAvailableBooks();
      displayMenuPrompt(); // After showing available books, show the menu again
      break;

    case "2":
      console.log("\nSearch by:");
      console.log("1. ISBN");
      console.log("2. Author Name");
      console.log("3. Book Name");
      console.log("4. Genre");

      rl.question("\nEnter your choice (1-4): ", (choice) => {
        let searchType;
        switch (choice) {
          case "1":
            searchType = SearchType.ISBN;
            break;
          case "2":
            searchType = SearchType.AUTHOR;
            break;
          case "3":
            searchType = SearchType.TITLE;
            break;
          case "4":
            searchType = SearchType.GENRE;
            break;
          default:
            console.log("Invalid choice.");
            displayMenuPrompt();
            return;
        }

        rl.question(
          `\nEnter ${searchType.toLowerCase()} to search: `,
          (searchQuery) => {
            try {
              const results = searchBooks(searchType, searchQuery, libraryData);
              if (results.length > 0) {
                results.forEach((book) => {
                  console.log(`\nBook Found: ${book.title}`);
                  console.log(`Author: ${book.author}`);
                  console.log(`Genre: ${book.genre}`);
                  console.log(`Year: ${book.year}`);
                  console.log(`Quantity: ${book.quantity}`);
                });
              } else {
                console.log("No matches found.");
              }
            } catch (error) {
              console.error(error.message);
            }
            displayMenuPrompt(); // Show the menu again after action
          }
        );
      });
      return; // Return to prevent `displayMenuPrompt` from executing twice

    case "3":
      console.log("\nSearch by:");
      console.log("1. ISBN");
      console.log("2. Author Name");
      console.log("3. Book Name");
      console.log("4. Genre");

      rl.question("\nEnter your choice (1-4): ", (choice) => {
        let searchType;
        switch (choice) {
          case "1":
            searchType = SearchType.ISBN;
            break;
          case "2":
            searchType = SearchType.AUTHOR;
            break;
          case "3":
            searchType = SearchType.TITLE;
            break;
          case "4":
            searchType = SearchType.GENRE;
            break;
          default:
            console.log("Invalid choice.");
            displayMenuPrompt();
            return;
        }

        rl.question(
          `\nEnter ${searchType.toLowerCase()} to search: `,
          (searchQuery) => {
            try {
              const results = searchBooks(searchType, searchQuery, libraryData);
              if (results.length > 0) {
                results.forEach((book) => {
                  console.log(`\nBook Found: ${book.title}`);
                  console.log(`Author: ${book.author}`);
                  console.log(`Genre: ${book.genre}`);
                  console.log(`Year: ${book.year}`);
                  console.log(`Quantity: ${book.quantity}`);
                });
                issueBook(rl).then(() => {
                  displayMenuPrompt(); // After issuing a book, show the menu again
                });
              } else {
                console.log("No matches found.");
                displayMenuPrompt(); // Show the menu again after action
              }
            } catch (error) {
              console.error(error.message);
              displayMenuPrompt(); // Show the menu again after action
            }
          }
        );
      });
      return; // Return to prevent `displayMenuPrompt` from executing twice

    case "4":
      bookReturn(rl, () => {
        displayMenuPrompt(); // After returning a book, show the menu again
      });
      return;

    case "5":
      rl.close(); // Close the readline interface
      break;

    default:
      console.log("Invalid choice, please try again.");
      displayMenuPrompt(); // After invalid choice, show the menu again
      break;
  }
}

// Function to prompt user for menu input
function displayMenuPrompt() {
  displayMenu(); // Display the menu each time before asking for user input
  rl.question("\nEnter your choice (1-5): ", handleChoice);
}

// Start the program
function startClientDashboard(user) {
  console.log(`Welcome to your dashboard, ${user.username}!`);
  displayMenuPrompt();
}

module.exports = startClientDashboard;
