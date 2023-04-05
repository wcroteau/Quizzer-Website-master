"use strict";

import {
  menuBtn,
  quizzerLogo,
  menuContainer,
  whiteThemeBtn,
  grayThemeBtn,
  purpleThemeBtn,
  exitMenuBtn,
  createQuizHyperLink,
  createQuizBtn,
  scrollContainer,
  signedInAs,
  editQuizContainer,
  selectAQuiz,
  newQuizBtn,
  logOutBtn,
} from "./logged-in-variables.js";
import { themeData } from "./theme-settings.js";

const deleteContainer = document.querySelector("#delete-container");
const blackScreen = document.querySelector("#transparent-black-screen");

let newThemeColor = new themeData(
  ".main-theme-color",
  ".gray-theme-color",
  ".purple-theme-color"
);
let themeHyperLinkColor = new themeData(
  ".main-hyperlink-color",
  ".secondary-hyperlink-color"
);

let quizTabColor = new themeData(
  ".main-quiz-tab-color",
  ".purple-quiz-tab-color",
  ".gray-quiz-tab-color"
);

let themeSecondaryColor = new themeData(
  ".main-theme-color-secondary",
  ".gray-theme-color-secondary",
  ".purple-theme-color-secondary"
);

let themeFontColor = new themeData(".main-font-color", ".white-font-color");
let questionsScrollContainer;
let answersScrollContainer;
let interchangeableScrollContainer;
let addQuestionBtn;
let newAnswerBox;
let newQuestionBox;
let newInterchangeableBox;
let wrongAnswersArray;
let questionToDeleteBox;
let removeQuestionBtn;
let saveQuestionsBtn;
let returnBtn;
let quizNameBox;
let quizTypeSelection;
let answersList;
let settingsEl;
let currentUsernameSettings;
let themeColor = "main";
let deleteIndex = 0;

const init = function () {
  localStorage.setItem("scrollToSignUp", "false");

  //If we somehow lose access to user data, return to home
  if (!localStorage.getItem("current_username")) {
    window.location.href = "index.html";
  } else {
    pickTheme();
  }

  if (createQuizHyperLink) {
    createQuizHyperLink.addEventListener("click", function (e) {
      e.preventDefault();
      addNewQuizContainer();
    });
  }

  currentUsernameSettings = JSON.parse(
    localStorage.getItem("current_username")
  );

  signedInAs.textContent = `Signed in as: ${currentUsernameSettings.username}`;

  refreshQuizzes();
};

const pickTheme = function () {
  //Picking Theme
  if (JSON.parse(localStorage.getItem("current_username")).theme === "white") {
    addWhiteTheme();
  } else if (
    JSON.parse(localStorage.getItem("current_username")).theme === "gray"
  ) {
    addGrayTheme();
  } else {
    addPurpleTheme();
  }
};

const defaultSideMenuSettings = function () {
  menuContainer.classList.add("no-opacity");
  menuContainer.classList.add("menu-hidden-pos");
  exitMenuBtn.classList.add("no-opacity");
  document.body.style.overflowY = "scroll";
};

const saveAndReturnCurrentQuiz = function (index) {
  localStorage.setItem(
    "current_quiz",
    JSON.stringify(Object.values(currentUsernameSettings.quizzes)[index])
  );

  return JSON.parse(localStorage.getItem("current_quiz"));
};

blackScreen.addEventListener("click", function () {
  document.body.style.overflowY = "scroll";
  blackScreen.classList.add("hidden");
  deleteContainer.classList.add("hidden");
});
document.querySelector("#delete-yes").addEventListener("click", function () {
  document.body.style.overflowY = "scroll";
  blackScreen.classList.add("hidden");
  deleteContainer.classList.add("hidden");

  deleteQuiz(deleteIndex);
});
document.querySelector("#delete-no").addEventListener("click", function (e) {
  document.body.style.overflowY = "scroll";
  blackScreen.classList.add("hidden");
  deleteContainer.classList.add("hidden");
});

