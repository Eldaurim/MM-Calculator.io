import * as lib from './function.js';

const calculator_button = document.getElementById("calculator_button");

calculator_button.addEventListener("click", function (event) {

  event.preventDefault();

  let keystone_level = document.getElementById("key_input").value;
  let best_key = document.getElementById("best_key_input").checked;

  let keystone_point_result = lib.keystone_point_calculator(keystone_level, best_key, 0);

  document.getElementById("result").innerHTML = keystone_point_result;
});

