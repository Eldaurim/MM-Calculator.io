import * as lib from "../function/functions.js";

const fetch_button = document.getElementById("fetch_button"); //Get DATAS from RaiderIO
const loader = document.querySelector(".loader");
const error_div = document.querySelector("#error-input");
const thumbnail_img = document.querySelector("#thumbnail");
const keys_div = document.querySelector("#keys");
const pseudo = document.querySelector("#pseudo");
const server = document.querySelector("#server");

function clearingDom() {
  if (keys_div.firstChild) {
    while (keys_div.firstChild) {
      keys_div.removeChild(keys_div.lastChild);
    }
  }
  thumbnail_img.src = "./media/wow-icon.png";
  loader.classList.remove("active");
  error_div.innerHTML = "";
}

pseudo.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    fetch_button.click();
  }
});

server.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    fetch_button.click();
  }
});

fetch_button.addEventListener("click", function (event) {
  event.preventDefault();
  clearingDom();
  loader.classList.add("active");

  /**
   * Get values input
   */
  let region = document.querySelector("#region").value;
  let realm = document.querySelector("#server").value;
  let name = document.querySelector("#pseudo").value;

  /**
   * Put values in local storage
   */
  localStorage.setItem("mmplus_region", region);
  localStorage.setItem("mmplus_realm", realm);
  localStorage.setItem("mmplus_pseudo", name);

  /**
   * Fetching DATAS
   */
  fetch(
    "https://raider.io/api/v1/characters/profile?" +
      new URLSearchParams({
        region: region,
        realm: realm,
        name: name,
        fields: "mythic_plus_best_runs",
      })
  ).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        //Traitement des données
        loader.classList.remove("active");
        thumbnail_img.src = data.thumbnail_url;
        bestkey(data.mythic_plus_best_runs);
      });
    } else {
      clearingDom();
      error_div.innerHTML = "Sorry, an error occurred !";
    }
  });

  fetch(
    "https://raider.io/api/v1/characters/profile?" +
      new URLSearchParams({
        region: region,
        realm: realm,
        name: name,
        fields: "mythic_plus_alternate_runs",
      })
  ).then((res) => {
    if (res.ok) {
      res.json().then((data) => {
        //traitement des données
        loader.classList.remove("active");
        lowerkey(data.mythic_plus_alternate_runs);
      });
    } else {
      clearingDom();
      error_div.innerHTML = "Sorry, an error occurred !";
    }
  });

  fetch(
    "https://raider.io/api/v1/characters/profile?" +
      new URLSearchParams({
        region: region,
        realm: realm,
        name: name,
        fields: "mythic_plus_scores_by_season:current",
      })
  ).then(function (res) {
    if (res.ok) {
      res.json().then((data) => {
        //traitement des données
        loader.classList.remove("active");
        let score_rio = document.querySelector(".score_rio");
        score_rio.innerHTML = data.mythic_plus_scores_by_season[0].segments.all.score;
        score_rio.style.color = data.mythic_plus_scores_by_season[0].segments.all.color;
      });
    } else {
      clearingDom();
      error_div.innerHTML = "Sorry, an error occurred !";
    }
  });
});

function pourcentage(time, clear) {
  let pourcent = ((time / 60000 - clear / 60000) / (time / 6000)) * 1000;
  pourcent = pourcent.toFixed(1);
  return pourcent;
}

