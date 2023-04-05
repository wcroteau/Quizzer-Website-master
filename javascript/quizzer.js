"use strict";
import { themeData } from "./theme-settings.js";
import { signedInAs } from "./logged-in-variables.js";

import {
  currentQuizSettings,
  comboText,
  quizName,
  highestComboText,
  question,
  QuizContainer,
} from "./quizzing-variables.js";

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
let themeColor = "main";
let currentUsernameSettings = JSON.parse(
  localStorage.getItem("current_username")
);
let combo = 0;
let randomQuestionI = 0;
let max = currentQuizSettings.questions.length - 1;
let min = 0;
let randomMinEl;
let randomMaxEl;
let answerBox;
let yourAnswer;
let realAnswer;
let canCombo = true;
let isChecked = false;
let mcIgnoreList = [];
let randomAnswer;
let randomAnswerI;
let realAnswerRadio;
let answerList;

const result = document.querySelector("#results");
const correctionsFlex = document.querySelector("#correction-contianer");
const correctAnswerBox = document.querySelector("#correct-answer-value");
const yourAnswerBox = document.querySelector("#your-answer-value");

//Setup related:
const setUpQuiz = function () {
  rollRandomQuestion();
  canCombo = true;
  comboText.textContent = `Combo: ${combo}`;
  highestComboText.textContent = `High Score: ${currentQuizSettings.highestCombo}`;
  question.textContent = `${currentQuizSettings.questions[randomQuestionI].question}`;

  if (randomMinEl && randomMaxEl) {
    randomMinEl.value = min + 1;
    randomMaxEl.value = max + 1;
  }

  if (currentQuizSettings.type === "mc") createMCRadios();
};

const init = function () {
  quizName.textContent = `${currentQuizSettings.name}`;
  signedInAs.textContent = `Signed in as: ${currentUsernameSettings.username}`;
  setUpQuiz();

  //If we somehow lose access to user data, return to home
  if (!localStorage.getItem("current_username")) {
    window.location.href = "index.html";
  } else {
    //creating elements
    createEls();

    const whiteThemeBtn = document.querySelector(".white-theme");
    const grayThemeBtn = document.querySelector(".gray-theme");
    const purpleThemeBtn = document.querySelector(".purple-theme");
    const nextBtn = document.querySelector("#next-btn");
    randomMinEl = document.querySelector("#r-min");
    randomMaxEl = document.querySelector("#r-max");
    grayThemeBtn.addEventListener("click", addGrayTheme);
    whiteThemeBtn.addEventListener("click", addWhiteTheme);
    purpleThemeBtn.addEventListener("click", addPurpleTheme);
    nextBtn.addEventListener("click", function () {
      if (
        randomMaxEl.value <= currentQuizSettings.questions.length &&
        randomMaxEl.value > 0 &&
        randomMinEl.value > 0 &&
        randomMinEl.value <= currentQuizSettings.questions.length
      ) {
        max = randomMaxEl.value - 1;
        min = randomMinEl.value - 1;
        isChecked = false;
        if (currentQuizSettings.type === "sq") {
          hideResults();
        } else {
          hideResultsMC();
        }
        setUpQuiz();
      } else {
        min = 0;
        max = currentQuizSettings.questions.length - 1;
        isChecked = false;
        if (currentQuizSettings.type === "sq") {
          hideResults();
        } else {
          hideResultsMC();
        }
        setUpQuiz();
      }
    });
  }
};

