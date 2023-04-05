"use strict";

const logInForm = document.querySelector("#login");
const signUpForm = document.querySelector("#sign-up");
const signUpNowScrollTo = document.querySelector(".sign-up-hyperlink");
const signUpSect = document.querySelector("#create-acc-btn");
const signInContinueBtn = document.querySelector("create-acc-btn");
const guestSignInHyperLink = document.querySelector("#guest-hyperlink");
let elSectCoords = signUpSect.getBoundingClientRect();

class formValues {
  constructor(username, password, submitBtn, confirmPassword) {
    this.username = document.getElementById(username);
    this.password = document.getElementById(password);
    this.submitBtn = document.getElementById(submitBtn);
    this.confirmPassword = document.getElementById(confirmPassword);
  }

  set setFormBoxesValue(value) {
    this.username.value = value.trim();
    this.password.value = value.trim();
    if (this.confirmPassword) {
      this.confirmPassword.value = value.trim();
    }
  }
}

const logInFormValues = new formValues(
  "log-in-username",
  "log-in-password",
  "log-in-continue-btn"
);
const signUpFormValues = new formValues(
  "sign-up-username",
  "sign-up-password",
  "create-acc-btn",
  "sign-up-confirm-password"
);

const scrollToEl = function (value) {
  window.scrollTo({
    left: 0,
    top: elSectCoords.top + window.pageYOffset - value,
    behavior: "smooth",
  });
};

//check if the page should scroll to sign in screen first thing
if (JSON.parse(localStorage.getItem("scrollToSignUp"))) {
  elSectCoords = signUpSect.getBoundingClientRect();
  scrollToEl(500);
} else {
  elSectCoords = logInForm.getBoundingClientRect();
  scrollToEl(180);
}

//have page scroll to sign in screen on click
signUpNowScrollTo.addEventListener("click", function (e) {
  e.preventDefault();
  elSectCoords = signUpSect.getBoundingClientRect();
  scrollToEl(500);
});
guestSignInHyperLink.addEventListener("click", function (e) {
  e.preventDefault();

  localStorage.setItem(
    "guest",
    JSON.stringify({
      password: "none",
      username: "guest",
      theme: "white",
      highestCombo: 0,
      quizzes: {},
      current_quiz: {},
      recent_quiz: "",
    })
  );

  localStorage.setItem("current_quiz", "");
  localStorage.setItem("current_username", localStorage.getItem("guest"));
  logInFormValues.setFormBoxesValue = "";
  window.location.href = "logged-in.html";
});

logInForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (localStorage.getItem(logInFormValues.username.value)) {
    if (
      JSON.parse(localStorage.getItem(logInFormValues.username.value.trim()))
        .password === logInFormValues.password.value
    ) {
      localStorage.setItem(
        "current_username",
        localStorage.getItem(logInFormValues.username.value.trim())
      );

      logInFormValues.setFormBoxesValue = "";

      window.location.href = "logged-in.html";
    } else {
      newMessage(false, "Log in failed. Incorrect Username/Password", "timed");
      logInFormValues.setFormBoxesValue = "";
    }
  } else {
    newMessage(false, "Log in failed. Incorrect Username/Password", "timed");
    logInFormValues.setFormBoxesValue = "";
  }
});

signUpForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signUpForm.querySelector(".form-message").classList.add("hidden");
  if (
    signUpFormValues.password.value === signUpFormValues.confirmPassword.value
  ) {
    if (!signUpFormValues.password.value.includes(" ")) {
      if (
        signUpFormValues.username.value.trim().length <= 10 &&
        signUpFormValues.username.value.trim() !== " "
      ) {
        createAccount();
      } else {
        newMessage(false, "Username must be 10 characters or less", "timed");
      }
    } else {
      newMessage(false, "Password must not contain any spaces.", "timed");
    }
  } else {
    newMessage(false, "Passwords do not match.", "timed");
  }
});

const createAccount = function () {
  if (!localStorage.getItem(signUpFormValues.username.value.trim())) {
    localStorage.setItem(
      signUpFormValues.username.value.trim(),
      JSON.stringify({
        password: signUpFormValues.password.value,
        username: signUpFormValues.username.value.trim(),
        theme: "white",
        highestCombo: 0,
        quizzes: {},
        current_quiz: {},
        recent_quiz: "",
      })
    );
    signUpFormValues.setFormBoxesValue = "";
    newMessage(true, "Account Created! Now you just need to log In", "timed");
    elSectCoords = document.querySelector("header").getBoundingClientRect();
    scrollToEl(0);
  } else {
    newMessage(false, "This username already exists. Try another one", "timed");
  }
};
