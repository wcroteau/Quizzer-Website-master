"use strict";

let timer;
document
  .querySelector("#main-header")
  .insertAdjacentHTML(
    "afterend",
    `<div id="alert-box-positioner"><p id="alert-box" class="alert-color-negative alert-remove">Alert</p></div>`
  );
const alertBox = document.querySelector("#alert-box");

const newMessage = function (isPositive, message, type) {
  alertBox.textContent = message;
  clearTimeout(timer);

  //Green or Red color
  if (isPositive) {
    alertBox.classList.add("alert-color-positive");
    alertBox.classList.remove("alert-color-negative");
  } else {
    alertBox.classList.remove("alert-color-positive");
    alertBox.classList.add("alert-color-negative");
  }

  switch (type) {
    case "timed":
      alertBox.classList.remove("alert-remove");
      alertBox.classList.add("alert-add");
      timer = setTimeout(() => {
        type = "remove";
        alertBox.classList.remove("alert-add");
        alertBox.classList.add("alert-remove");
      }, 6000);
      break;

    default:
      break;
  }
};