//Theme related:
const saveThemeChange = function (theme) {
  resetCurrentUsernameSettings();
  currentUsernameSettings.theme = theme;
  saveCurrentUsernameSettings();

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

//Data related:
const resetCurrentUsernameSettings = function () {
  currentUsernameSettings = JSON.parse(
    localStorage.getItem("current_username")
  );
};

const saveCurrentUsernameSettings = function () {
  localStorage.setItem(
    "current_username",
    JSON.stringify(currentUsernameSettings)
  );
};

const setUpMCQuestions = function () {
  if (currentQuizSettings.questions[randomQuestionI]) {
    answerList = [];
    answerList = [
      ...currentQuizSettings.questions[randomQuestionI].answers.wrongAnswers,
      currentQuizSettings.questions[randomQuestionI].answers.realAnswer,
    ];

    realAnswerRadio = "";
    pickTheme();

    document.querySelectorAll(".mc-answer-flex").forEach((answer) => {
      const textEl = answer.querySelector(".quiz-mc-answer");

      if (mcIgnoreList.length !== answerList.length) {
        rollRandomAnswer(textEl);
        mcIgnoreList.push(randomAnswer);
        textEl.textContent = randomAnswer;
      }

      if (
        textEl.textContent ===
        currentQuizSettings.questions[randomQuestionI].answers.realAnswer
      ) {
        realAnswerRadio = answer.querySelector(".answer-radio");
      }
    });
    mcIgnoreList = [];
  } else {
    window.location.href = "logged-in.html";
  }
};

const rollRandomAnswer = function (answer) {
  randomAnswerI = Math.round(1 + Math.random() * answerList.length - 1);
  randomAnswer = answerList[randomAnswerI];

  while (
    mcIgnoreList.includes(randomAnswer) ||
    randomAnswerI > answerList.length - 1 ||
    randomAnswerI < 0
  ) {
    randomAnswerI = Math.round(1 + Math.random() * answerList.length - 1);
    randomAnswer = answerList[randomAnswerI];
  }
};

const rollRandomQuestion = function () {
  randomQuestionI = Math.round(
    1 + Math.random() * (currentQuizSettings.questions.length - 1)
  );
  while (randomQuestionI > max || randomQuestionI < min) {
    randomQuestionI = Math.round(
      1 + Math.random() * currentQuizSettings.questions.length - 1
    );
  }
};

const check = function () {
  yourAnswer = answerBox.value.trim();
  if (yourAnswer !== " " && yourAnswer !== "") {
    if (
      currentQuizSettings.questions[randomQuestionI].interchangeable === "true"
    ) {
      interchangeableCheck();
    } else {
      if (
        currentQuizSettings.questions[randomQuestionI].answer ===
        answerBox.value
      ) {
        showResults("Correct!");
        comboCheck();
      } else {
        showResults("Incorrect...");
        comboReset();
      }
    }
  }
};

const checkMC = function () {
  document.querySelectorAll(".answer-radio").forEach((element) => {
    if (element.checked) {
      isChecked = true;
    }
  });

  if (isChecked) {
    if (realAnswerRadio.checked) {
      isChecked = false;
      document.querySelectorAll(".answer-radio").forEach((element) => {
        element.disabled = true;
      });

      showResults("Correct!");
      comboCheck();
    } else {
      isChecked = false;
      document.querySelectorAll(".answer-radio").forEach((element) => {
        element.disabled = true;
      });

      showResults("Incorrect...");
      comboReset();
    }
  }
};

const interchangeableCheck = function () {
  let counter = 0;
  let wordsToIgnore = [];
  let ignore = false;
  realAnswer = currentQuizSettings.questions[randomQuestionI].answer
    .replace(/[\s]+/g, "*")
    .split("*");

  yourAnswer = yourAnswer.replace(/[\s]+/g, "*").split("*");
  //complex for loop to check if your answer contains all the values that the actual answer has (Every check is essential!)
  yourAnswer.forEach((yourWord) => {
    if (realAnswer.includes(yourWord)) {
      for (let i = 0; i < realAnswer.length; i++) {
        //This check is to stop the issue of the answer having all the correct words
        //and being labeled correct, even though it consists of other words
        if (counter === realAnswer.length) {
          counter++;
        }
        //compare with the real answer's word
        if (realAnswer[i] === yourWord) {
          //check and see if your word is in the ignore list
          wordsToIgnore.forEach((iw) => {
            if (yourWord === iw) {
              ignore = true;
            }
          });
          //if it isnt, push it inside the ignore list so that you can't cheat the system
          //in case your answer has multiples of the same values
          if (!ignore) {
            wordsToIgnore.push(yourWord);
            //build the up points counter,
            //if it equals the amount of words that the real answer has,
            //then your answer is correct
            counter++;
            break;
          } else {
            ignore = false;
          }
        }
      }
    } else {
      //This will automatically make your answer incorrect
      //...unless your answer has this many words :)
      counter = 9999999;
    }
  });
  //correct?
  if (counter === realAnswer.length) {
    calculateResults("Correct!");
    comboCheck();
  }
  //incorrect
  else {
    calculateResults("Incorrect...");
    comboReset();
  }
};

const comboReset = function () {
  combo = 0;
};
const comboCheck = function () {
  if (canCombo) {
    canCombo = false;
    combo += 1;
    if (combo > currentQuizSettings.highestCombo) {
      currentQuizSettings.highestCombo = combo;

      saveHighScore();
    }
  }
};

const saveHighScore = function () {
  currentQuizSettings.highestCombo = combo;
  currentUsernameSettings.quizzes[currentQuizSettings.name] =
    currentQuizSettings;

  savetoProfile();
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

//UI related:
const hideResults = function () {
  answerBox.disabled = false;
  result.classList.add("no-opacity");
  correctionsFlex.classList.add("no-opacity");
  answerBox.value = "";
};

const hideResultsMC = function () {
  document.querySelectorAll(".mc-answer-flex").forEach((element) => {
    element.remove();
  });
  result.classList.add("no-opacity");
};

const calculateResults = function (resultMessage) {
  result.textContent = resultMessage;
  result.classList.remove("no-opacity");
  correctionsFlex.classList.remove("no-opacity");
  correctAnswerBox.textContent = realAnswer.join(" ");
  yourAnswerBox.textContent = yourAnswer.join(" ");
  answerBox.disabled = true;
};

const showResults = function (resultMessage) {
  result.textContent = resultMessage;
  result.classList.remove("no-opacity");
  if (correctionsFlex && answerBox) {
    correctionsFlex.classList.remove("no-opacity");
    correctAnswerBox.textContent =
      currentQuizSettings.questions[randomQuestionI].answer;
    yourAnswerBox.textContent = answerBox.value.trim();
    answerBox.disabled = true;
  }
  window.scrollTo({
    left: 0,
    top: 0,
    behavior: "smooth",
  });
};

const createMCRadios = function () {
  for (
    let index = 0;
    index <
    currentQuizSettings.questions[randomQuestionI].answers.wrongAnswers.length +
      1;
    index++
  ) {
    document.querySelector("#multiple-choice-wrap").insertAdjacentHTML(
      "beforeend",
      `<div class="mc-answer-flex">
          <label class="custom-radio-btn">
          <input type="radio" class="answer-radio" name="answer" />
          <span class="selected"></span>
          </label>
          <p class="quiz-mc-answer main-font-color"></p>
  </div> `
    );
  }
  setUpMCQuestions();
};

const createEls = function () {
  QuizContainer.insertAdjacentHTML(
    "beforeend",
    `  <input id="aib" class="answer-input-box" type="text" placeholder="Answer" />
    <div id="settings-container" class="flex-column">
    <div  id="theme-settings-container" class="flex-column">
        <header id="theme" class="title theme-title main-font-color">Theme</header>
        <div class="theme-cs-grid grid">
        <button class="white-theme scale-up">
        </button>
        
        <button class="gray-theme scale-up">
      </button>

      <button class="purple-theme scale-up">
      </button>
      </div>
      </div>
      <div id="btn-flex"> 
      <div id="random-range-flex">
      <header id="random-question-range" class="title theme-title main-font-color">Random Question Range</header>
      <input id="r-min" class="random-range-input-box" type="text" placeholder="Min"  value="${1}"/>
      <p id="through-symbol" class="main-font-color">-</p>
      <input id="r-max" class="random-range-input-box" type="text" placeholder="Max" value="${
        currentQuizSettings.questions.length
      }" />
      </div>
      <button id="check-btn" class="quiz-btn scale-up" type="submit">Check</button>
      <button id="next-btn" class="quiz-btn scale-up " type="submit">Next</button>

      </div>
      </div>`
  );
  if (currentQuizSettings.type === "sq") {
    const checkBtn = document.querySelector("#check-btn");
    answerBox = document.querySelector("#aib");
    document.querySelector("#multiple-choice-wrap").classList.add("hidden");
    pickTheme();

    checkBtn.addEventListener("click", check);

    answerBox.addEventListener("keyup", function (event) {
      if (event.key === "Enter") {
        check();
      }
    });
  } else {
    const checkBtn = document.querySelector("#check-btn");
    document.querySelector("#correction-contianer").classList.add("hidden");

    pickTheme();

    checkBtn.addEventListener("click", checkMC);
  }
};

init();
