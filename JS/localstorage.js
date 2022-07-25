if(localStorage.getItem('mmplus_region') === null) {

}else {
    document.getElementById('Region_input').value = localStorage.getItem('mmplus_region');
}

if(localStorage.getItem('mmplus_realm') === null) {

}else {
    document.getElementById('Realm_input').value = localStorage.getItem('mmplus_realm');
}

if(localStorage.getItem('mmplus_pseudo') === null) {

}else {
    document.getElementById('Name_input').value = localStorage.getItem('mmplus_pseudo');
}