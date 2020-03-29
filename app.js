let temperatureDescription;
let temperatureDegree;
let locationTimezone;
let temperatureSection;
let temperatureSpan;

window.addEventListener('load', () => {
    temperatureDescription = document.querySelector(".temperature-description");
    temperatureDegree = document.querySelector(".temperature-degree");
    locationTimezone = document.querySelector(".location-timezone");
    temperatureSection = document.querySelector(".temperature-section");
    temperatureSpan = document.querySelector(".temperature-section span");

    updateWeatherWithCurrentLocation()
});

document.getElementById("sidebar-list").addEventListener("click", function(event) { 
    switch(event.target.text) {
        case "Portland":
            updateWeather(45.50, -122.67);
            break;
        case "Atlanta":
            updateWeather(33.74, -84.38);
            break
        case "Boston":
            updateWeather(42.36, -71.05);
            break
        case "New York":
            updateWeather(40.71, -74.00);
            break
        case "Miami":
            updateWeather(25.76, -80.19);
            break
        case "Chicago":
            updateWeather(41.87, -87.62);
            break
        default: 
            // For current location
            updateWeatherWithCurrentLocation()
            break;
      }
});

function updateWeatherWithCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            let long = position.coords.longitude;
            let lat = position.coords.latitude;

            const proxy = `https://cors-anywhere.herokuapp.com/`;
            const api = `${proxy}https://api.darksky.net/forecast/1d927afd946b4ee7a3950fab13cdd5e4/${lat},${long}`;

            get(api);
        });
    }
}

function updateWeather(lat, long) {
    const proxy = `https://cors-anywhere.herokuapp.com/`;
    const api = `${proxy}https://api.darksky.net/forecast/1d927afd946b4ee7a3950fab13cdd5e4/${lat},${long}`;

    get(api)
}

function get(api) {
    fetch(api)
    .then(response => {
        //Convert response to json
        return response.json();
    })
    .then(data => {
        console.log(data);
        //Shorthand for data.currently.temperature, data.currently.summary, etc
        const {temperature, summary, icon} = data.currently;
        
        //Set DOM Elements from the API
        temperatureDegree.textContent = temperature;
        temperatureDescription.textContent = summary;
        locationTimezone.textContent = data.timezone;

        //Formula for celcius
        let celcius = (temperature - 32) * (5 / 9);

        //Set Icons
        setIcons(icon, document.querySelector(".icon"));

        //Toggle between farenheit and celcius
        temperatureSection.addEventListener('click', () => {
            if (temperatureSpan.textContent === "F") {
                temperatureDegree.textContent = Math.floor(celcius);
                temperatureSpan.textContent = "C";
            } else {
                temperatureDegree.textContent = temperature;
                temperatureSpan.textContent = "F";
            }
        });
    });
}

function setIcons(icon, iconID) {
    const skycons = new Skycons({color: "white"});
    const currentIcon = icon.replace(/-/g, "_").toUpperCase(); //Replaces all - with _ and capitalizes it
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
}