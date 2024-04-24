const mongoose = require("mongoose");

// create Author schema
const AuthorSchema = mongoose.schema(
  {
    id: Number,
    name: String,
    books: [String]
  }
);

const AuthorModel = mongoose.model("authors", AuthorSchema);

module.exports = AuthorModel;
