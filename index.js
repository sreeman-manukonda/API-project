require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
var bodyParser = require("body-parser");
// Database
const database = require("./database/database");

// Models
const BookModel = require("/database/book");
const AuthorModel = require("/database/author");
const PublicationModel = require("/database/publication");

// Initilising express
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URL,
{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
}
).then(() => console.log("Connection established"));


/*
Route             /
Description       Get all the books
Access            PUBLIC
Parameter         None
Methods           GET
*/
booky.get("/", async(req,res) => {
  const getAllBooks = await BookModel.find();
  return res.json(getAllBooks);
});

// booky.get("/", (req,res) => {
//   return res.json({authors: database.authors});
// });


/*
Route             /is
Description       Get specific book
Access            PUBLIC
Parameter         isbn
Methods           GET
*/
booky.get("/is/:isbn", async(req,res) => {
  const getSpecificBook = await BookModel.findOne({ISBN: req.params.isbn});

  // null !0=1(true), !1=0(false)
  if(!getSpecificBook) {
    return res.json({error: `No book found to ISBN of ${req.params.isbn}`});
  }
  return res.json({book: getSpecificBook});
});


/*
Route             /c
Description       Get specific book by category
Access            PUBLIC
Parameter         category
Methods           GET
*/
booky.get("/c/:category", async(req,res) => {
  const getSpecificBook = await BookModel.findOne({category: req.params.category});

  // null !0=1(true), !1=0(false)
  if(!getSpecificBook) {
    return res.json({error: `No book found to ISBN of ${req.params.category}`});
  }
  return res.json({book: getSpecificBook});
});

// AUTHORS

/*
Route             /authors
Description       Get all the authors
Access            PUBLIC
Parameter         None
Methods           GET
*/

booky.get("/authors", async(req,res) => {
  const getALLAuthors = await AuthorModel.find();
  return res.json(getALLAuthors);
});

/*
Route             /c
Description       Get specific book by category
Access            PUBLIC
Parameter         category
Methods           GET
*/
booky.get("/authors/book/:isbn", (req,res) => {
  const getSpecificAuthor = database.authors.filter((author) => author.books.includes(req.params.isbn));
  if(getSpecificAuthor.length === 0) {
    return res.json({error: `No author found for the book of ISBN ${req.params.isbn}`});
  }
  return res.json({author: getSpecificAuthor});
});

// PUBLICATIONS

/*
Route             /publications
Description       Get all the publications
Access            PUBLIC
Parameter         None
Methods           GET
*/

booky.get("/publications", async(req,res) => {
  const getAllPublications = await PublicationModel.find();
  return res.json(getAllPublications);
});

// POST

/*
Route             /book/new
Description       Add new books
Access            PUBLIC
Parameter         None
Methods           POST
*/

booky.post("/book/new", (req,res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks: database.books});
})

/*
Route             /author/new
Description       Add new authors
Access            PUBLIC
Parameter         None
Methods           POST
*/

booky.post("/author/new", (req,res) => {
  const newAuthor = req.body;
  database.authors.push(newAuthor);
  return res.json({updatesAuthors: database.authors});
})

/*
Route             /publication/new
Description       Add new publications
Access            PUBLIC
Parameter         None
Methods           POST
*/

booky.post("/publication/new", (req,res) => {
  const newPublication = req.body;
  database.publications.push(newPublication);
  return res.json(database.publications);
})


/*
Route             /publications/update/book/:isbn
Description       Update(PUT) or Add new publications
Access            PUBLIC
Parameter         isbn
Methods           PUT
*/
booky.put("/publications/update/book/:isbn", (req,res) => {
  // Update the publiations database
  database.publications.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });
  // Update the book database
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });
  return res.json(
    {
      books: database.books,
      publications: database.publications,
      message: "Successfully updated the publications"
    }
  );
});


/*        DELETE request           */
/*
Route             /book/delete/:isbn
Description       Delete a book
Access            PUBLIC
Parameter         isbn
Methods           DELETE
*/
booky.delete("/book/delete/:isbn", (req,res) => {
  //whichever book matched with given isbn that wil be added to updatedBookDatabase
 // & remaining will be filtered & deleted.
 const updatedBookDatabase = database.books.filter(
   (book) => book.ISBN !== req.params.isbn);
   database.books = updatedBookDatabase;
   return res.json({updatedBookDatabase: database.books});
});


/*
Route             /book/delete/author/
Description       Delete author from book & vice-versa
Access            PUBLIC
Parameter         isbn, authorId
Methods           DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  // Update book database(deleting author from book)
  database.books.forEach((book) => {
    if(book.ISBN === req.params.isbn) {
      const newAuthorList = book.authors.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId));
        book.authors = newAuthorList;
        return;
    }
  });
  // Update author database(deleting book from author)
  database.authors.forEach((author) => {
    if (author.id === parseInt(req.params.authorId)) {
      const newBookList = author.books.filter(
        (eachBook) => eachBook !== req.params.isbn);
        author.books = newBookList;
        return;
    }
  });
  return res.json({
    books: database.books,
    authors: database.authors,
    message: "Successfully, author is deleted from book."
  });
});



booky.listen(3000, () => {
  console.log("Server is up & running");
});
