const express = require('express'); 
const app = express(); 
const axios = require('axios');
const port = 8000;
const urls = {
    drivers:  'http://ergast.com/api/f1/current/driverStandings.json',
    constructors: 'http://ergast.com/api/f1/current/constructorStandings.json',
    upcoming: 'http://ergast.com/api/f1/2022/14.json'
}

let config = {
    method: 'get',
    headers: { }
}


//Holds the JSON format of the data for the constructor's championship
let constructorsJSON = [
    // { Pos: '1', Constructor: 'Red Bull', Points: '431' },
    // { Pos: '2', Constructor: 'Ferrari', Points: '334' },
    // { Pos: '3', Constructor: 'Mercedes', Points: '304' },
    // { Pos: '4', Constructor: 'Alpine F1 Team', Points: '99' },
    // { Pos: '5', Constructor: 'McLaren', Points: '95' },
    // { Pos: '6', Constructor: 'Alfa Romeo', Points: '51' },
    // { Pos: '7', Constructor: 'Haas F1 Team', Points: '34' },
    // { Pos: '8', Constructor: 'AlphaTauri', Points: '27' },
    // { Pos: '9', Constructor: 'Aston Martin', Points: '20' },
    // { Pos: '10', Constructor: 'Williams', Points: '3' }
]

//Holds the JSON format of the data for the driver's championship
let driversJSON = [
    // { Pos: '1', Driver: 'Max Verstappen', Points: '258' },
    // { Pos: '2', Driver: 'Charles Leclerc', Points: '178' },
    // { Pos: '3', Driver: 'Sergio Pérez', Points: '173' },
    // { Pos: '4', Driver: 'George Russell', Points: '158' },
    // { Pos: '5', Driver: 'Carlos Sainz', Points: '156' },
    // { Pos: '6', Driver: 'Lewis Hamilton', Points: '146' },
    // { Pos: '7', Driver: 'Lando Norris', Points: '76' },
    // { Pos: '8', Driver: 'Esteban Ocon', Points: '58' },
    // { Pos: '9', Driver: 'Valtteri Bottas', Points: '46' },
    // { Pos: '10', Driver: 'Fernando Alonso', Points: '41' },
    // { Pos: '11', Driver: 'Kevin Magnussen', Points: '22' },
    // { Pos: '12', Driver: 'Daniel Ricciardo', Points: '19' },
    // { Pos: '13', Driver: 'Pierre Gasly', Points: '16' },
    // { Pos: '14', Driver: 'Sebastian Vettel', Points: '16' },
    // { Pos: '15', Driver: 'Mick Schumacher', Points: '12' },
    // { Pos: '16', Driver: 'Yuki Tsunoda', Points: '11' },
    // { Pos: '17', Driver: 'Guanyu Zhou', Points: '5' },
    // { Pos: '18', Driver: 'Lance Stroll', Points: '4' },
    // { Pos: '19', Driver: 'Alexander Albon', Points: '3' },
    // { Pos: '20', Driver: 'Nicholas Latifi', Points: '0' },
    // { Pos: '21', Driver: 'Nico Hülkenberg', Points: '0' }
]

// Holds just the HTML table data
let driversData ='';
let constructorsData = '';

// Builds the HTML table data to be sent to the front end
function fromJson(){
    driversData ='';
    constructorsData = '';
    for(var i = 0; i < driversJSON.length; i++){
        var standing = driversJSON[i];
        let row =   '<tr>' +
                        '<td>' + standing["Pos"] + '</td>' +
                        '<td>' + standing["Driver"] + '</td>' +
                        '<td>' + standing["Points"] + '</td>' +
                    '</tr>';
        driversData += row;
    }
    //console.log(driversData);

    for(var i = 0; i < constructorsJSON.length; i++){
        var standing = constructorsJSON[i];
        let row =   '<tr>' +
                    '<td>' + standing["Pos"] + '</td>' +
                    '<td>' + standing["Constructor"] + '</td>' +
                    '<td>' + standing["Points"] + '</td>' +
                '</tr>';
        constructorsData += row;
    }
    //console.log(constructorsData);

}

// Fetches constructor's and driver's championships data and filters down the information.
// Stores data in JSON format
function readFromApi(){

    axios({url: urls.drivers, ...config})
        .then(function (response) {
            driversJSON = [];
            var driverStandings = response.data["MRData"]["StandingsTable"]["StandingsLists"][0]["DriverStandings"];
            for(var i = 0; i < driverStandings.length; i++){
                var standing =  driverStandings[i];
                var driverName = (standing["Driver"]["givenName"] + " " + standing["Driver"]["familyName"]);
                var driverInfo = {"Pos":standing["position"], "Driver":driverName, "Points":standing["points"]};
                driversJSON.push(driverInfo);
            }
           // console.log(driversJSON);
        })
        .catch(function (error) {
            console.log(error);
        });
    
        //console.log("Done with drivers");

    axios({url: urls.constructors, ...config})
    .then(function (response) {
        constructorsJSON = [];
        var constructorStandings = response.data["MRData"]["StandingsTable"]["StandingsLists"][0]["ConstructorStandings"];
        for(var i = 0; i < constructorStandings.length; i++){
            var standing =  constructorStandings[i];
            var constructorInfo = {"Pos":standing["position"], "Constructor":standing["Constructor"]["name"], "Points":standing["points"]};
            constructorsJSON.push(constructorInfo);
        }
        //console.log(constructorsJSON);

    })
    .catch(function (error) {
        console.log(error);
    });


    
}
    
function prepareTables(){
    readFromApi();
    fromJson();
}

// app.get('/', (req, res) => {
//     res.sendFile('/app/index.html');
// });

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    //res.setHeader('Access-Control-Allow-Credentials', true);
    next();
    });

app.get('/drivers.json', (req, res) => {               
    prepareTables();
    let jsonObject = {'htmlCode': driversData};
    res.send(jsonObject);
});

app.get('/constructors.json', (req, res) => {               
    prepareTables();
    let jsonObject = {'htmlCode': constructorsData};
    res.send(jsonObject);    
});


app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});
// app.listen(port)
