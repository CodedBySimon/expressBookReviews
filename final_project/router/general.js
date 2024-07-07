const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios'); // Import Axios for external API requests

const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here

  let myPromise = new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve("Promise resolved")
    },6000)})
//Console log before calling the promise
console.log("Before calling promise");
//Call the promise and wait for it to be resolved and then print a message.
myPromise.then((successMessage) => {
    console.log("From Callback " + successMessage)
    console.log(JSON.stringify(books));
    res.send(JSON.stringify(books));
  })
//Console log after calling the promise
  console.log("After calling promise");

  //res.send(JSON.stringify(books,null,4));  
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Write your code here

  let myPromise = new Promise((resolve, reject) => {
      const isbn = req.params.isbn;
      if (books[isbn]) {
        resolve(books[isbn]);
      } else {
        reject({ message: "ISBN not in Database" });
      }
    
  });
  // Console log before calling the promise
  console.log("Before calling promise");
  // Call the promise and wait for it to be resolved or rejected
  myPromise
    .then((bookDetails) => {
      console.log("From Callback: Promise resolved");
      res.send(bookDetails);
    })
    .catch((error) => {
      console.log("From Callback: Promise rejected");
      res.status(404).json(error);
    });

  // Console log after calling the promise
  console.log("After calling promise");

  // return res.status(300).json({ message: "Yet to be implemented" });
});
  
// Get book details based on author
public_users.get('/author/:author',async(req, res)=> {
  //Write your code here
  try {
    const author = req.params.author;
    const matchingBooks = [];
    for (const bookId in books) {
      if (books[bookId].author === author) {
        matchingBooks.push(books[bookId]);
      }
    }
    if (matchingBooks.length > 0) {
      console.log("success");
      res.send(matchingBooks);
    } else {
      throw { message: "Author not in Database" };
    }
  } catch (error) {
    console.log("From Callback: Promise rejected");
    res.status(404).json(error);
  }

  //code with promisese
//   public_users.get('/author/:author',function (req, res) {
//   let myPromise = new Promise((resolve, reject) => {
//     const author = req.params.author;
//     // const matchingBooks = Object.values(books).filter((book)=>book.author === author);
//     // res.send(matchingBooks);
  
//     const matchingBooks = [];
//     for (const bookId in books) {
//       if (books[bookId].author === author) {
//           matchingBooks.push(books[bookId]);
//       }
//   }
//     if (matchingBooks.length > 0) {
//       resolve(matchingBooks);
//     } else {
//       reject({ message: "Author not in Database" });
//     }
  
// });
// // Console log before calling the promise
// console.log("Before calling promise");
// // Call the promise and wait for it to be resolved or rejected
// myPromise
//   .then((bookDetails) => {
//     console.log("From Callback: Promise resolved");
//     res.send(bookDetails);
//   })
//   .catch((error) => {
//     console.log("From Callback: Promise rejected");
//     res.status(404).json(error);
//   });

// // Console log after calling the promise
// console.log("After calling promise");

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;

  const findMatchingBooks = new Promise((resolve, reject) => {
    const matchingBooks = [];
    for (const bookId in books) {
      if (books[bookId].title === title) {
        matchingBooks.push(books[bookId]);
      }
    }
    if (matchingBooks.length > 0) {
      resolve(matchingBooks); // Resolve with matching books
    } else {
      reject({ message: "Book not found" }); // Reject with error message
    }
  });

  findMatchingBooks
    .then((matchingBooks) => {
      console.log("Found matching books");
      res.send(matchingBooks);
    })
    .catch((error) => {
      console.error("Error finding books:", error.message);
      res.status(404).json({ message: "Book not found" }); // Consistent error response
    });

  // const title = req.params.title;
  // const matchingBooks = [];
  // for (const bookId in books) {
  //     if (books[bookId].title === title) {
  //         matchingBooks.push(books[bookId]);
  //     }
  // }

  // return res.send(matchingBooks);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let review = books[isbn].reviews;

  res.send(JSON.stringify(review,null,4));
});

module.exports.general = public_users;
