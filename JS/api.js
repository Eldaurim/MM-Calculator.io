import * as lib from './function.js';

const fetch_button = document.getElementById("fetch_button"); //Get DATAS from RaiderIO

fetch_button.addEventListener("click", function (event) {
  event.preventDefault();

  /**
   * Get values input
   */
  let region = document.getElementById("Region_input").value;
  let realm = document.getElementById("Realm_input").value;
  let name = document.getElementById("Name_input").value;

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
  )
    .then(function (res) {
      if (res.ok) {
        document.getElementById("Error_div").innerHTML = "";
        return res.json();
      } else {
        document.getElementById("Error_div").innerHTML =
          "Sorry, an error occurred !";
      }
    })
    .then(function (value) {
      bestkey(value);
    })
    .catch(function (err) {
      // Une erreur est survenue
    });

  fetch(
    "https://raider.io/api/v1/characters/profile?" +
      new URLSearchParams({
        region: region,
        realm: realm,
        name: name,
        fields: "mythic_plus_alternate_runs",
      })
  )
    .then(function (res) {
      if (res.ok) {
        document.getElementById("Error_div").innerHTML = "";
        return res.json();
      } else {
        document.getElementById("Error_div").innerHTML =
          "Sorry, an error occurred !";
      }
    })
    .then(function (value) {
      lowestkey(value);
    })
    .catch(function (err) {
      document.getElementById("Error_div").innerHTML =
        "Sorry, an error occurred !";
    });
});

/**
 * 
 * Best keys values
 */
function bestkey(value) {

  /**
   * Clearing DOM
   */
  const gr_one = document.getElementById("group_one");
  while (gr_one.firstChild) {
    gr_one.removeChild(gr_one.lastChild);
  }
  const gr_two = document.getElementById("group_two");
  while (gr_two.firstChild) {
    gr_two.removeChild(gr_two.lastChild);
  }

  /**
   * Loop to display all best keys in correct field
   * 
   */
  value.mythic_plus_best_runs.forEach((key, index) => {

    //Div content
    let key_content = document.createElement("div");
    key_content.classList.add("key_content");

    //Key name
    let key_name = document.createElement("p");
    key_name.classList.add("name");
    key_name.innerHTML = key.dungeon;

    let column = document.createElement("div");
    column.classList.add("column");

    //Fortified table
    let fortified = document.createElement("div");
    fortified.classList.add("fortified");

    //Key level
    let key_fortified_level = document.createElement("a");
    key_fortified_level.classList.add("key_level");
    key_fortified_level.classList.add("fortified");
    key_fortified_level.setAttribute("id", key.dungeon+"_fortified_level");
    key_fortified_level.setAttribute("target", "_blank");

    //Key score
    let fortified_score = document.createElement("p");
    fortified_score.classList.add("fortified_score");
    fortified_score.setAttribute("id", key.dungeon+"_fortified_score");
    fortified_score.addEventListener("click", function (event) {

      event.preventDefault();

      calculation(key.dungeon, "fortified");
    });

    //Key time
    let fortified_time = document.createElement("p");
    fortified_time.classList.add("fortified_time");
    fortified_time.setAttribute("id", key.dungeon+"_fortified_time");

    //Tyranical table
    let tyranical = document.createElement("div");
    tyranical.classList.add("tyranical");

    //Key level
    let key_tyranical_level = document.createElement("a");
    key_tyranical_level.classList.add("key_level");
    key_tyranical_level.classList.add("tyranical");
    key_tyranical_level.setAttribute("id", key.dungeon+"_tyranical_level");
    key_tyranical_level.setAttribute("target", "_blank");

    //Key score
    let tyranical_score = document.createElement("p");
    tyranical_score.classList.add("tyranical_score");
    tyranical_score.setAttribute("id", key.dungeon+"_tyranical_score");
    tyranical_score.addEventListener("click", function (event) {

      event.preventDefault();

      calculation(key.dungeon, "tyranical");
    });

    //Key time
    let tyranical_time = document.createElement("p");
    tyranical_time.classList.add("tyranical_time");
    tyranical_time.setAttribute("id", key.dungeon+"_tyranical_time");

    let pourcent = (((key.par_time_ms/60000) - (key.clear_time_ms/60000)) / (key.par_time_ms/6000)) * 1000;
    pourcent = pourcent.toFixed(1);

    //Adding DATAS to field with conditional
    if(key.affixes[0].id === 9) {
      key_tyranical_level.classList.add("best");
      key_tyranical_level.innerHTML = key.affixes[0].name + " +" + key.mythic_level;
      key_tyranical_level.setAttribute("href", key.url);
      tyranical_score.innerHTML = (key.score*1.5).toFixed(1);
      tyranical_time.innerHTML = pourcent + "%";
    }

    if(key.affixes[0].id === 10) {
      key_fortified_level.classList.add("best");
      key_fortified_level.innerHTML = key.affixes[0].name + " +" + key.mythic_level;
      key_fortified_level.setAttribute("href", key.url);
      fortified_score.innerHTML = (key.score*1.5).toFixed(1);
      fortified_time.innerHTML = pourcent + "%";
    }


    /**
     * Condition to know where we are in table
     */
    if(index < (value.mythic_plus_best_runs.length/2)) {
      document.getElementById("group_one").appendChild(key_content);
      key_content.appendChild(key_name);
      key_content.appendChild(column);
      
      column.appendChild(fortified);
        fortified.appendChild(key_fortified_level);
        fortified.appendChild(fortified_score);
        fortified.appendChild(fortified_time);

        column.appendChild(tyranical);
        tyranical.appendChild(key_tyranical_level);
        tyranical.appendChild(tyranical_score);
        tyranical.appendChild(tyranical_time);
    } else {
      document.getElementById("group_two").appendChild(key_content);
      key_content.appendChild(key_name);
      key_content.appendChild(column);

      column.appendChild(fortified);
        fortified.appendChild(key_fortified_level);
        fortified.appendChild(fortified_score);
        fortified.appendChild(fortified_time);

        column.appendChild(tyranical);
        tyranical.appendChild(key_tyranical_level);
        tyranical.appendChild(tyranical_score);
        tyranical.appendChild(tyranical_time);
    }
  });
}

