//Book Class: This class represents a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//UI Class: This class is responsible for UI tasks

class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {

        const bklist = document.querySelector('#tbdy');
        const tblRow = document.createElement('tr');
        tblRow.innerHTML = `
       <td>${book.title}</td>
       <td>${book.author}</td>
       <td>${book.isbn}</td>
       <td id="dbtn"><a href="#"><img class="delete"  src="/img/delete.png" alt=""></a></td>`;

        bklist.appendChild(tblRow);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteTableRows(target) {

        if (target.classList.contains('delete'))
            target.parentElement.parentElement.parentElement.remove();
        UI.showAlert(`Book deleted successfully!`, 'success')

    }

    //Method written for showing the alerts!
    static showAlert(message, className) {

        let div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const logoDiv = document.getElementById('logo');
        // console.log(logoDiv);

        const form = document.getElementById('book-submit-form');
        logoDiv.insertBefore(div, form)

        //For vanishing after a certain period of time:
        setTimeout(() => {

            let alertDiv = document.querySelector('.alert');
            alertDiv.remove();
        }, 1500)
    }
}
//Store Class: Handles storage

class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];

        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book) {

        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }

        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Add a book
const formInfo = document.getElementById('book-submit-form');


formInfo.addEventListener('submit', (formEvent) => {

    formEvent.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    // Adding the validations for no submission if any of the fields are empty:

    if (title === '' || author === '' || isbn === '') {

        // console.log(UI.showAlert(`Please provide all the fields!`, 'danger'));
        UI.showAlert(`Please provide all the fields!`, 'danger')
    }
    else {


        //Instantiate a book 
        const book = new Book(title, author, isbn);
        // console.log(book);
        //This method adds the book to the UI
        UI.addBookToList(book);
        //Add book to localStorage:
        Store.addBook(book);

        //Show by an alert that books have been added to the Book successfully!
        UI.showAlert(`Book added successfully!`, 'success')
        //Clearing the fields:
        UI.clearFields();
    }

});
//Event: Display a book
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Remove a book from UI

document.querySelector('#tbdy').addEventListener('click', (tblEvent) => {

    // console.log(tblEvent.target);
    UI.deleteTableRows(tblEvent.target);

    //Method to remove a book from localstorage:
    console.log(tblEvent.target.parentElement.parentElement.previousElementSibling.textContent);
    Store.removeBook(tblEvent.target.parentElement.parentElement.previousElementSibling.textContent);

});
