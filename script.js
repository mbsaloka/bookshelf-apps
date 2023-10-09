const storageKey = "STORAGE_KEY";
const submitAction = document.getElementById("inputBook");
const searchAction = document.getElementById("searchBook");

window.addEventListener("load", function () {
  if (checkForStorage) {
    if (localStorage !== null) {
      renderBookList();
    } else {
      this.alert("Browser tidak mendukung");
    }
  }
});

function checkForStorage() {
  return typeof Storage !== "undefined";
}

function putBookList(data) {
  if (checkForStorage) {
    let userData = [];
    if (localStorage.getItem(storageKey) !== null) {
      userData = JSON.parse(localStorage.getItem(storageKey));
    }

    userData.unshift(data);
    localStorage.setItem(storageKey, JSON.stringify(userData));
  }
}

function getBookList() {
  if (checkForStorage) {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } else {
    return [];
  }
}

function renderBookList() {
  const bookData = getBookList();
  const bookListIncomplete = document.getElementById("incompleteBookshelfList");
  const bookListComplete = document.getElementById("completeBookshelfList");

  for (let book of bookData) {
    let bookItem = document.createElement("article");
    bookItem.setAttribute("id", book.id);
    bookItem.classList.add("book_item");
    bookItem.innerHTML = "<h3>" + book.title + "</h3>";
    bookItem.innerHTML += "<p>Penulis: " + book.author + "</p>";
    bookItem.innerHTML += "<p>Tahun: " + book.year + "</p>";

    let actionButton = document.createElement("div");
    let greenButton = document.createElement("button");
    let redButton = document.createElement("button");
    let blueButton = document.createElement("button");
    actionButton.classList.add("action");
    greenButton.classList.add("green");
    redButton.classList.add("red");
    blueButton.classList.add("blue");
    redButton.innerText = "Hapus buku";
    blueButton.innerText = "Edit buku";

    if (book.isComplete) {
      greenButton.innerText = "Belum Selesai dibaca";
      bookListComplete.appendChild(bookItem);
      actionButton.appendChild(greenButton);
      actionButton.appendChild(redButton);
      actionButton.appendChild(blueButton);
      bookItem.appendChild(actionButton);
    } else {
      greenButton.innerText = "Selesai dibaca";
      bookListIncomplete.appendChild(bookItem);
      actionButton.appendChild(greenButton);
      actionButton.appendChild(redButton);
      actionButton.appendChild(blueButton);
      bookItem.appendChild(actionButton);
    }
  }
}

submitAction.addEventListener("submit", function () {
  const inputTitle = document.getElementById("inputBookTitle").value;
  const inputAuthor = document.getElementById("inputBookAuthor").value;
  const inputYear = document.getElementById("inputBookYear").value;
  const inputIsComplete = document.getElementById("inputBookIsComplete").checked;

  const newBookData = {
    id: +new Date(),
    title: inputTitle,
    author: inputAuthor,
    year: inputYear,
    isComplete: inputIsComplete,
  };

  putBookList(newBookData);
  renderBookList();
});

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("red")) {
    const bookElement = event.target.closest(".book_item");
    let isRemove = confirm(`Apakah Anda yakin ingin menghapus buku "${bookElement.querySelector("h3").innerText}"?`);
    if (isRemove) {
      const bookId = bookElement.getAttribute("id");
      bookElement.remove();

      let bookData = JSON.parse(localStorage.getItem(storageKey));
      bookData = bookData.filter((book) => book.id != bookId);

      localStorage.setItem(storageKey, JSON.stringify(bookData));
    }
  }

  if (event.target.classList.contains("green")) {
    const bookElement = event.target.closest(".book_item");
    const bookId = bookElement.getAttribute("id");

    const newBookElement = bookElement;
    const greenButton = newBookElement.querySelector(".green");
    bookElement.remove();

    let bookData = JSON.parse(localStorage.getItem(storageKey));
    for (let book of bookData) {
      if (book.id == bookId) {
        if (book.isComplete) {
          const bookListIncomplete = document.getElementById("incompleteBookshelfList");
          bookListIncomplete.appendChild(newBookElement);
          greenButton.innerText = "Selesai dibaca";
        } else {
          const bookListComplete = document.getElementById("completeBookshelfList");
          bookListComplete.appendChild(newBookElement);
          greenButton.innerText = "Belum Selesai dibaca";
        }
        book.isComplete = !book.isComplete;
        break;
      }
    }

    localStorage.setItem(storageKey, JSON.stringify(bookData));
  }

  if (event.target.classList.contains("blue")) {
    if (document.getElementById("editBook") === null) {
      const bookElement = event.target.closest(".book_item");

      renderEditForm(bookElement);
    }
  }
});

