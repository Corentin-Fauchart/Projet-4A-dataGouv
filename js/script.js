//C'est super bien ranger
$.get("https://coronavirusapifr.herokuapp.com/data/live/departements", function(result){
  //console.log(result);
  //console.log("ALLOOOOOOOO");
  let jsonRequest = JSON.stringify(result);
  let objRequest = JSON.parse(jsonRequest);
  $("#test").text(jsonRequest);
  
  //console.log(objRequest);
  let selectedDep = $("#select_dep").val();
    //console.log(selectedDep);
    $("#date_donnees").text(objRequest[selectedDep-1].date);

    $("#region").text(objRequest[selectedDep-1].lib_reg);
    $("#dep").text(objRequest[selectedDep-1].lib_dep);

    $("#v1").text(objRequest[selectedDep-1].rea);
    $("#v2").text(objRequest[selectedDep-1].hosp);
    $("#v3").text(objRequest[selectedDep-1].rad);
    $("#v4").text(objRequest[selectedDep-1].dchosp);

  $("#select_dep").on('change', () =>{
    let selectedDep = $("#select_dep").val();
    //console.log(selectedDep);
    $("#date_donnees").text(objRequest[selectedDep-1].date);

    $("#region").text(objRequest[selectedDep-1].lib_reg);
    $("#dep").text(objRequest[selectedDep-1].lib_dep);

    $("#v1").text(objRequest[selectedDep-1].rea);
    $("#v2").text(objRequest[selectedDep-1].hosp);
    $("#v3").text(objRequest[selectedDep-1].rad);
    $("#v4").text(objRequest[selectedDep-1].dchosp);
  })
})
