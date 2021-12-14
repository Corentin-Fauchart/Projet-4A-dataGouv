

var resDisplay = document.querySelector('#test');

$.get("https://coronavirusapifr.herokuapp.com/data/live/france", function(result){
  console.log(result);
  $("#test").text(JSON.stringify(result));
})

/*
fetch("https://coronavirusapifr.herokuapp.com/data/live/france",{mode: "no-cors"}).then(function(response) {
    response.json().then(function(text) {
      resDisplay.html = text;
    });
  });

  */