searchAction.addEventListener("submit", function (event) {
  event.preventDefault();
  const inputSearch = document.getElementById("searchBookTitle").value.toLowerCase();
  const bookData = JSON.parse(localStorage.getItem(storageKey));
  for (let book of bookData) {
    const bookTitle = book.title.toLowerCase();
    const bookElement = document.getElementById(book.id);
    if (!bookTitle.includes(inputSearch)) {
      bookElement.setAttribute("hidden", true);
    } else {
      bookElement.removeAttribute("hidden");
    }
  }
});

let bookIdForEdit;
function renderEditForm(bookElement) {
  bookIdForEdit = bookElement.getAttribute("id");

  let editSection = document.createElement("section");
  editSection.classList.add("input_section");
  editSection.classList.add("edit_section");
  editSection.innerHTML = "<h3>Edit Info Buku</h3>";

  let editForm = document.createElement("form");
  editForm.setAttribute("id", "editBook");
  editForm.classList.add("editForm");

  let editSpace = document.createElement("div");
  editSpace.classList.add("input");
  let editLabel = document.createElement("label");
  editLabel.setAttribute("for", "editBookTitle");
  editLabel.innerText = "Judul";
  let editInput = document.createElement("input");
  editInput.setAttribute("id", "editBookTitle");
  editInput.setAttribute("type", "text");
  editInput.setAttribute("value", bookElement.querySelector("h3").innerText);
  editInput.setAttribute("required", "true");

  editSpace.appendChild(editLabel);
  editSpace.appendChild(editInput);
  editForm.appendChild(editSpace);

  editSpace = document.createElement("div");
  editSpace.classList.add("input");
  editLabel = document.createElement("label");
  editLabel.setAttribute("for", "editBookAuthor");
  editLabel.innerText = "Penulis";
  editInput = document.createElement("input");
  editInput.setAttribute("id", "editBookAuthor");
  editInput.setAttribute("type", "text");
  editInput.setAttribute("value", bookElement.querySelectorAll("p")[0].innerText.substring(9));
  editInput.setAttribute("required", "true");

  editSpace.appendChild(editLabel);
  editSpace.appendChild(editInput);
  editForm.appendChild(editSpace);

  editSpace = document.createElement("div");
  editSpace.classList.add("input");
  editLabel = document.createElement("label");
  editLabel.setAttribute("for", "editBookYear");
  editLabel.innerText = "Tahun";
  editInput = document.createElement("input");
  editInput.setAttribute("id", "editBookYear");
  editInput.setAttribute("type", "number");
  editInput.setAttribute("value", bookElement.querySelectorAll("p")[1].innerText.substring(7));
  editInput.setAttribute("required", "true");

  editSpace.appendChild(editLabel);
  editSpace.appendChild(editInput);
  editForm.appendChild(editSpace);

  let editButtonSubmit = document.createElement("button");
  editButtonSubmit.setAttribute("id", "editSubmit");
  editButtonSubmit.setAttribute("type", "submit");
  editButtonSubmit.innerText = "Simpan";

  editForm.appendChild(editButtonSubmit);

  editSection.appendChild(editForm);
  bookElement.appendChild(editSection);
}

document.addEventListener("submit", function (event) {
  if (event.target.classList.contains("editForm")) {
    const editTitle = document.getElementById("editBookTitle").value;
    const editAuthor = document.getElementById("editBookAuthor").value;
    const editYear = document.getElementById("editBookYear").value;

    let bookList = JSON.parse(localStorage.getItem(storageKey));
    let previousBookData;
    for (let book of bookList) {
      if (bookIdForEdit == book.id) {
        previousBookData = book;
        break;
      }
    }

    const newBookData = {
      id: previousBookData.id,
      title: editTitle,
      author: editAuthor,
      year: editYear,
      isComplete: previousBookData.isComplete,
    };

    bookList = bookList.filter((book) => book.id != bookIdForEdit);
    console.log(bookList);
    localStorage.setItem(storageKey, JSON.stringify(bookList));

    putBookList(newBookData);
    renderBookList();
  }
});
