const express = require('express');
let books = require("./booksdb.js");
const { users } = require('./auth_users.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if(username&password){
    if(isValid(username)){
      users.push({
        "username":username,
        "password":password,
      });
      return res.send(`User ${username} registered successfully!`);
    }else{
      return res.send("Username already exists")
    }
  }else{
    return res.send("Error registering user")
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  
  return res.send(JSON.stringify(books,null));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here

  return res.send(JSON.stringify(books[req.params.isbn]));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let filtered_books = Object.values(books).filter((book)=>book.author===author);
  if(filtered_books.length>0){
    res.send(JSON.stringify(filtered_books));
  }else{
    res.send(`Books by ${author} not found!`)
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let filtered_books = Object.values(books).filter((book)=>book.title===title);
  if(filtered_books.length>0){
    res.send(JSON.stringify(filtered_books));
  }else{
    res.send(`Books by ${title} not found!`)
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let book = books[isbn];
  return res.send(JSON.stringify(book.reviews));
});

module.exports.general = public_users;