const alertRemoveQuiz = function (index) {
  deleteContainer.classList.remove("hidden");
  blackScreen.classList.remove("hidden");
  document.body.style.overflowY = "hidden";
  document.querySelector(
    "#delete-question"
  ).textContent = `Are you sure you want to delete "${
    Object.keys(currentUsernameSettings.quizzes)[index]
  }"? `;
};

const saveCurrentUsernameSettings = function () {
  localStorage.setItem(
    "current_username",
    JSON.stringify(currentUsernameSettings)
  );
};
const resetCurrentUsernameSettings = function () {
  currentUsernameSettings = JSON.parse(
    localStorage.getItem("current_username")
  );
};

const addNewQuizContainer = function () {
  //edit a quiz container
  settingsEl = document.querySelector("#caqc");
  settingsEl.classList.remove("hidden");
  scrollToEl(settingsEl);

  //Create the new quiz
  newQuizBtn.removeEventListener("click", addNewQuizContainer);
  createQuizBtn.addEventListener("click", newQuizHandler);
  document
    .querySelector("#new-quiz-name-input")
    .addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        newQuizHandler();
      }
    });
};

function newQuizHandler() {
  const multipleChoiceInput = document.querySelector("#quiz-type-select");
  const quizNameInput = document.querySelector("#new-quiz-name-input");

  if (quizNameInput.value && quizNameInput.value.trim() !== "") {
    if (!currentUsernameSettings.quizzes[quizNameInput.value.trim()]) {
      createQuizBtn.removeEventListener("click", newQuizHandler);
      quizNameInput.removeEventListener("keyup", newQuizHandler);
      addQuiz(multipleChoiceInput.value, quizNameInput.value.trim());
      quizNameInput.value = "";

      settingsEl.classList.add("hidden");
      newMessage(
        true,
        "Quiz Created! Use Edit to add Questions/Answers",
        "timed"
      );
      return;
    } else {
      newMessage(false, "Quiz name taken. Try another one", "timed");
      return;
    }
  } else {
    newMessage(false, "Please enter a name", "timed");
  }
}

const scrollToEl = function (e) {
  const elCoords = e.getBoundingClientRect();
  window.scrollTo({
    left: 0,
    top: elCoords.top + window.pageYOffset,
    behavior: "smooth",
  });
};

const addQuiz = function (quizType, quizName) {
  const newQuizObj = {
    name: quizName,
    type: quizType,
    highestCombo: 0,
    questions: [],
  };

  saveNewQuiz(newQuizObj, quizName);
};

const saveNewQuiz = function (quiz, name) {
  resetCurrentUsernameSettings();
  currentUsernameSettings.quizzes[name] = quiz;
  savetoProfile();
  refreshQuizzes();
};

const deleteQuiz = function (quizNumber) {
  if (document.querySelector(`#quiz-tab-flex-${quizNumber}`))
    document.querySelector(`#quiz-tab-flex-${quizNumber}`).remove();

  resetCurrentUsernameSettings();
  delete currentUsernameSettings.quizzes[
    Object.keys(currentUsernameSettings.quizzes)[quizNumber]
  ];
  savetoProfile();

  localStorage.setItem("current_quiz", "");

  refreshQuizzes();
};

