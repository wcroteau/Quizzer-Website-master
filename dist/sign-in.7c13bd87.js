"use strict";
const signUpNowScrollTo = document.querySelector(".sign-up-hyperlink");
const signUpSect = document.querySelector("#create-acc-btn");
const scrollToSignUp = function() {
    const signUpSectCoords = signUpSect.getBoundingClientRect();
    window.scrollTo({
        left: 0,
        top: signUpSectCoords.top + window.pageYOffset,
        behavior: "smooth"
    });
};
console.log(JSON.parse(localStorage.getItem("scrollToSignUp")));
//check if the page should scroll to sign in screen first thing
if (JSON.parse(localStorage.getItem("scrollToSignUp"))) scrollToSignUp();
//have page scroll to sign in screen on click
signUpNowScrollTo.addEventListener("click", function(e) {
    e.preventDefault();
    scrollToSignUp();
});

//# sourceMappingURL=sign-in.7c13bd87.js.map
