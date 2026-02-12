const apiKey = "apiKey";
const apiUrl = "add-your-own-api";

const searchBox = document.querySelector(".search input");
const weatherIcon = document.querySelector(".icon");

async function checkWeather(city) {
    try {
        const response = await fetch(apiUrl + city + `&appid=${apiKey}`);
        const data = await response.json();
        if (!response.ok) {
            console.error('API request failed:', response.status, response.statusText);

            const storedData = localStorage.getItem(city);
            if (storedData) {
                const cachedData = JSON.parse(storedData);
                updateWeatherData(cachedData);
                return;
            }

            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            return;
        }

        localStorage.setItem(city, JSON.stringify(data));

        updateWeatherData(data);
        console.log(data);
    } catch (error) {
        console.error('An error occurred during API request:', error);

        const storedData = localStorage.getItem(city);
        if (storedData) {
            const cachedData = JSON.parse(storedData);
            updateWeatherData(cachedData);
        }
    }
}

checkWeather("Texas");

function updateWeatherData(data) {
    let date = new Date();
    let day = date.getDay();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let dayName = days[day];

    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temperature").innerHTML = Math.round(data.main.temp) + "℃";
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".pressure").innerHTML = data.main.pressure + "mb";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/hr";
    document.getElementById('dayname').innerHTML = dayName;
    document.getElementById('month').innerHTML = date.toLocaleString('default', { month: 'long' });
    document.getElementById('daynum').innerHTML = date.getDate();
    document.getElementById('year').innerHTML = date.getFullYear();

    setWeatherIcon(data.weather[0].main);
}

function setWeatherIcon(weatherCondition) {
    let weatherIconSrc = "";
    switch (weatherCondition) {
        case "Clouds":
            weatherIconSrc = "https://cdn-icons-png.flaticon.com/128/10763/10763252.png";
            break;
        case "Clear":
            weatherIconSrc = "https://cdn-icons-png.flaticon.com/128/14059/14059063.png";
            break;
        case "Rain":
            weatherIconSrc = "https://cdn-icons-png.flaticon.com/128/3314/3314005.png";
            break;
        case "Thunderstorm":
            weatherIconSrc = "https://cdn-icons-png.flaticon.com/128/3236/3236885.png";
            break;
        case "Mist":
            weatherIconSrc = "https://cdn-icons-png.flaticon.com/128/7810/7810874.png";
            break;
    }

    weatherIcon.src = weatherIconSrc;
    
    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
}

searchBox.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        checkWeather(searchBox.value);
    }
});

async function pastWeatherData() {
    try {
        let url = `http://localhost/weatherprototype/api.php`;
        let response = await fetch(url);
        let data = await response.json();

        console.log(data);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            let weekHTML = "";
            let size = Object.keys(data.data).length;

            for (let i = 0; i < size; i++) {
                console.log("Size is:" + i);
                weekHTML += `
                    <div class="datas" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; margin-left: 10px; margin-right:10px; color:black">
                        <span id ="dates">${data.data[i].weather_date}</span>
                        <img style="height: 40px;" src="https://cdn-icons-png.flaticon.com/128/3314/3314019.png">
                        <span id ="temperature">${data.data[i].temperature}&deg;</span>
                        <span id="Pressure2">${data.data[i].pressure}md</span>
                        <span id="Humidity2">${data.data[i].humidity}%</span>
                        <span id="Windspeed2">${data.data[i].wind_speed}km/hr</span>
                    </div>`;
            }

            let pastdatecontainer = document.getElementById("pastdate");
            pastdatecontainer.innerHTML = weekHTML;

            localStorage.setItem("pastWeatherData", JSON.stringify(data));
        }
    } catch (error) {
        console.log("Error fetching past weather data:", error);
    }
}

const storedData = localStorage.getItem("pastWeatherData");
if (storedData) {
    const parsedData = JSON.parse(storedData);
}

pastWeatherData();