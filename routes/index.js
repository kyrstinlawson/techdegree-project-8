var express = require('express');
var router = express.Router();
const {Op} = require("sequelize");
const { Book } = require("../models");

// Handler function to wrap around each route
function asyncHandler(cb) {
  return async(req, res, next) => {
    try {
      await cb(req, res, next)
    } catch(error){
      next(error);
    }
  }
};

/* GET home page. */
router.get("/", (req, res) => {
  res.redirect("/books");
});

// Show full list of books
router.get("/books", asyncHandler(async (req, res) => {
  const books = await Book.findAll();
  res.render("index", {title: "Books", books: books});
}));

// Shows create new books form
router.get("/books/new", (req, res) => {
  res.render("new-book", {book: {}, title: "New Book"});
});

// Posts a new book to the database
router.post("/books/new", asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("new-book", {book, errors: error.errors, title: "New Book"});
    } else {
      throw error;
    }
  }
}));

// Shows book detail form
router.get("/books/:id", asyncHandler(async (req, res) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("update-book", {book, title: book.title})
  } else {
    const err = new Error();
    err.status = 404;
    res.render("page-not-found", {title: "Page Not Found", err});
  }
}));

// Updates book info
router.post("/books/:id", asyncHandler(async (req, res) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/");
    } else {
      const err = new Error();
      err.status = 404;
      res.render("page-not-found", {title: "Page Not Found", err});
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book", {book, errors: error.errors, title: book.title})
    } else {
      res.sendStatus(404);
    }
  }
}));

module.exports = router;
