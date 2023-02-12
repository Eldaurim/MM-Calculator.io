import "./script/localstorage.js";
import "./script/timed.js";
import "./script/api.js";

let i = document.querySelector("#key_level_input"),
  o = document.querySelector("#key_level_output");

o.innerHTML = i.value;

i.addEventListener(
  "input",
  function () {
    o.innerHTML = i.value;
  },
  false
);
