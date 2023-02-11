import * as lib from "../function/functions.js";

const calculator_button = document.querySelector("#calculator_button");

calculator_button.addEventListener("click", function (e) {
  e.preventDefault();

  let keystone_level = document.querySelector("#key_level_input").value;
  let best_key = document.querySelector("#best_key_input").checked;

  document.querySelector("#result-key-calculator").innerHTML = lib.keystone_point_calculator(keystone_level, best_key, 0);
});