const refreshQuizzes = function () {
  //if quizzes
  if (Object.keys(currentUsernameSettings.quizzes).length > 0) {
    //remove existing tabs
    document.querySelectorAll(".quiz-tab-flex").forEach((element) => {
      element.remove();
    });

    //create new tabs
    Object.values(currentUsernameSettings.quizzes).forEach((quiz, i) => {
      scrollContainer.insertAdjacentHTML(
        "beforeend",
        `<div id='quiz-tab-flex-${i}' class="quiz-tab-flex"> <button id='quiz-tab-${i}' class="quiz-tab ${themeColor}-quiz-tab-color  tab-shadow">
      <p class="quiz-name-tag main-font-color">${quiz.name}</p>
      <p class="quiz-questions-tag main-font-color">Questions: ${
        Object.keys(quiz.questions).length
      }<br/>High Score: ${quiz.highestCombo} </p>
    
      </button>      <p id='edit-${i}' class="quiz-tab-options-container quiz-tab-options-edit scale-up">Edit</p>
      <div  id="delete-${i}" class="quiz-tab-options-container quiz-tab-options-delete scale-up "> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
       </div></div>`
      );

      //delete button
      document
        .querySelector(`#delete-${i}`)
        .addEventListener("click", function (e) {
          e.stopPropagation;
          if (settingsEl) {
            settingsEl.classList.add("hidden");
          }
          scrollToEl(selectAQuiz);
          alertRemoveQuiz(i);
          deleteIndex = i;
        });

      //Edit button
      document
        .querySelector(`#edit-${i}`)
        .addEventListener("click", function (e) {
          setUpEditQuiz(i);
          newMessage(
            true,
            "Welcome to edit! Scroll down to begin adding/editing Questions!",
            "timed"
          );
        });
      //quiz tab
      document
        .querySelector(`#quiz-tab-${i}`)
        .addEventListener("click", function (e) {
          if (quiz.questions.length > 0) {
            if (quiz) {
              saveAndReturnCurrentQuiz(i);
              window.location.href = "quizzing.html";
            } else {
              newMessage(
                false,
                "Error: Failed to access quiz. Please try again later",
                "timed"
              );
            }
          } else {
            newMessage(
              false,
              "You can not begin quizzing yet! Please add some questions!",
              "timed"
            );
          }
        });
    });

    document.querySelector("#no-quizzes-text").classList.add("hidden");
    newQuizBtn.classList.remove("hidden");
    pickTheme();

    newQuizBtn.addEventListener("click", addNewQuizContainer);
  }
  //no quizzes
  else {
    document.querySelector("#no-quizzes-text").classList.remove("hidden");
    newQuizBtn.classList.add("hidden");
  }
  //Recent Quiz text
  if (localStorage.getItem("current_quiz")) {
    document.querySelector("#recent-quiz").textContent = JSON.parse(
      localStorage.getItem("current_quiz")
    ).name;
  } else {
    document.querySelector("#recent-quiz").textContent = "";
  }

  document
    .querySelector(".play-now-btn")
    .addEventListener("click", function (e) {
      if (
        JSON.parse(localStorage.getItem("current_quiz")) !== "" &&
        JSON.parse(localStorage.getItem("current_quiz")).questions.length > 0
      ) {
        window.location.href = "quizzing.html";
      } else {
        newMessage(
          false,
          "You can not begin quizzing yet! Please add some questions!",
          "timed"
        );
      }
    });
};

