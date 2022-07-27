//These are the points that each parameter earns
const base_point = 30;
const level_point = 5;
const affix_point = 5;
const seasonal_point = 10;
const bonus_timer_point = 7.5;
const bonus_max_percent = 40;
const loose_timer_point = 15;
const loose_max_percent = 40;

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
 function affix_calcul(keystone_level) {
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
export function keystone_point_calculator(level, best, time) {
  let keystone_point = 0;

  // Calcul of affix
  let affix_result = affix_calcul(level);
  keystone_point = base_point + affix_result + level_point * level;
  if (best === true) {
    keystone_point = keystone_point * 1.5;
  } else {
    //keystone_point = keystone_point * 0.5;
  }

  // Calcul of timer
  if (time != 0) {
    if (time >= 40) {
      keystone_point = keystone_point + bonus_timer_point;
    }
    if (time >= 0 && time <= 39) {
      keystone_point =
        keystone_point + (bonus_timer_point / bonus_max_percent) * time;
    } else if (time <= 0 && time >= -40) {
      keystone_point =
        keystone_point -
        (loose_timer_point / loose_max_percent) * Math.abs(time);
    } else if (time <= -40) {
      return 0;
    }
  } 

  if (best === false) {
    keystone_point = keystone_point * 0.5;
  }

  let retour = Math.round(keystone_point * 10) / 10;

  let diff_input = document.getElementById("difference");
  if (diff_input.childNodes.length === 0) {
  } else {
    document.getElementById("difference_result").innerHTML = (
      retour - diff_input.textContent
    ).toFixed(1);
  }

  // Readeable values
  return retour;
}