import React from "react";
import ReactDOM from "react-dom";
let age = "22";
let name = "Ilya";
let output = <span>{name} is {age} years old</span>;
ReactDOM.render(output, document.querySelector("#myDiv"));