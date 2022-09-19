const backendIP = "10.133.171.171";
const backendUrl = "http://" + backendIP +":8000";



function loadDrivers(driverTableData){
    document.getElementById('driversChampionshipTableBody').innerHTML = driverTableData;
}

function loadConstructors(constructorTableData){
    document.getElementById('constructorsChampionshipTableBody').innerHTML = '';
    document.getElementById('constructorsChampionshipTableBody').innerHTML = constructorTableData;

}




fetch(backendUrl + "/constructors.json")
  .then((response) => response.json())
  .then((data) => loadConstructors(data['htmlCode']));

  fetch(backendUrl + "/drivers.json")
  .then((response) => response.json())
  .then((data) => loadDrivers(data['htmlCode']));