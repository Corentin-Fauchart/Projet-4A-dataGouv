
$.get("https://coronavirusapifr.herokuapp.com/data/live/departements", function(result){
  //console.log(result);
  console.log("ALLOOOOOOOO");
  let jsonRequest = JSON.stringify(result);
  let objRequest = JSON.parse(jsonRequest);
  $("#test").text(jsonRequest);
  
  console.log(objRequest);
	UpdateTable();

  $("#select_dep").on('change', () =>{
    UpdateTable();
  })
  
  function UpdateTable() {
    let selectedDep = $("#select_dep").val();
    console.log(objRequest[selectedDep]);
    $("#date_donnees").text(objRequest[selectedDep].date);

    $("#region").text(objRequest[selectedDep].lib_reg);
    $("#dep").text(objRequest[selectedDep].lib_dep);

    $("#v1").text(objRequest[selectedDep].rea);
    $("#v2").text(objRequest[selectedDep].hosp);
    $("#v3").text(objRequest[selectedDep].rad);
    $("#v4").text(objRequest[selectedDep].dchosp);
}
  
})