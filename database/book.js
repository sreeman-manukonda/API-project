const mongoose = require("mongoose");

// create book schema
const BookSchema = mongoose.schema(
  {
    ISBN: String,
    title: String,
    pubDate: String,
    language: String,
    numPage: Number,
    authors: [Number],
    publications: [Number],
    category: [String]
  }
);

const BookModel = mongoose.model("books", BookSchema);

module.exports = BookModel;
