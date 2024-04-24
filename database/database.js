// creating array of objects for instance as a dummy database
const books = [
  {
    ISBN: "12345B",
    title: "Full stack web development",
    pubDate: "2023-07-07",
    language: "en",
    numPage: 250,
    authors: [1,2],
    publications: [1],
    category: ["education", "technology", "computers"]
  }
]

const authors = [
  {
    id: 1,
    name: "Narayna",
    books: ["12345B", "secrete book"]
  },
  {
    id: 2,
    name: "Sri",
    books: ["12345B"]
  }
]

const publications = [
  {
    id: 1,
    name: "S.Chand",
    books: ["12345B"]
  },
  {
    id: 2,
    name: "Lucent",
    books: []
  }
]

module.exports = {books, authors, publications};