const setUpEditQuiz = function (index) {
  editQuizContainer.classList.remove("hidden");
  selectAQuiz.classList.add("hidden");
  if (settingsEl) {
    settingsEl.classList.add("hidden");
  }

  editQuizContainer.innerHTML = ` <header class="title  select-a-quiz main-font-color">EDIT QUIZ</header>
  <div class="return-arrow scale-up main-font-color">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
   <path stroke-linecap="round" stroke-linejoin="round" d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
</div>
 
   <div class="edit-quiz-grid">
     <select disabled id="edit-multiple-choice-input">
       <option value="sq">Standard Quiz</option>
       <option value="mc">Multiple Choice</option>
     </select>
     <input id="edit-quiz-name-box" type="text" placeholder="Quiz Name" />
     <p id="edit-quiz-questions-counter" class=" main-font-color">Total Questions: </p>
     <p class="sub-title edit-quiz-questions-sub-title main-font-color">Questions </p>
     <div class="scroll-container questions-scroll-container"> 
     </div>

     <p class="sub-title edit-quiz-answers-sub-title main-font-color">Answers </p>
     <div id="answers-list" class="scroll-container answers-scroll-container"> 
     </div>
   
 
     <div class="edit-btn-flex">

       <button class=" scale-up save-btn">Save</button>
       <button class="scale-up add-btn">Add Question</button>
       <div class="remove-quiz-flex">
       <input id="question-delete-box" type="text" placeholder="1" />
       <button class="scale-up remove-btn">Remove Question</button>

     </div>
     </div>
   </div>`;

  //Elements were created using innerHTML so we can now set them here
  addQuestionBtn = document.querySelector(".add-btn");
  removeQuestionBtn = document.querySelector(".remove-btn");
  saveQuestionsBtn = document.querySelector(".save-btn");
  returnBtn = document.querySelector(".return-arrow");
  quizTypeSelection = document.querySelector("#edit-multiple-choice-input");
  questionsScrollContainer = document.querySelector(
    ".questions-scroll-container"
  );
  answersScrollContainer = document.querySelector(".answers-scroll-container");
  answersList = document.querySelector("#answers-list");
  questionToDeleteBox = document.querySelector("#question-delete-box");
  quizNameBox = document.querySelector("#edit-quiz-name-box");

  const currentQuizSettings = saveAndReturnCurrentQuiz(index);

  document.querySelector(
    "#edit-quiz-questions-counter"
  ).textContent = `Total Questions: ${
    Object.values(currentQuizSettings.questions).length
  }`;

  quizNameBox.value = currentQuizSettings.name;
  //fixes a potential bug where the tabs aren't spaced
  questionsScrollContainer.classList.add("spaced-grid-template-rows");

  //Back to select a quiz menu so we need to hide elements
  returnBtn.addEventListener("click", function (e) {
    editQuizContainer.classList.add("hidden");
    editQuizContainer.innerHTML = "";
    selectAQuiz.classList.remove("hidden");
    questionsScrollContainer.innerHTML = "";
    answersScrollContainer.innerHTML = "";

    refreshQuizzes();
  });

  //If standard quiz type
  if (currentQuizSettings.type === "sq") {
    quizTypeSelection.value = "sq";

    addQuestionBtn.addEventListener("click", function (e) {
      if (checkIfNewQBoxesEmptyStandard() === false) {
        addQuestionStandard(index);
        newMessage(true, "Added.", "timed");
      } else {
        newMessage(
          false,
          "Failed. Please make sure each box is filled",
          "timed"
        );
      }
    });

    removeQuestionBtn.addEventListener("click", function (e) {
      if (
        !isNaN(parseInt(questionToDeleteBox.value.trim())) &&
        parseInt(questionToDeleteBox.value.trim()) <=
          Object.values(currentQuizSettings.questions).length
      ) {
        removeQuestion(questionToDeleteBox.value.trim(), index);
        newMessage(true, "Removed.", "timed");
      } else {
        newMessage(
          false,
          "Remove failed. Please make sure the box is filled with valid characters",
          "timed"
        );
      }
    });

    saveQuestionsBtn.addEventListener("click", function (e) {
      if (checkIfBoxesEmptyStandard() === false) {
        formatQuizAndSaveStandard(index);
      } else {
        newMessage(
          false,
          "Save failed. Please make sure each box is filled",
          "timed"
        );
      }
    });

    //Add Question elements
    addQuestionEls(index);

    //fixes a potential bug where the tabs aren't spaced
    answersScrollContainer.classList.add("spaced-grid-template-rows");

    //Add Answer elements
    Object.values(currentUsernameSettings.quizzes)[index].questions.forEach(
      (q, i) => {
        answersScrollContainer.insertAdjacentHTML(
          "beforeend",
          ` <div class="edit-questions-container answers">
        <p class="sub-title main-font-color list-num">${i + 1}.</p>
      <input class="edit-answer-box" type="text" placeholder="Answer" value="${
        q.answer
      }"/>
      </div>`
        );
      }
    );

    //Add new question settings elements
    answersList.insertAdjacentHTML(
      "afterend",
      ` <div class="interchangable-check-box-flex">
        <p class="sub-title new-question-sub-title main-font-color">Is the Answer's word order interchangeable? (Uncheck if each word should be in order)</p>
        <div id="interchangeable-scroll-container"> 
        </div>
        
        </div> <p class="sub-title new-question-sub-title main-font-color">New Question </p>
        <input id="new-question-box" type="text" placeholder="New Question" />
        
        
        <p class="sub-title new-answer-sub-title main-font-color">Answer to the New Question </p>
        <input id="new-answer-box" type="text" placeholder="New Answer" />

        <div class="new-interchangable-check-box-flex">
        <p class="sub-title new-question-sub-title main-font-color">Is the Answer's word order interchangeable? (Uncheck if each word should be in order)</p>
        <input type="checkbox" id="new-interchangeable-check-box" name="new-interchangeable" value="true" checked>

        </div>`
    );

    interchangeableScrollContainer = document.querySelector(
      "#interchangeable-scroll-container"
    );

    //Add Interchangeable check box elements
    Object.values(currentUsernameSettings.quizzes)[index].questions.forEach(
      (q, i) => {
        interchangeableScrollContainer.insertAdjacentHTML(
          "beforeend",
          ` <div class="interchangeable-flex"><p class="sub-title main-font-color list-num">${
            i + 1
          }.</p>
          <input type="checkbox"  class="interchangeable-check-box" name="new-interchangeable" value="${
            q.interchangeable
          }" ${q.interchangeable === "true" ? "checked" : ""}></div>`
        );
      }
    );
  }
  //If multiple choice quiz type
  else {
    quizTypeSelection.value = "mc";
    //Add Question elements
    addQuestionEls(index);

    addQuestionBtn.addEventListener("click", function (e) {
      if (checkIfNewQBoxesEmptyMC() === false) {
        addQuestionMC(index);
        newMessage(true, "Added.", "timed");
      } else {
        newMessage(
          false,
          "Failed. Please make sure each box is filled",
          "timed"
        );
      }
    });

    removeQuestionBtn.addEventListener("click", function (e) {
      if (
        !isNaN(parseInt(questionToDeleteBox.value.trim())) &&
        parseInt(questionToDeleteBox.value.trim()) <=
          Object.values(currentQuizSettings.questions).length
      ) {
        removeQuestion(questionToDeleteBox.value.trim(), index);
        newMessage(true, "Removed.", "timed");
      } else {
        newMessage(
          false,
          "Remove failed. Please make sure the box is filled with valid characters",
          "timed"
        );
      }
    });

    saveQuestionsBtn.addEventListener("click", function (e) {
      if (checkIfBoxesEmptyMC() === false) {
        formatQuizAndSaveMC(index);
        newMessage(true, "Saved.", "timed");
      } else {
        newMessage(
          false,
          "Save failed. Please make sure each box is filled",
          "timed"
        );
      }
    });

    //Add new question settings elements
    answersList.insertAdjacentHTML(
      "afterend",
      `
       
       <p class="sub-title new-question-sub-title main-font-color">New Question </p>
       <input id="new-question-box" type="text" placeholder="New Question" />
       
       
       <p class="sub-title new-answer-sub-title main-font-color">Wrong Answers to the New Question </p>
       <div id="wong-answers-scroll-container" class=" new-answers-scroll-container"> 
       <input class="new-answer-box" type="text" placeholder="Wrong Answer" />
       </div>

         
       <p class="sub-title new-answer-sub-title main-font-color">Answer to the New Question </p>
       <input id="new-answer-box" type="text" placeholder="Real Answer" />

       `
    );

    answersScrollContainer.classList.add("auto-grid-template-rows");
    answersScrollContainer.style.removeProperty("grid-auto-rows");

    //Add Answer elements
    Object.values(currentUsernameSettings.quizzes)[index].questions.forEach(
      (q, i) => {
        answersScrollContainer.insertAdjacentHTML(
          "beforeend",
          ` <p class="sub-title main-font-color mc-answers-list-num">For Question ${
            i + 1
          }</p> <div id="mc-answers-scroll-container-${i}" class="mc-answers-scroll-container"> </div>`
        );
        document
          .querySelector(`#mc-answers-scroll-container-${i}`)
          .insertAdjacentHTML(
            "beforeend",
            ` <p class="sub-title  mc-answers-list-num">Right Answer</p> <input class="right-answer-box edit-answer-box" type="text" placeholder="Answer" value="${q.answers.realAnswer}"/> <p class="sub-title  mc-answers-list-num">Wrong Answers</p>`
          );
        q.answers.wrongAnswers.forEach((wa, index) => {
          document
            .querySelector(`#mc-answers-scroll-container-${i}`)
            .insertAdjacentHTML(
              "beforeend",
              `  <input class="wrong-answer-box" type="text" placeholder="Answer" value="${wa}"/>`
            );
        });
      }
    );

    //Add extra answers button
    removeQuestionBtn.insertAdjacentHTML(
      "afterend",
      `
       <button class="scale-up add-answer-btn">Add Wrong Answer</button>
       `
    );

    const addAnswerBtn = document.querySelector(".add-answer-btn");

    addAnswerBtn.addEventListener("click", function () {
      document
        .querySelector(".new-answers-scroll-container")
        .insertAdjacentHTML(
          "beforeend",
          `
        <input class="new-answer-box" type="text" placeholder="Wrong Answer" />
 
        `
        );
    });
  }
};

