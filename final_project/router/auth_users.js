const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let filtered_users = Object.values(users).filter(user=>user.username===username);
  if(filtered_users.length>0){
    return false;
  }else{
    return true;
  }

}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = Object.values(users).filter((user)=>{
    return (user.username===username && user.password===password)
  }); 
  if(validusers.length>0){
    return true;
  }
  else{
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;
  if(!username || !password){
    return res.status(404).json({message:"Error Loggin in"})
  }
  if(authenticatedUser(username,password)){
    let accessToken = jwt.sign({
      data:password
    },'access',{expiresIn: 60*60});
    req.session.authorization = {
      accessToken,username
    }
    return res.status(200).send("User successfully logged in!")
  }else{
    res.send("Error with username or password!")
  }
  return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let book = books[isbn];
  let reviews = book.reviews;
  let review = req.query.review;
  let hasReviewed = reviews.hasOwnProperty(username);
  if(hasReviewed){
    reviews[username].review = review;
    books[isbn].reviews=reviews;
    return res.send(`Previous review by ${username} has been edited`)
  }else{
    reviews[username]={
      "username":username,
      "review":review,
    };
    books[isbn].reviews=reviews;
    res.send(`Review by ${username} has been posted successfully`)
  }
  res.send('Book review failed: Err')
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  let book = books[isbn];
  let reviews = book.reviews;
  let hasReviewed = reviews.hasOwnProperty(username);
  if(hasReviewed){
    delete reviews[username];
    books[isbn].reviews=reviews;
    return res.send(`Review by ${username} has been deleted`)
  }else{
    return res.status(404).send("The review does not exist!");
  }
  res.send("Error deleting review");

});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
