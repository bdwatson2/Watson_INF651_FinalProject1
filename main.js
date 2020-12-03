let defaultChoice;
let userInput = sendToPage();
let globalGeoLat = localStorage.getItem("geoLat");
let globalGeoLong = localStorage.getItem("geoLong");


if (userInput == ""){
    if(getLocation() == null){
        defaultChoice = "Bethlehem,PA,US";
    } 
    else {
        defaultChoice = getLocation();
    }
} else {
    defaultChoice = userInput;
}

function getWeather(cityName){
    let myKey = '93c044327e7d81c51d744fd3db4b44eb';
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' 
    + cityName + '&APPID=' + myKey)
    .then(reply => {
        return reply.json()
    })
    .then(check => {
        console.log(check);
        grabWeather(check);
    });
}

function grabWeather(weatherData){
    let fahrenheit = Math.round(((parseFloat(weatherData.main.temp) - 273.15)*1.8) +32);
    let description = weatherData.weather[0].description;

    document.getElementById('description').innerHTML = weatherData.weather[0].description;
    document.getElementById('temperature').innerHTML = fahrenheit + '&deg;F ';
    document.getElementById('location').innerHTML = weatherData.name + ', ' + weatherData.sys.country ;

    //swapping backgrounds depending on the weather
    if (description.indexOf('rain') >= 0) {
        document.body.className = 'rainy';
    }
    else if (description.indexOf('cloud') >= 0){
        document.body.className = 'cloudy';
    }
    else if (description.indexOf('clear') >= 0){
        if (weatherData.sys.sunset < weatherData.dt){
            //purposefully empty
        } else {
            document.body.className = 'sunny';
        }
    }
    else if (description.indexOf('snow') >= 0){
        document.body.className = 'snow';
    }

    //-------

    let iconCode =  weatherData.weather[0].icon;
    let iconURL = "https://openweathermap.org/img/w/" + iconCode + ".png";
    document.getElementById("wicon").src = iconURL;
}

function sendToPage(){
    let input = document.getElementById("search").value;
    return input;
}

window.onload = function() {
    if (globalGeoLat != null && globalGeoLong != null && userInput == "") {
        grabLocation(globalGeoLat, globalGeoLong);
    } else {
        getWeather(defaultChoice);
    }
}

document.addEventListener('keyup', e => {
    if (e.keyCode == 13){
        window.location.reload();
    }
})

function getLocation(){
    navigator.geolocation.getCurrentPosition(pos => {
        let geoLat = pos.coords.latitude.toFixed(5);
        localStorage.setItem("geoLat", geoLat);

        let geoLong = pos.coords.longitude.toFixed(5);
        localStorage.setItem("geoLong",geoLong);

        let myKey = '93c044327e7d81c51d744fd3db4b44eb';
        
        fetch('https://api.openweathermap.org/data/2.5/weather?lat=' 
            + geoLat + '&lon=' + geoLong + '&APPID=' + myKey)
        .then(reply => {
            return reply.json()
         })
        .then(check => {
            grabWeather(check);
        });
    });
}

function grabLocation(lat, long){
    let myKey = '93c044327e7d81c51d744fd3db4b44eb';

    fetch('https://api.openweathermap.org/data/2.5/weather?lat=' 
    + lat + '&lon=' + long + '&APPID=' + myKey)
    .then(reply => {
        return reply.json()
     })
    .then(check => {
        grabWeather(check);
        latCity = check.name;
        latCountry = check.sys.country;
    });
}


"\n";