/**
 * 
 * Lowest keys values
 */
function lowestkey(value) {

  value.mythic_plus_alternate_runs.forEach((key, index) => {

    let pourcent = (((key.par_time_ms/60000) - (key.clear_time_ms/60000)) / (key.par_time_ms/6000)) * 1000;
    pourcent = pourcent.toFixed(1);

    if(key.affixes[0].id === 9){
      document.getElementById(key.dungeon+"_tyranical_level").innerHTML = key.affixes[0].name + " +" + key.mythic_level;
      document.getElementById(key.dungeon+"_tyranical_level").setAttribute("href", key.url);
      document.getElementById(key.dungeon+"_tyranical_score").innerHTML = (key.score*0.5).toFixed(1);
      document.getElementById(key.dungeon+"_tyranical_time").innerHTML = pourcent+"%";
    }

    if(key.affixes[0].id === 10){
      document.getElementById(key.dungeon+"_fortified_level").innerHTML = key.affixes[0].name + " +" + key.mythic_level;
      document.getElementById(key.dungeon+"_fortified_level").setAttribute("href", key.url);
      document.getElementById(key.dungeon+"_fortified_score").innerHTML = (key.score*0.5).toFixed(1);
      document.getElementById(key.dungeon+"_fortified_time").innerHTML = pourcent+"%";
    }
  });
}

function calculation(dungeon, affixe) {

  let key_level_input = document.getElementById("key_input");
  let key_level_text = document.getElementById("output");
  let key_best_input = document.getElementById("best_key_input");
  
  let raiderio_key_level = document.getElementById(dungeon + "_" + affixe + "_level");
  let raiderio_time_level = document.getElementById(dungeon + "_" + affixe + "_time");
  let raiderio_score_level = document.getElementById(dungeon + "_" + affixe + "_score");

  key_level_input.setAttribute("value", raiderio_key_level.textContent.replace(/\D/g, ''));
  key_level_text.innerHTML = raiderio_key_level.textContent.replace(/\D/g, '');

  let best = false;

  raiderio_key_level.classList.forEach(element => {
    if(element === "best") {
      key_best_input.checked = true;
      best = true;
    } else {
      key_best_input.checked = false;
      best = false;
    }
  });

  document.getElementById("difference").innerHTML = raiderio_score_level.textContent;

  let result = lib.keystone_point_calculator(raiderio_key_level.textContent.replace(/\D/g, ''), best, raiderio_time_level.textContent.replace(/%/g, ''));
  document.getElementById("result").innerHTML = result;
}