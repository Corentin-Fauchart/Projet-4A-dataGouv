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

var labelsFor7Days = new Array();
var labelsFor15Days = new Array();
var labelsFor30Days = new Array();

var temporaryTable = [];

var dataFor7Days = new Map();
var dataFor15Days = new Map();
var dataFor30Days = new Map();

var selectedDep = listOfDep.get(parseInt($("#select_dep").val()));;
var selectedDatas ;


var today = new Date();

$("#select_dep").on('change', () =>{
    selectedDep = listOfDep.get(parseInt($("#select_dep").val()));
});

$("#multiple-select").on('change', () =>{
    selectedDatas = document.querySelector('#multiple-select').getSelectedOptions();
    console.log(selectedDatas);
});

function getDataAtPreciseDateDep(dep, date, res) {
        console.log(dep + '   ' + date);
        return $.get("https://coronavirusapifr.herokuapp.com/data/departement/" + dep + "/" + date, function (result) {
            console.log(result);
            //console.log("ALLOOOOOOOO");
            let jsonRequest = JSON.stringify(result);
            let objRequest = JSON.parse(jsonRequest);
            res.push(objRequest[0]);
            console.log("Valeur de res :");
            console.log(res);
        });
}

function getDataOnAPeriod(dep, res, days, labels, nbDaystoPass){
    console.log("OUIII");
    return new Promise((success, failure) =>{
        let nbERROR = 0;
        let promises = new Array();
        for(let i=nbDaystoPass; i<days; i++){
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

function buildMyChart(labels, selectedDep, dataDays, selectedDatas){
    resetCanvas();
    let borderColors = 
    [
        'rgb(179,0,0)',
        'rgb(0, 89, 179)',
        'rgb(0, 102, 34)',
        'rgb(102, 0, 204)'
    ];

    let backgroundColors = 
    [
        'rgb(230,0,0)',
        'rgb(0, 128, 255)',
        'rgb(0, 153, 51)',
        'rgb(153, 51, 255)'
    ];

    console.log('new chart');
    console.log(dataDays);
    let dataset = [];
    selectedDatas.forEach(elementSelect => {
        let myData = [];
        console.log(dataDays.get(selectedDep));
        dataDays.get(selectedDep).forEach(elementData => {
            switch(elementSelect.value){
                case 'rad':
                    myData.push(elementData.rad);
                break;
                case 'dchosp':
                    myData.push(elementData.dchosp);
                break;
                case 'hosp':
                    myData.push(elementData.hosp);
                break;
                case 'rea':
                    myData.push(elementData.rea);
                break;
            }
        });
        console.log('My Data :');
        console.log(myData);
        dataset.push({
            label: elementSelect.label,
            backgroundColor: backgroundColors[0],
            borderColor: borderColors[0],
            data: myData
        });
        borderColors.shift();
        backgroundColors.shift();
    });
    const data = {
        labels: labels,
        datasets: dataset
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

/*
Fonction permettant de vérifier si l'on a déjà récupérer les données d'un département pour une certaine période.
*/
function foundMyData(selDep, data){
    let res = false;
    data.forEach((values,keys) => {
        res = (keys == selDep)
    });
    return res;
}

/*
Fonction ajoutant les données d'un tableau dans la Map principal.
*/ 
function addTableToMap(table, map, selDep){
    map.set(selDep, table);
}


$('#1sem').on('click', () =>{
    temporaryTable = [];
    if(!foundMyData(selectedDep,dataFor7Days)){
        labelsFor7Days = [];
        getDataOnAPeriod(selectedDep,temporaryTable,7,labelsFor7Days,0).then(() =>{
            sortDataTableWithDate(temporaryTable);
            sortLabelsTableWithDate(labelsFor7Days);
            //temporaryTable.reverse();
            console.log(temporaryTable);
            console.log(labelsFor7Days);

            addTableToMap(temporaryTable,dataFor7Days,selectedDep);

            buildMyChart(labelsFor7Days,selectedDep,dataFor7Days,selectedDatas);
            
        }).catch((err) =>{
            console.log("ERREUR LORS DE LA RECUPERATION DES DONNEES.");
            console.error(err);
        })
    }else{
        buildMyChart(labelsFor7Days,selectedDep,dataFor7Days,selectedDatas);
    }
    
})

$('#15j').on('click', () =>{
    temporaryTable = [];
    if(!foundMyData(selectedDep,dataFor15Days)){
        let nbDaystoPass = 0;
        if(foundMyData(selectedDep,dataFor7Days)){
            temporaryTable = JSON.parse(JSON.stringify(dataFor7Days.get(selectedDep)));
            labelsFor15Days = JSON.parse(JSON.stringify(labelsFor7Days));
            console.log("Tableau copié :");
            console.log(dataFor7Days);
            //dataFor15Days.push("ELLELELELELLELELELE");
            console.log("Tableau des 15 j :");
            console.log(dataFor15Days);
            nbDaystoPass += 7;
        }
        getDataOnAPeriod(selectedDep,temporaryTable,15,labelsFor15Days, nbDaystoPass).then(() =>{
            sortDataTableWithDate(temporaryTable);
            sortLabelsTableWithDate(labelsFor15Days);
            //temporaryTable.reverse();

            addTableToMap(temporaryTable,dataFor15Days,selectedDep);
        
            buildMyChart(labelsFor15Days,selectedDep,dataFor15Days,selectedDatas);
            
        }).catch((err) =>{
            console.log("ERREUR LORS DE LA RECUPERATION DES DONNEES.");
            console.error(err);
        })
    }    else{
        
        buildMyChart(labelsFor15Days,selectedDep,dataFor15Days,selectedDatas);
    }
})

$('#1m').on('click', () =>{
    temporaryTable = [];
    if(!foundMyData(selectedDep,dataFor30Days)){
        let nbDaystoPass = 0;
        if(foundMyData(selectedDep,dataFor15Days)){
            temporaryTable = JSON.parse(JSON.stringify(dataFor15Days.get(selectedDep)));
            labelsFor30Days = JSON.parse(JSON.stringify(labelsFor15Days));
            nbDaystoPass += 15;
        }else if (foundMyData(selectedDep,dataFor7Days)){
            temporaryTable = JSON.parse(JSON.stringify(dataFor7Days.get(selectedDep)));
            labelsFor30Days = JSON.parse(JSON.stringify(labelsFor7Days));
            nbDaystoPass += 7;
        }
        getDataOnAPeriod(selectedDep,temporaryTable,30,labelsFor30Days, nbDaystoPass).then(() =>{
            sortDataTableWithDate(temporaryTable);
            sortLabelsTableWithDate(labelsFor30Days);
            //temporaryTable.reverse();

            addTableToMap(temporaryTable,dataFor30Days,selectedDep);

            buildMyChart(labelsFor30Days,selectedDep,dataFor30Days,selectedDatas);
            
        }).catch((err) =>{
            console.log("ERREUR LORS DE LA RECUPERATION DES DONNEES.");
            console.error(err);
        })
        
    }else{
        buildMyChart(labelsFor30Days,selectedDep,dataFor30Days,selectedDatas);
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







