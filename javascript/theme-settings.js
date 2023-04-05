"use strict";

export class themeData {
  constructor(mainClass, removeClass, removeClass2) {
    this.themeObj = {
      newClass: mainClass,
      oldClass1: removeClass,
      oldClass2: removeClass2,
      //Removes the "." from these class identifiers for use in .classList
      newClassNoIndi: mainClass.slice(1),
      oldClass1NoIndi: removeClass.slice(1),
      oldClass2NoIndi: "",
    };

    if (this.themeObj.oldClass2) {
      this.themeObj.oldClass2NoIndi = removeClass2.slice(1);
    }
  }

  addTheme = function (val) {
    if (this.themeObj.oldClass1) {
      document.querySelectorAll(this.themeObj.oldClass1).forEach((element) => {
        element.classList.remove(this.themeObj.oldClass1NoIndi);
        element.classList.add(this.themeObj.newClassNoIndi);
      });
    }
    if (this.themeObj.oldClass2NoIndi !== "") {
      document.querySelectorAll(this.themeObj.oldClass2).forEach((element) => {
        element.classList.remove(this.themeObj.oldClass2NoIndi);
        element.classList.add(this.themeObj.newClassNoIndi);
      });
    }
  };
}
