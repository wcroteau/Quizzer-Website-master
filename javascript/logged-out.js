"use strict";
const signUpBtn = document.querySelector("#sign-up-btn");
const logInBtn = document.querySelector("#log-in-btn");
const nextArr = document.querySelector("#arrow-right");
const prevArr = document.querySelector("#arrow-left");
const imgFlex = document.querySelector(".img-flex");
const previewSelection1 = document.querySelector("#preview-selection-1");
const previewSelection2 = document.querySelector("#preview-selection-2");
const previewSelection3 = document.querySelector("#preview-selection-3");
const abtImgHeadingText = document.querySelector("#about-text-head");
const abtImgSubText = document.querySelector("#about-text");
let previewNum = 0;

//When the button gets clicked, we send data to local storage letting the browser know if we should scroll to the sign-in section on the next page
signUpBtn.addEventListener("click", function (e) {
  localStorage.setItem("scrollToSignUp", "true");
});

logInBtn.addEventListener("click", function (e) {
  localStorage.setItem("scrollToSignUp", "false");
});

const previewSelection = function (id, previewNumber) {
  document.querySelector(id).addEventListener("click", function (e) {
    previewNum = previewNumber;

    refreshPreview();
  });
};

const handleSelectionClasses = function (
  element,
  classToAdd,
  classToRemove1,
  classToRemove2
) {
  if (element.classList.contains(classToRemove1))
    element.classList.remove(classToRemove1);
  if (element.classList.contains(classToRemove2))
    element.classList.remove(classToRemove2);
  element.classList.add(classToAdd);
};

const refreshPreview = function () {
  document.querySelectorAll(".preview-selected").forEach((element) => {
    element.classList.remove("preview-selected");
  });
  switch (previewNum) {
    case 0:
      abtImgHeadingText.textContent =
        "Quizzer puts all your questions and answers into single quiz!";
      abtImgSubText.textContent =
        "Choose between standard and multiple choice quizzes";
      previewSelection1.classList.add("preview-selected");
      handleSelectionClasses(
        imgFlex,
        "first-selection",
        "third-selection",
        "second-selection"
      );

      break;

    case 1:
      abtImgHeadingText.textContent =
        "Use edit mode to add, remove, and edit questions!";
      abtImgSubText.textContent = "Don't forget to save!";

      previewSelection2.classList.add("preview-selected");
      handleSelectionClasses(
        imgFlex,
        "second-selection",
        "third-selection",
        "first-selection"
      );

      break;

    case 2:
      abtImgHeadingText.textContent = "Enhance your experience with themes!";
      abtImgSubText.textContent =
        "We have White, Gray, and Purple color options";
      previewSelection3.classList.add("preview-selected");
      handleSelectionClasses(
        imgFlex,
        "third-selection",
        "second-selection",
        "first-selection"
      );

      break;

    default:
      previewSelection1.classList.add("preview-selected");
      handleSelectionClasses(
        imgFlex,
        "first-selection",
        "third-selection",
        "second-selection"
      );
      break;
  }
};

nextArr.addEventListener("click", function (e) {
  previewNum++;

  if (previewNum > 2) {
    previewNum = 0;
  }
  refreshPreview();
});

prevArr.addEventListener("click", function (e) {
  previewNum--;
  if (previewNum < 0) {
    previewNum = 2;
  }

  refreshPreview();
});

previewSelection("#preview-selection-1", 0);
previewSelection("#preview-selection-2", 1);
previewSelection("#preview-selection-3", 2);
refreshPreview();