const checkIfBoxesEmptyStandard = function () {
  let boxEmpty = false;

  document.querySelectorAll(".edit-question-name-box").forEach((el, i) => {
    if (el.value.trim() === " " || el.value.trim() === "") {
      boxEmpty = true;
    }
  });
  document.querySelectorAll(".edit-answer-box").forEach((el, i) => {
    if (el.value.trim() === " " || el.value.trim() === "") {
      boxEmpty = true;
    }
  });

  if (quizNameBox.value.trim() === " " || quizNameBox.value.trim() === "") {
    boxEmpty = true;
  }

  if (boxEmpty === true) {
    return true;
  } else {
    return false;
  }
};

const checkIfBoxesEmptyMC = function () {
  let boxEmpty = false;

  document.querySelectorAll(".edit-question-name-box").forEach((el, i) => {
    if (el.value.trim() === " " || el.value.trim() === "") {
      boxEmpty = true;
    }
  });

  document.querySelectorAll(".mc-answers-scroll-container").forEach((el, i) => {
    el.querySelectorAll(".wrong-answer-box").forEach((e, ind) => {
      if (e.value.trim() === " " || e.value.trim() === "") {
        boxEmpty = true;
      }
    });

    el.querySelectorAll(".edit-answer-box").forEach((e, ind) => {
      if (e.value.trim() === " " || e.value.trim() === "") {
        boxEmpty = true;
      }
    });
  });

  if (boxEmpty === true) {
    return true;
  } else {
    return false;
  }
};
//figure out why save is working
const checkIfNewQBoxesEmptyMC = function () {
  let boxEmpty = false;

  newQuestionBox = document.querySelector("#new-question-box");
  newAnswerBox = document.querySelector("#new-answer-box");
  wrongAnswersArray = [];

  document.querySelectorAll(".new-answer-box").forEach((el, i) => {
    if (el.value.trim() === " " || el.value.trim() === "") {
      boxEmpty = true;
    }
  });

  if (
    newQuestionBox.value.trim() === " " ||
    newQuestionBox.value.trim() === ""
  ) {
    boxEmpty = true;
  }

  if (newAnswerBox.value.trim() === " " || newAnswerBox.value.trim() === "") {
    boxEmpty = true;
  }

  if (boxEmpty === true) {
    return true;
  } else {
    return false;
  }
};

