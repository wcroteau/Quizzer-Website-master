"use strict";

export const quizName = document.querySelector("#quiz-name");
export const comboText = document.querySelector("#combo");
export const highestComboText = document.querySelector("#highest-combo");
export const question = document.querySelector("#quiz-question");
export const QuizContainer = document.querySelector("#quiz-container");
export const currentQuizSettings = JSON.parse(
  localStorage.getItem("current_quiz")
);
