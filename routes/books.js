/** Routes for books in bookstore. */

const express = require("express");
const router = new express.Router();

const { validate } = require("jsonschema");
const bookSchemaNew = require("../schemas/bookSchemaNew");
const bookSchemaUpdate = require("../schemas/bookSchemaUpdate");
const Book = require("../models/book");

/** GET / => {books: [book, ...]} */
router.get("/", async (req, res, next) => {
  try {
    const books = await Book.findAll(req.query);
    res.json({ books });
  } catch (err) {
    next(err);
  }
});

/** GET /[isbn] => {book: book} */
router.get("/:isbn", async (req, res, next) => {
  try {
    const book = await Book.findOne(req.params.isbn);
    res.json({ book });
  } catch (err) {
    next(err);
  }
});

/** POST / => {book: newBook} */
router.post("/", async (req, res, next) => {
  try {
    const validation = validate(req.body, bookSchemaNew);
    if (!validation.valid) {
      return next({
        status: 400,
        errors: validation.errors.map(e => e.stack),
      });
    }
    const book = await Book.create(req.body);
    res.status(201).json({ book });
  } catch (err) {
    next(err);
  }
});

/** PUT /[isbn] => {book: updatedBook} */
router.put("/:isbn", async (req, res, next) => {
  try {
    if ("isbn" in req.body) {
      return next({
        status: 400,
        message: "Not allowed to update ISBN",
      });
    }
    const validation = validate(req.body, bookSchemaUpdate);
    if (!validation.valid) {
      return next({
        status: 400,
        errors: validation.errors.map(e => e.stack),
      });
    }
    const book = await Book.update(req.params.isbn, req.body);
    res.json({ book });
  } catch (err) {
    next(err);
  }
});

/** DELETE /[isbn] => {message: "Book deleted"} */
router.delete("/:isbn", async (req, res, next) => {
  try {
    await Book.remove(req.params.isbn);
    res.json({ message: "Book deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
z