function bestkey(best_keys) {
  best_keys.forEach((key) => {
    let card = document.createElement("div");
    card.classList.add("card");
    keys_div.appendChild(card);

    let key_name = document.createElement("div");
    key_name.classList.add("title");
    key_name.innerHTML = key.dungeon;
    card.appendChild(key_name);

    let key_content = document.createElement("div");
    key_content.classList.add("key_content");
    card.appendChild(key_content);

    let fortified_col = document.createElement("div");
    let tyranical_col = document.createElement("div");
    fortified_col.classList.add("card--col", "fortified");
    tyranical_col.classList.add("card--col", "tyranical");
    key_content.appendChild(fortified_col);
    key_content.appendChild(tyranical_col);

    let fortified_level = document.createElement("a");
    let tyranical_level = document.createElement("a");
    fortified_level.classList.add("key_level", "fortified_level");
    tyranical_level.classList.add("key_level", "tyranical_level");
    fortified_col.appendChild(fortified_level);
    tyranical_col.appendChild(tyranical_level);

    let fortified_score = document.createElement("div");
    let tyranical_score = document.createElement("div");
    fortified_score.classList.add("score", "fortified_score");
    tyranical_score.classList.add("score", "tyranical_score");
    fortified_col.appendChild(fortified_score);
    tyranical_col.appendChild(tyranical_score);

    let fortified_time = document.createElement("div");
    let tyranical_time = document.createElement("div");
    fortified_time.classList.add("time", "fortified_time");
    tyranical_time.classList.add("time", "tyranical_time");
    fortified_col.appendChild(fortified_time);
    tyranical_col.appendChild(tyranical_time);

    if (key.affixes[0].name == "Fortified") {
      fortified_level.href = key.url;
      fortified_level.innerHTML = `Fortified +${key.mythic_level}<span class="best">(*)</span>`;
      fortified_score.innerHTML = (key.score * 1.5).toFixed(1);
      let timing = pourcentage(key.par_time_ms, key.clear_time_ms);
      if (timing <= 0) {
        fortified_time.classList.add("negative");
      }
      fortified_time.innerHTML = `${timing}%`;
    } else {
      tyranical_level.href = key.url;
      tyranical_level.innerHTML = `Tyranical +${key.mythic_level}<span class="best">(*)</span>`;
      tyranical_score.innerHTML = (key.score * 1.5).toFixed(1);
      let timing = pourcentage(key.par_time_ms, key.clear_time_ms);
      if (timing <= 0) {
        tyranical_time.classList.add("negative");
      }
      tyranical_time.innerHTML = `${timing}%`;
    }
  });
}

function lowerkey(lower_keys) {
  const keys_array = [...keys_div.children];

  lower_keys.forEach((lower) => {
    keys_array.forEach((key) => {
      if (key.childNodes[0].textContent === lower.dungeon) {
        if (lower.affixes[0].name == "Fortified") {
          let fortified_level = key.querySelector(".key_level.fortified_level");
          let fortified_score = key.querySelector(".score.fortified_score");
          let fortified_time = key.querySelector(".time.fortified_time");
          fortified_level.href = lower.url;
          fortified_level.innerHTML = `Fortified +${lower.mythic_level}`;
          fortified_score.innerHTML = (lower.score * 0.5).toFixed(1);
          let timing = pourcentage(lower.par_time_ms, lower.clear_time_ms);
          if (timing <= 0) {
            fortified_time.classList.add("negative");
          }
          fortified_time.innerHTML = `${timing}%`;
        } else {
          let tyranical_level = key.querySelector(".key_level.tyranical_level");
          let tyranical_score = key.querySelector(".score.tyranical_score");
          let tyranical_time = key.querySelector(".time.tyranical_time");
          tyranical_level.href = lower.url;
          tyranical_level.innerHTML = `Tyranical +${lower.mythic_level}`;
          tyranical_score.innerHTML = (lower.score * 0.5).toFixed(1);
          let timing = pourcentage(lower.par_time_ms, lower.clear_time_ms);
          if (timing <= 0) {
            tyranical_time.classList.add("negative");
          }
          tyranical_time.innerHTML = `${timing}%`;
        }
      }
    });
  });
}

//   value.forEach((key, index) => {
//     //Div content
//     let key_content = document.createElement("div");
//     key_content.classList.add("card");

//     //Key name
//     let key_name = document.createElement("div");
//     key_name.classList.add("title");
//     key_name.innerHTML = key.dungeon;

//     let column = document.createElement("div");
//     column.classList.add("key_content");

