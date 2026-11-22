
const themeButton = document.getElementById("themeBtn");

function setTheme(theme) {

  document.documentElement.setAttribute("data-bs-theme", theme);

  if (theme === "dark") {
    document.body.classList.add("dark");
    themeButton.textContent = "Light mode";
  } else {
    document.body.classList.remove("dark");
    themeButton.textContent = "Dark mode";
  }
}

let savedTheme = localStorage.getItem("theme");
if (savedTheme === null) {
  savedTheme = "light";
}
setTheme(savedTheme);

themeButton.addEventListener("click", function () {
  let newTheme = "dark";
  if (document.body.classList.contains("dark")) {
    newTheme = "light";
  }
  setTheme(newTheme);
  localStorage.setItem("theme", newTheme);
});


function showError(id, message) {
  document.getElementById(id).classList.add("is-invalid");
  document.getElementById(id + "Error").textContent = message;
}

function clearError(id) {
  document.getElementById(id).classList.remove("is-invalid");
  document.getElementById(id + "Error").textContent = "";
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const bookForm = document.getElementById("bookForm");
if (bookForm) {

  function calculateCost() {
    let people = Number(document.getElementById("guests").value);
    let nights = Number(document.getElementById("nights").value);
    if (people < 0) { 
      people = 0; 
    }
    if (nights < 0) {
     nights = 0; 
   }

    const activityPrice = Number(document.getElementById("activity").value);
    const stayPrice = Number(document.getElementById("stay").value);

    const activityCost = activityPrice * people;
    const stayCost = stayPrice * people * nights;
    const total = activityCost + stayCost;

    document.getElementById("costActivity").textContent = "M " + activityCost.toFixed(2);
    document.getElementById("costStay").textContent = "M " + stayCost.toFixed(2);
    document.getElementById("costTotal").textContent = "M " + total.toFixed(2);
  }


  bookForm.addEventListener("input", calculateCost);

  bookForm.addEventListener("reset", function () {
  
    setTimeout(calculateCost, 0);
    document.getElementById("bookSuccess").classList.add("d-none");
    const ids = ["bName", "bEmail", "bPhone", "bDate", "activity", "guests"];
    for (let i = 0; i < ids.length; i++) {
      clearError(ids[i]);
    }
  });

  bookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("bName").value.trim();
    const email = document.getElementById("bEmail").value.trim();
    const phone = document.getElementById("bPhone").value.trim();
    const date = document.getElementById("bDate").value;
    const activity = document.getElementById("activity").value;
    const guests = Number(document.getElementById("guests").value);

    let ok = true;

    if (name.length < 3) {
      showError("bName", "Please enter your full name (at least 3 letters).");
      ok = false;
    } else {
      clearError("bName");
    }

    if (!isValidEmail(email)) {
      showError("bEmail", "Please enter a valid email, like name@gmail.com.");
      ok = false;
    } else {
      clearError("bEmail");
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date === "") {
      showError("bDate", "Please choose your arrival date.");
      ok = false;
    } else if (new Date(date + "T00:00:00") < today) {
      showError("bDate", "The arrival date cannot be in the past.");
      ok = false;
    } else {
      clearError("bDate");
    }

    if (activity === "") {
      showError("activity", "Please choose an activity.");
      ok = false;
    } else {
      clearError("activity");
    }

    if (guests < 1 || guests > 30) {
      showError("guests", "Number of people must be between 1 and 30.");
      ok = false;
    } else {
      clearError("guests");
    }

    const success = document.getElementById("bookSuccess");
    if (ok) {
      bookForm.reset();  
      success.textContent = "Thank you, " + name + "! Your booking request has been received. We will contact you to confirm.";
      success.classList.remove("d-none");
    } else {
      success.classList.add("d-none");
    }
    alert("Thank you, " + name + "! Your booking has been received.");
  });
}

const contactForm = document.getElementById("contactForm");

if (contactForm) {

  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("cName").value.trim();
    const email = document.getElementById("cEmail").value.trim();
    const subject = document.getElementById("cSubject").value.trim();
    const message = document.getElementById("cMessage").value.trim();

    let ok = true;

    if (name.length < 3) {
      showError("cName", "Please enter your name (at least 3 letters).");
      ok = false;
    } else {
      clearError("cName");
    }

    if (!isValidEmail(email)) {
      showError("cEmail", "Please enter a valid email, like name@gmail.com.");
      ok = false;
    } else {
      clearError("cEmail");
    }

    if (subject === "") {
      showError("cSubject", "Please type a subject.");
      ok = false;
    } else {
      clearError("cSubject");
    }

    if (message.length < 10) {
      showError("cMessage", "Your message must be at least 10 characters.");
      ok = false;
    } else {
      clearError("cMessage");
    }

    const success = document.getElementById("messageSuccess");
    if (ok) {
      contactForm.reset();
      success.textContent = "Thank you, " + name + "! Your message has been sent. We will reply soon.";
      success.classList.remove("d-none");
    } else {
      success.classList.add("d-none");
    }
  });
}

const searchBox = document.getElementById("searchBox");

if (searchBox) {
  const cards = document.querySelectorAll(".card-grid .card");
  const buttons = document.querySelectorAll(".filter-btn");
  const noResults = document.getElementById("noResults");
  let chosenCategory = "All";

  function showCards() {
    const searchText = searchBox.value.toLowerCase();
    let found = 0;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      const category = card.querySelector(".badge").textContent;

      const matchesCategory = (chosenCategory === "All" || category === chosenCategory);
      const matchesSearch = card.textContent.toLowerCase().includes(searchText);

      if (matchesCategory && matchesSearch) {
        card.classList.remove("d-none"); 
        found++;
      } else {
        card.classList.add("d-none");   
      }
    }
      
    if (found === 0) {
      noResults.classList.remove("d-none");
    } else {
      noResults.classList.add("d-none");
    }
  }

  searchBox.addEventListener("input", showCards);

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      chosenCategory = buttons[i].getAttribute("data-category");

      for (let j = 0; j < buttons.length; j++) {
        buttons[j].classList.remove("btn-dark");
        buttons[j].classList.add("btn-secondary");
      }
      buttons[i].classList.remove("btn-secondary");
      buttons[i].classList.add("btn-dark");

      showCards();
    });
  }
}
