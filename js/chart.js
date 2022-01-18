/*
const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
];

const data = {
    labels: labels,
    datasets: [{
      label: 'My First dataset',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: [0, 10, 5, 2, 20, 30, 45],
    }]
};

const config = {
    type: 'line',
    data: data,
    options: {}
};

const myChart = new Chart(
    $('#myChart'),
    config
);
*/

/*
Fonction permettant de récupérer vers l'API les données d'un département à une date précise.
*/

function getDataAtPreciseDateDep(dep, date, res) {
        console.log(dep + '   ' + date);
        return $.get("https://coronavirusapifr.herokuapp.com/data/departement/" + dep + "/" + date, function (result) {
            console.log(result);
            //console.log("ALLOOOOOOOO");
            let jsonRequest = JSON.stringify(result);
            let objRequest = JSON.parse(jsonRequest);
            res.push(objRequest[0]);
        });
}

function getDataOnAPeriod(dep, res, days, labels){
    console.log("OUIII");
    return new Promise((success, failure) =>{
        let nbERROR = 0;
        let promises = [];
        for(let i=0; i<days; i++){
            promises.push(getDataAtPreciseDateDep(dep, calculNewDate(i+nbERROR), res).done(function() {
                //Si la fonction a bien trouvé des données pour cette date
                console.log("FOUND DATA");
                labels.unshift(calculNewDate(i+nbERROR)); //Ajoute les éléments aux débuts du tableau
            }).fail(function() {
                //Si la fonction n'a pas réussi à trouver des données pour cette date
                console.log("FOUND NO DATA");
                nbERROR++;
                i--;
            }))
        }
        console.log(promises);
        Promise.allSettled(promises).then(() =>{
            if(res.length === days){
                console.log(res.length+' - '+days);
                success();
            }else{
                console.log(res.length+' - '+days);
                failure();
            }
        })
    })
}

var resetCanvas = function(){
    $('#results-graph').remove(); // this is my <canvas> element
    $('#graph-container').append('<canvas id="results-graph"><canvas>');
    canvas = document.querySelector('#results-graph');
    ctx = canvas.getContext('2d');
    ctx.canvas.width = $('#graph-container').width(); // resize to parent width
    ctx.canvas.height = $('#graph-container').height(); // resize to parent height
    var x = canvas.width/2;
    var y = canvas.height/2;
    ctx.font = '10pt Verdana';
    ctx.textAlign = 'center';
    ctx.fillText('This text is centered on the canvas', x, y);
};

function buildMyChart(labels, selectedDep, dataHosp){
    resetCanvas();
    console.log('new chart');
    const data = {
        labels: labels,
            datasets: [{
                label: 'Hospitalisations - '+selectedDep+' - 1 semaine',
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgb(255, 99, 132)',
                data: dataHosp,
            }]
        };
        const config = {
            type: 'line',
            data: data,
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        };
    
        let myChart = new Chart(
            $('#results-graph'),
            config
        );
}


var labelsFor7Days = [];
var labelsFor15Days = [];
var labelsFor30Days = [];

var dataFor7Days = [];
var dataFor15Days = [];
var dataFor30Days = [];

var selectedDep = listOfDep.get(parseInt($("#select_dep").val()));
var dataHosp = [];


var today = new Date();

$('#1sem').on('click', () =>{
    if(dataFor7Days.length == 0){
        getDataOnAPeriod(selectedDep,dataFor7Days,7,labelsFor7Days).then(() =>{
            sortDataTableWithDate(dataFor7Days);
            sortLabelsTableWithDate(labelsFor7Days);
            dataFor7Days.reverse();
            console.log(dataFor7Days);
            console.log(labelsFor7Days);

            dataFor7Days.forEach(element =>  dataHosp.unshift(element.hosp));
            buildMyChart(labelsFor7Days,selectedDep,dataHosp);
            
        }).catch((err) =>{
            console.log("ERREUR LORS DE LA RECUPERATION DES DONNEES.");
            console.error(err);
        })
    }else{
        dataFor7Days.forEach(element =>  dataHosp.unshift(element.hosp));
        buildMyChart(labelsFor7Days,selectedDep,dataHosp);
    }
    
})

