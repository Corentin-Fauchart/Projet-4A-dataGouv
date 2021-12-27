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

async function getDataAtPreciseDateDep(dep, date) {
    let res = [];
    console.log(dep + '   ' + date);
    await $.get("https://coronavirusapifr.herokuapp.com/data/departement/" + dep + "/" + date, function (result) {
        console.log(result);
        //console.log("ALLOOOOOOOO");
        let jsonRequest = JSON.stringify(result);
        let objRequest = JSON.parse(jsonRequest);
        res = objRequest[0];
    });
    return res;
}


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

function createChart(myChart, )

var labels = [];
var dataForEachDay = [];
var selectedDep = listOfDep.get(parseInt($("#select_dep").val()));
var dataHosp = [];

var chart1sem;
var chart15j;
var chart1m;
var today = new Date();

$('#1sem').on('click', () =>{
    if(chart1sem == undefined){
        for(let i=0; i<7; i++){
            labels.unshift(calculNewDate(i)); //Ajoute les éléments aux débuts du tableau
            dataForEachDay.unshift(getDataAtPreciseDateDep(selectedDep,labels[0]));
        }
        console.log("AHHHHHHHHHHHHHHHHHHHHHHHHHHHHH");
        dataForEachDay.forEach(element =>  dataHosp.unshift(element.hosp));
        
        const data = {
            labels: labels,
            datasets: [{
              label: 'Hospitalisations - '+selectedDep+' 1 semaine',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: dataHosp,
            }]
        };
        const config = {
            type: 'line',
            data: data,
            options: {}
        };
        
        chart1sem = new Chart(
            $('#myChart'),
            config
        );
        console.log(labels);
        console.log(dataForEachDay);
    }
})

$('#15j').on('click', () =>{
    if(chart1sem == undefined){
        for(let i=0; i<15; i++){
            
        }
    }
})

$('#1m').on('click', () =>{
    if(chart1sem == undefined){
        for(let i=0; i<30; i++){
            
        }
    }
})