//     //Fortified table
//     let fortified = document.createElement("div");
//     fortified.classList.add("card--col fortified");

//     //Key level
//     let key_fortified_level = document.createElement("a");
//     key_fortified_level.classList.add("key_level fortified");
//     key_fortified_level.setAttribute("id", key.dungeon + "_fortified_level");
//     key_fortified_level.setAttribute("target", "_blank");

//     //Key score
//     let fortified_score = document.createElement("div");
//     fortified_score.classList.add("score");
//     fortified_score.setAttribute("id", key.dungeon + "_fortified_score");
//     fortified_score.addEventListener("click", function (event) {
//       event.preventDefault();

//       calculation(key.dungeon, "fortified");
//     });

//     //Key time
//     let fortified_time = document.createElement("p");
//     fortified_time.classList.add("timer");
//     fortified_time.setAttribute("id", key.dungeon + "_fortified_time");

//     //Tyranical table
//     let tyranical = document.createElement("div");
//     tyranical.classList.add("tyranical");

//     //Key level
//     let key_tyranical_level = document.createElement("a");
//     key_tyranical_level.classList.add("key_level");
//     key_tyranical_level.classList.add("tyranical");
//     key_tyranical_level.setAttribute("id", key.dungeon + "_tyranical_level");
//     key_tyranical_level.setAttribute("target", "_blank");

//     //Key score
//     let tyranical_score = document.createElement("p");
//     tyranical_score.classList.add("tyranical_score");
//     tyranical_score.setAttribute("id", key.dungeon + "_tyranical_score");
//     tyranical_score.addEventListener("click", function (event) {
//       event.preventDefault();

//       calculation(key.dungeon, "tyranical");
//     });

//     //Key time
//     let tyranical_time = document.createElement("p");
//     tyranical_time.classList.add("tyranical_time");
//     tyranical_time.setAttribute("id", key.dungeon + "_tyranical_time");

//     let pourcent = ((key.par_time_ms / 60000 - key.clear_time_ms / 60000) / (key.par_time_ms / 6000)) * 1000;
//     pourcent = pourcent.toFixed(1);

//     //Adding DATAS to field with conditional
//     if (key.affixes[0].id === 9) {
//       key_tyranical_level.classList.add("best");
//       key_tyranical_level.innerHTML = key.affixes[0].name + " +" + key.mythic_level + "(*)";
//       key_tyranical_level.setAttribute("href", key.url);
//       tyranical_score.innerHTML = (key.score * 1.5).toFixed(1);
//       tyranical_time.innerHTML = pourcent + "%";

//       if (pourcent < 0) {
//         tyranical_time.style.color = "#be0000";
//       } else {
//         tyranical_time.style.color = "#cccccc";
//       }
//     }

//     if (key.affixes[0].id === 10) {
//       key_fortified_level.classList.add("best");
//       key_fortified_level.innerHTML = key.affixes[0].name + " +" + key.mythic_level + "(*)";
//       key_fortified_level.setAttribute("href", key.url);
//       fortified_score.innerHTML = (key.score * 1.5).toFixed(1);
//       fortified_time.innerHTML = pourcent + "%";

//       if (pourcent < 0) {
//         fortified_time.style.color = "#be0000";
//       } else {
//         fortified_time.style.color = "#cccccc";
//       }
//     }

//     /**
//      * Condition to know where we are in table
//      */
//     if (index < value.mythic_plus_best_runs.length / 2) {
//       document.getElementById("group_one").appendChild(key_content);
//       key_content.appendChild(key_name);
//       key_content.appendChild(column);

//       column.appendChild(fortified);
//       fortified.appendChild(key_fortified_level);
//       fortified.appendChild(fortified_score);
//       fortified.appendChild(fortified_time);

//       column.appendChild(tyranical);
//       tyranical.appendChild(key_tyranical_level);
//       tyranical.appendChild(tyranical_score);
//       tyranical.appendChild(tyranical_time);
//     } else {
//       document.getElementById("group_two").appendChild(key_content);
//       key_content.appendChild(key_name);
//       key_content.appendChild(column);