$('#15j').on('click', () =>{
    if(dataFor15Days.length == 0){
        getDataOnAPeriod(selectedDep,dataFor15Days,15,labelsFor15Days).then(() =>{
            sortDataTableWithDate(dataFor15Days);
            sortLabelsTableWithDate(labelsFor15Days);
            dataFor15Days.reverse();

            dataFor15Days.forEach(element =>  dataHosp.unshift(element.hosp));
        
            buildMyChart(labelsFor15Days,selectedDep,dataHosp);
            
            console.log(myChart);
        }).catch(() =>{
            console.log("ERREUR LORS DE LA RECUPERATION DES DONNEES.");
        })
    }else{
        dataFor15Days.forEach(element =>  dataHosp.unshift(element.hosp));
        
        buildMyChart(labelsFor15Days,selectedDep,dataHosp);
    }
})

$('#1m').on('click', () =>{
    if(dataFor30Days.length == 0){
        getDataOnAPeriod(selectedDep,dataFor30Days,30,labelsFor30Days).then(() =>{
            sortDataTableWithDate(dataFor30Days);
            sortLabelsTableWithDate(labelsFor30Days);
            dataFor30Days.reverse();

            dataFor30Days.forEach(element =>  dataHosp.unshift(element.hosp));
            buildMyChart(labelsFor30Days,selectedDep,dataHosp);
            
        }).catch(() =>{
            console.log("ERREUR LORS DE LA RECUPERATION DES DONNEES.");
        })
        
    }else{
        dataFor30Days.forEach(element =>  dataHosp.unshift(element.hosp));
        buildMyChart(labelsFor30Days,selectedDep,dataHosp);
    }
})

/*
Fonction permettant de retourner la bonne date lorsque l'on enlève i jours à la date courante.
*/
function calculNewDate(i){
    let date = (today.getDate()-1-i)+'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    let dayOfToday = today.getDate()-1;
    if((dayOfToday-i)<1){
        if(today.getMonth() == 2){ //Si c'est le mois de février
            dayOfToday += 29 - i;
            date = dayOfToday+'-'+today.getMonth()+'-'+today.getFullYear();

        }else if( ((today.getMonth()+1)%2) == 1){
            dayOfToday += 31 - i;
            if(today.getMonth()==0){ //Si on est en janvier et qu'on reviens d'un an
                date = dayOfToday+'-12-'+(today.getFullYear()-1);
            }else{
                date = dayOfToday+'-'+today.getMonth()+'-'+today.getFullYear();
            }
        }else{
            dayOfToday += 30 - i;
            date = dayOfToday+'-'+today.getMonth()+'-'+today.getFullYear();
        }
    }
    return date;
}

function sortDataTableWithDate(table){
    var changed;
    do{
        changed = false;
        for(var i=0; i < table.length-1; i++) {
            //console.log(table);
            //console.log(formatDateInFR(table[i].date));
            var d1 = formatDateInFR(table[i].date);
            var d2 = formatDateInFR(table[i+1].date);
            if(compareDates(d1, d2)) {
                var tmp = table[i];
                table[i] = table[i+1];
                table[i+1] = tmp;
                changed = true;
            }
        }
    } while(changed);
}

function sortLabelsTableWithDate(table){
    var changed;
    do{
        changed = false;
        for(var i=0; i < table.length-1; i++) {
            //console.log(table);
            var d1 = table[i];
            var d2 = table[i+1];
            if(compareDates(d1, d2)) {
                var tmp = table[i];
                table[i] = table[i+1];
                table[i+1] = tmp;
                changed = true;
            }
        }
    } while(changed);
}

// Takes two strings as input, format is dd-mm-yyyy
// returns true if d1 is bigger than  d2

function compareDates(d1, d2){
    var partsD1 = d1.split('-');
    var partsD2 = d2.split('-');
    var res = false;
    if(parseInt(partsD1[2],10) > parseInt(partsD2[2],10)){
        res = true;
    }else if(parseInt(partsD1[2],10) == parseInt(partsD2[2],10)){
        if(parseInt(partsD1[1],10) > parseInt(partsD2[1],10)){
            res = true;
        }else if(parseInt(partsD1[1],10) == parseInt(partsD2[1],10)){
            if(parseInt(partsD1[0],10) > parseInt(partsD2[0],10)){
                res = true;
            }
        }
    }
    return res;
}

/*
Fonction permettant de passer une date du format US au format FR 
*/
function formatDateInFR(date){
    var parts = date.split('-');
    var res = parts[2] + '-' + parts[1]+ '-' + parts[0];
    return res;
}