const checkIfNewQBoxesEmptyStandard = function () {
  let boxEmpty = false;

  newQuestionBox = document.querySelector("#new-question-box");
  newAnswerBox = document.querySelector("#new-answer-box");
  newInterchangeableBox = document.querySelector(
    "#new-interchangeable-check-box"
  );
  if (newAnswerBox.value.trim() === " " || newAnswerBox.value.trim() === "") {
    boxEmpty = true;
  }

  if (
    newQuestionBox.value.trim() === " " ||
    newQuestionBox.value.trim() === ""
  ) {
    boxEmpty = true;
  }

  if (boxEmpty === true) {
    return true;
  } else {
    return false;
  }
};

const formatQuizAndSaveStandard = function (index) {
  Object.values(currentUsernameSettings.quizzes)[index].name =
    quizNameBox.value.trim();

  document.querySelectorAll(".edit-question-name-box").forEach((el, i) => {
    Object.values(currentUsernameSettings.quizzes)[index].questions[
      i
    ].question = el.value.trim();
  });

  document.querySelectorAll(".edit-answer-box").forEach((el, i) => {
    Object.values(currentUsernameSettings.quizzes)[index].questions[i].answer =
      el.value.trim();
  });

  document.querySelectorAll(".interchangeable-check-box").forEach((el, i) => {
    el.checked ? (el.value = true) : (el.value = false);
    Object.values(currentUsernameSettings.quizzes)[index].questions[
      i
    ].interchangeable = el.value;
  });

  savetoProfile();
  newMessage(true, "Saved.", "timed");
};
const formatQuizAndSaveMC = function (index) {
  Object.values(currentUsernameSettings.quizzes)[index].name =
    quizNameBox.value.trim();

  Object.values(currentUsernameSettings.quizzes)[index].questions.forEach(
    (element, i) => {
      element.answers.wrongAnswers = [];
    }
  );

  document.querySelectorAll(".edit-question-name-box").forEach((el, i) => {
    Object.values(currentUsernameSettings.quizzes)[index].questions[
      i
    ].question = el.value.trim();
  });

  document.querySelectorAll(".mc-answers-scroll-container").forEach((el, i) => {
    el.querySelectorAll(".wrong-answer-box").forEach((e, ind) => {
      Object.values(currentUsernameSettings.quizzes)[index].questions[
        i
      ].answers.wrongAnswers.push(e.value.trim());
    });

    el.querySelectorAll(".edit-answer-box").forEach((e, ind) => {
      Object.values(currentUsernameSettings.quizzes)[index].questions[
        i
      ].answers.realAnswer = e.value.trim();
    });
  });

  savetoProfile();
  newMessage(true, "Saved.", "timed");
};

