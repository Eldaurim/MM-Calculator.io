//These are the points that each parameter earns
const base_point = 30;
const level_point = 5;
const affix_point = 5;
const seasonal_point = 10;
const bonus_timer_point = 7.5;
const bonus_max_percent = 40;
const loose_timer_point = 15;
const loose_max_percent = 40;

// let keystone_level = 18;
// let best_key = false; // Change the calculation process with base point and affix
// let percent_time = -0.4; // % of time loose or gain

const calculator_button = document.getElementById("calculator_button");

calculator_button.addEventListener("click", function (event) {

  event.preventDefault();

  keystone_level = document.getElementById("key_input").value;
  best_key = document.getElementById("best_key_input").checked;
  percent_time = document.getElementById("time_key_input").value;

  let keystone_point_result = keystone_point_calculator();

  document.getElementById("result").innerHTML = keystone_point_result;
  console.log(keystone_point_result);
});

/**
 * function to get the amount of points with the affix
 *
 * affix = 7.5 points
 * seasonal affix = 15 points
 *
 * +2 = 1 affix
 * +4 = 2 affix
 * +7 = 3 affix
 * +10 = 4 affix
 *
 * @returns number of points compared to the key level
 */
function affix_calcul() {
  let result = 0;

  if (keystone_level >= 10) {
    result = result + affix_point * 2 + seasonal_point;
  } else if (keystone_level >= 7) {
    result = result + affix_point * 2;
  } else if (keystone_level >= 4) {
    result = result + affix_point;
  } else if (keystone_level >= 2) {
    result = 0;
    //result = result + affix_point;
  }

  return result;
}

/**
 * function to calculate the number of points with all parameters
 *
 * @returns number of points
 */
function keystone_point_calculator() {
  let keystone_point = 0;

  // Calcul of affix
  let affix_result = affix_calcul();
  keystone_point = base_point + affix_result + level_point * keystone_level;
  if (best_key === true) {
    keystone_point = keystone_point * 1.5;
  } else {
    keystone_point = keystone_point * 0.5;
  }

  // Calcul of timer
  if (percent_time >= 40) {
    keystone_point = keystone_point + bonus_timer_point;
  }
  if (percent_time >= 0 && percent_time <= 39) {
    keystone_point =
      keystone_point + (bonus_timer_point / bonus_max_percent) * percent_time;
  } else if (percent_time <= 0 && percent_time >= -39) {
    keystone_point =
      keystone_point -
      (loose_timer_point / loose_max_percent) * Math.abs(percent_time);
  } else if (percent_time <= -40) {
    return 0;
  }

  // Readeable values
  return Math.round(keystone_point * 10) / 10;
}