//       column.appendChild(fortified);
//       fortified.appendChild(key_fortified_level);
//       fortified.appendChild(fortified_score);
//       fortified.appendChild(fortified_time);

//       column.appendChild(tyranical);
//       tyranical.appendChild(key_tyranical_level);
//       tyranical.appendChild(tyranical_score);
//       tyranical.appendChild(tyranical_time);
//     }
//   });
// }

// /**
//  *
//  * Lowest keys values
//  */
// function lowestkey(value) {
//   value.mythic_plus_alternate_runs.forEach((key, index) => {
//     let pourcent = ((key.par_time_ms / 60000 - key.clear_time_ms / 60000) / (key.par_time_ms / 6000)) * 1000;
//     pourcent = pourcent.toFixed(1);

//     if (key.affixes[0].id === 9) {
//       document.getElementById(key.dungeon + "_tyranical_level").innerHTML = key.affixes[0].name + " +" + key.mythic_level;
//       document.getElementById(key.dungeon + "_tyranical_level").setAttribute("href", key.url);
//       document.getElementById(key.dungeon + "_tyranical_score").innerHTML = (key.score * 0.5).toFixed(1);
//       document.getElementById(key.dungeon + "_tyranical_time").innerHTML = pourcent + "%";

//       if (pourcent < 0) {
//         document.getElementById(key.dungeon + "_tyranical_time").style.color = "#be0000";
//       } else {
//         document.getElementById(key.dungeon + "_tyranical_time").style.color = "#cccccc";
//       }
//     }

//     if (key.affixes[0].id === 10) {
//       document.getElementById(key.dungeon + "_fortified_level").innerHTML = key.affixes[0].name + " +" + key.mythic_level;
//       document.getElementById(key.dungeon + "_fortified_level").setAttribute("href", key.url);
//       document.getElementById(key.dungeon + "_fortified_score").innerHTML = (key.score * 0.5).toFixed(1);
//       document.getElementById(key.dungeon + "_fortified_time").innerHTML = pourcent + "%";
//       if (pourcent < 0) {
//         document.getElementById(key.dungeon + "_fortified_time").style.color = "#be0000";
//       } else {
//         document.getElementById(key.dungeon + "_fortified_time").style.color = "#cccccc";
//       }
//     }
//   });
// }

// function calculation(dungeon, affixe) {
//   let key_level_input = document.getElementById("key_input");
//   let key_level_text = document.getElementById("output");
//   let key_best_input = document.getElementById("best_key_input");

//   let raiderio_key_level = document.getElementById(dungeon + "_" + affixe + "_level");
//   let raiderio_time_level = document.getElementById(dungeon + "_" + affixe + "_time");
//   let raiderio_score_level = document.getElementById(dungeon + "_" + affixe + "_score");

//   key_level_input.setAttribute("value", raiderio_key_level.textContent.replace(/\D/g, ""));
//   key_level_text.innerHTML = raiderio_key_level.textContent.replace(/\D/g, "");

//   let best = false;

//   raiderio_key_level.classList.forEach((element) => {
//     if (element === "best") {
//       key_best_input.checked = true;
//       best = true;
//     } else {
//       key_best_input.checked = false;
//       best = false;
//     }
//   });

//   document.getElementById("difference").innerHTML = raiderio_score_level.textContent;

//   let result = lib.keystone_point_calculator(raiderio_key_level.textContent.replace(/\D/g, ""), best, raiderio_time_level.textContent.replace(/%/g, ""));
//   document.getElementById("result").innerHTML = result;
// }

// function rioscore(value) {
//   let score = value.mythic_plus_scores_by_season[0].scores.all;
//   let color = value.mythic_plus_scores_by_season[0].segments.all.color;
//   let html_rio_score = document.getElementById("rio_score");
//   html_rio_score.innerHTML = score;
//   html_rio_score.style.color = color;
// }
