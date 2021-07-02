let form = document.querySelector(".input-section");
let bookGrid = document.querySelector('.book-grid');
let cover = document.querySelector('#cover');
let myLibrary = [];
let booksFinished = 0;
let totalPagesRead = 0;

//Book constructor
function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
}

//adds new book to library
function addBookToLibrary(e) {
  e.preventDefault(); //so the submit button doesn't refresh page
  myLibrary.push(newCard()); //adds book to library
  saveToStorage(); //saves updated library array to storage
  displayBooks(); //updates book display
  updateStats();  
  closeForm();
}

//updates library details
const updateStats = () => {
  let booksInLibrary = document.querySelector('#num-books');
  let booksRead = document.querySelector('#books-finished');
  let totalRead = document.querySelector('#total-pages-read');

  booksInLibrary.textContent = `${myLibrary.length}`;
  booksRead.textContent = booksFinished;
  totalRead.textContent = totalPagesRead;
}

//saves current library array to storage
const saveToStorage = () => {
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

//creates a new book
const newCard = () => {
  let form = document.querySelector('form');

  let title = form.elements[0].value;
  let author = form.elements[1].value;
  let pages = form.elements[2].value;
  let read = form.elements[3].checked;

  let newBook = new Book(title, author, pages, read);
  return newBook;
}

//displays library books
const displayBooks = () => {
  //first, clear all books from screen
  const bookGrid = document.querySelector('.book-grid');
  const books = document.querySelectorAll('.book-info');
  books.forEach(book => bookGrid.removeChild(book));
  //set variables to zero for fresh count
  booksFinished = 0;
  totalPagesRead = 0;

  //goes through library array and displays each
  for (let i = 0; i < myLibrary.length; i++) {
    createBook(myLibrary[i]);
  }
  //stats updated
  updateStats();
}

const createBook = (item) => {
  //creates book in DOM
  let bookInfo = document.createElement('div');
  let removeBook = document.createElement('div');
  let span1 = document.createElement('span');
  let span2 = document.createElement('span');
  let background = document.createElement('div');
  let titleAuthor = document.createElement('div');
  let title = document.createElement('span');
  let author = document.createElement('span');
  let pagesRead = document.createElement('div');
  let pages = document.createElement('span');
  let read = document.createElement('span');

  bookInfo.classList.add('book-info');
  bookInfo.setAttribute('id', myLibrary.indexOf(item));

  removeBook.classList.add('remove-book');
  bookInfo.appendChild(removeBook);

  span1.setAttribute('class', 'x one');
  span2.setAttribute('class', 'x two');
  removeBook.appendChild(span1);
  removeBook.appendChild(span2);

  background.setAttribute('id', 'background');
  bookInfo.appendChild(background);

  titleAuthor.setAttribute('id', 'title-author');
  background.appendChild(titleAuthor);

  title.classList.add('title');
  title.textContent = item.title;
  titleAuthor.appendChild(title);

  author.classList.add('author');
  author.innerHTML = `by <br><br> ${item.author}`;
  titleAuthor.appendChild(author);

  pagesRead.setAttribute('id', 'pages-read');
  background.appendChild(pagesRead);

  pages.setAttribute('class', 'pages');
  pages.textContent = `${item.pages} pages read`;
  pagesRead.appendChild(pages);

  read.setAttribute('class', 'read');
  pagesRead.appendChild(read);

  if (item.read) {
    read.textContent = "finished";
    read.setAttribute('id', 'green');
    booksFinished++;
    totalPagesRead += Number(item.pages);
  } else {
    read.textContent = "not finished";
    read.setAttribute('id', 'red');
    totalPagesRead += Number(item.pages);
  }

  bookGrid.appendChild(bookInfo);


  //creates toggle read button
  const toggleRead = (e) => {
    if (e.target.textContent === 'finished') {
      e.target.textContent = 'not finished';
      e.target.setAttribute('id', 'red');
      item.read = !item.read;
      booksFinished--;
    } else {
      e.target.textContent = 'finished';
      e.target.setAttribute('id', 'green');
      item.read = !item.read;
      booksFinished++;
    }
    saveToStorage();
    updateStats();
  }
  
  read.addEventListener('click', toggleRead);
  
  //creates button to delete book
  const deleteBook = () => {
    myLibrary.splice(myLibrary.indexOf(item),1);
    totalPagesRead -= Number(item.pages);
    displayBooks();
    saveToStorage();
  }

  removeBook.addEventListener('click', deleteBook);
}

const openForm = () => {
  form.style.display = "flex";
  cover.classList.add('cover');
}

const closeForm = () => {
  form.style.display = "none";
  cover.classList.remove('cover');
}

//checks local storage when webpage loads, populates display
const restore = () => {
  if (!localStorage.myLibrary) {
    displayBooks();
  } else {
    let objects = localStorage.getItem('myLibrary');
    objects = JSON.parse(objects);
    myLibrary = objects;
    displayBooks();
  }
}

let addBookButton = document.querySelector("#add-book");
addBookButton.addEventListener('click', openForm);

let close = document.querySelector('#close');
close.addEventListener('click', closeForm);

let submit = document.querySelector('#submit');
submit.addEventListener('click', addBookToLibrary);
submit.addEventListener('mouseup', closeForm);
form.addEventListener("keydown", (e) => {
  if (e.key === "Enter") addBookToLibrary();
});
window.addEventListener('keydown', (e) => {
  if (e.key === "Escape") closeForm();
});

restore();
