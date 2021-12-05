var resDisplay = document.querySelector('#test');

fetch("https://www.data.gouv.fr/fr/reuses/coronavirusapi-france/").then(function(response) {
    response.text().then(function(text) {
      resDisplay.html = text;
    });
  });