const addQuestionEls = function (index) {
  Object.values(currentUsernameSettings.quizzes)[index].questions.forEach(
    (q, i) => {
      questionsScrollContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="edit-questions-container ">
        <p class="sub-title main-font-color list-num">${i + 1}.</p>
      <input id="edit-question-name-box-${i}" class="edit-question-name-box " type="text" placeholder="Question Name" value="${
          q.question
        }" />
      </div>`
      );
    }
  );
};

const savetoProfile = function () {
  localStorage.setItem(
    "current_username",
    JSON.stringify(currentUsernameSettings)
  );

  localStorage.setItem(
    `${currentUsernameSettings.username}`,
    JSON.stringify(currentUsernameSettings)
  );
};

const addQuestionStandard = function (index) {
  const newQuestionObj = {
    question: newQuestionBox.value.trim(),
    answer: newAnswerBox.value.trim(),
    interchangeable: newInterchangeableBox.checked ? "true" : "false",
  };

  saveQuestion(newQuestionObj, index);
};

const addQuestionMC = function (index) {
  document.querySelectorAll(".new-answer-box").forEach((el, i) => {
    wrongAnswersArray.push(el.value.trim());
  });

  const newQuestionObj = {
    question: newQuestionBox.value.trim(),
    answers: {
      realAnswer: newAnswerBox.value.trim(),
      wrongAnswers: wrongAnswersArray,
    },
  };

  saveQuestion(newQuestionObj, index);
};

const removeQuestion = function (questionIndex, quizIndex) {
  resetCurrentUsernameSettings();

  Object.values(currentUsernameSettings.quizzes)[quizIndex].questions.splice(
    questionIndex - 1,
    1
  );

  saveCurrentUsernameSettings();

  document.querySelectorAll(".edit-questions-container").forEach((element) => {
    element.remove();
  });

  document.querySelectorAll(".interchangeable-flex").forEach((element) => {
    element.remove();
  });
  setUpEditQuiz(quizIndex);
};

const saveQuestion = function (question, index) {
  resetCurrentUsernameSettings();
  Object.values(currentUsernameSettings.quizzes)[index].questions.push(
    question
  );
  saveCurrentUsernameSettings();

  setUpEditQuiz(index);
};

const saveThemeChange = function (theme) {
  resetCurrentUsernameSettings();
  currentUsernameSettings.theme = theme;
  savetoProfile();

  localStorage.setItem(
    `${JSON.parse(localStorage.getItem("current_username")).username}`,
    JSON.stringify(currentUsernameSettings)
  );
};

const addWhiteTheme = function () {
  newThemeColor = new themeData(
    ".main-theme-color",
    ".gray-theme-color",
    ".purple-theme-color"
  );
  themeHyperLinkColor = new themeData(
    ".main-hyperlink-color",
    ".secondary-hyperlink-color"
  );

  quizTabColor = new themeData(
    ".main-quiz-tab-color",
    ".purple-quiz-tab-color",
    ".gray-quiz-tab-color"
  );

  themeSecondaryColor = new themeData(
    ".main-theme-color-secondary",
    ".gray-theme-color-secondary",
    ".purple-theme-color-secondary"
  );

  themeFontColor = new themeData(".main-font-color", ".white-font-color");

  newThemeColor.addTheme();
  themeHyperLinkColor.addTheme();
  themeFontColor.addTheme();
  quizTabColor.addTheme();
  themeSecondaryColor.addTheme();

  themeColor = "main";
  saveThemeChange("white");
};

const addGrayTheme = function () {
  newThemeColor = new themeData(
    ".gray-theme-color",
    ".main-theme-color",
    ".purple-theme-color"
  );
  themeHyperLinkColor = new themeData(
    ".secondary-hyperlink-color",
    ".main-hyperlink-color"
  );

  quizTabColor = new themeData(
    ".gray-quiz-tab-color",
    ".purple-quiz-tab-color",
    ".main-quiz-tab-color"
  );

  themeSecondaryColor = new themeData(
    ".gray-theme-color-secondary",
    ".main-theme-color-secondary",
    ".purple-theme-color-secondary"
  );

  themeFontColor = new themeData(".white-font-color", ".main-font-color");

  newThemeColor.addTheme();
  themeHyperLinkColor.addTheme();
  themeFontColor.addTheme();
  quizTabColor.addTheme();
  themeSecondaryColor.addTheme();

  themeColor = "gray";
  saveThemeChange("gray");
};

const addPurpleTheme = function () {
  newThemeColor = new themeData(
    ".purple-theme-color",
    ".main-theme-color",
    ".gray-theme-color"
  );
  themeHyperLinkColor = new themeData(
    ".secondary-hyperlink-color",
    ".main-hyperlink-color"
  );

  quizTabColor = new themeData(
    ".purple-quiz-tab-color",
    ".gray-quiz-tab-color",
    ".main-quiz-tab-color"
  );

  themeSecondaryColor = new themeData(
    ".purple-theme-color-secondary",
    ".main-theme-color-secondary",
    ".gray-theme-color-secondary"
  );

  themeFontColor = new themeData(".white-font-color", ".main-font-color");

  newThemeColor.addTheme();
  themeHyperLinkColor.addTheme();
  themeFontColor.addTheme();
  quizTabColor.addTheme();
  themeSecondaryColor.addTheme();

  themeColor = "purple";
  saveThemeChange("purple");
};

menuBtn.addEventListener("click", function (click) {
  if (menuContainer.classList.contains("no-opacity")) {
    menuContainer.classList.remove("no-opacity");
    menuContainer.classList.remove("menu-hidden-pos");
    exitMenuBtn.classList.remove("no-opacity");
    document.body.style.overflow = "hidden";
    window.scrollTo(0, 0);
  } else {
    defaultSideMenuSettings();
  }
});

exitMenuBtn.addEventListener("click", defaultSideMenuSettings);

grayThemeBtn.addEventListener("click", addGrayTheme);

whiteThemeBtn.addEventListener("click", addWhiteTheme);

purpleThemeBtn.addEventListener("click", addPurpleTheme);

logOutBtn.addEventListener("click", function (e) {
  localStorage.setItem("current_quiz", "");
  window.location.href = "index.html";
});

init();
