localStorage.getItem("mmplus_region") == "eu" ? (document.querySelector("#region").value = "eu") : false;
localStorage.getItem("mmplus_region") == "us" ? (document.querySelector("#region").value = "us") : false;

localStorage.getItem("mmplus_realm") != undefined ? (document.querySelector("#server").value = localStorage.getItem("mmplus_realm")) : false;
localStorage.getItem("mmplus_pseudo") != undefined ? (document.querySelector("#pseudo").value = localStorage.getItem("mmplus_pseudo")) : false;
