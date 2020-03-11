window.addEventListener('load', () => {

    //Once the page loads, everything inside runs
    let long;
    let lat;
    const temperatureDescription = document.querySelector(".temperature-description");
    const temperatureDegree = document.querySelector(".temperature-degree");
    const locationTimezone = document.querySelector(".location-timezone");
    const temperatureSection = document.querySelector(".temperature-section");
    const temperatureSpan = document.querySelector(".temperature-section span");

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            long = position.coords.longitude;
            lat = position.coords.latitude;

            const proxy = `https://cors-anywhere.herokuapp.com/`;
            const api = `${proxy}https://api.darksky.net/forecast/1d927afd946b4ee7a3950fab13cdd5e4/${lat},${long}`;

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
        });
    }

    function setIcons(icon, iconID) {
        const skycons = new Skycons({color: "white"});
        const currentIcon = icon.replace(/-/g, "_").toUpperCase(); //Replaces all - with _ and capitalizes it
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }

});