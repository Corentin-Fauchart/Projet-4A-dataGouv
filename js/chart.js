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

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function buildMyChart(labels, selectedDep, dataHosp){
    if(myChart === undefined){
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
        
            myChart = new Chart(
                $('#myChart'),
                config
            );
    }else{
        //IL FAUT CORRIGER LA MODIFICATION DES DONNEES DANS LE CHART
        console.log('modify existing chart');
        removeData(myChart);
        let datasets = [{
            label: 'Hospitalisations - '+selectedDep+' - 1 semaine',
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: dataHosp,
        }];
        addData(myChart, labels, datasets);
    }
    
}


var labelsFor7Days = [];
var labelsFor15Days = [];
var labelsFor30Days = [];

var dataFor7Days = [];
var dataFor15Days = [];
var dataFor30Days = [];

var selectedDep = listOfDep.get(parseInt($("#select_dep").val()));
var dataHosp = [];

var myChart;

var today = new Date();

$('#1sem').on('click', () =>{
    if(dataFor7Days.length == 0){
        getDataOnAPeriod(selectedDep,dataFor7Days,7,labelsFor7Days).then(() =>{
            dataFor7Days.forEach(element =>  dataHosp.unshift(element.hosp));
            buildMyChart(labelsFor7Days,selectedDep,dataHosp);
            
                //console.log(labels);
                //console.log(dataFor7Days);
                console.log(myChart);
        }).catch(() =>{
            console.log("ERREUR LORS DE LA RECUPERATION DES DONNEES.");
        })
    }else{
        dataFor7Days.forEach(element =>  dataHosp.unshift(element.hosp));
        buildMyChart(labelsFor7Days,selectedDep,dataHosp);
    }
    
})

$('#15j').on('click', () =>{
    if(dataFor15Days.length == 0){
        getDataOnAPeriod(selectedDep,dataFor15Days,15,labelsFor15Days).then(() =>{
            dataFor15Days.forEach(element =>  dataHosp.unshift(element.hosp));
        
            buildMyChart(labelsFor15Days,selectedDep,dataHosp);
            //console.log(labels);
            //console.log(dataForEachDay);
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
            dataFor30Days.forEach(element =>  dataHosp.unshift(element.hosp));
            buildMyChart(labelsFor30Days,selectedDep,dataHosp);
            
            //console.log(labels);
            //console.log(dataForEachDay);
            console.log(myChart);
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









