const API_KEY = "1c337a9e8fd9a9e0a3340f2849e04fa9";
const searchBtn = document.getElementById("searchBtn");
let listOfCities = [];

// Load history from localStorage if available
if (localStorage.getItem("history")) {
    listOfCities = JSON.parse(localStorage.getItem("history"));
}

// Search button click event
searchBtn.addEventListener("click", performSearch);

function performSearch() {
    const inputVal = document.getElementById("cityToSearch").value.trim();
    if (inputVal) {
        listOfCities.push(inputVal);
        localStorage.setItem("history", JSON.stringify(listOfCities));
        weatherSearch(inputVal);
        forecastSearch(inputVal); // Pass city name directly
    }
}

// Fetch current weather data
function weatherSearch(city) {
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${API_KEY}`;
    
    fetch(queryURL)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                updateCurrentWeather(data);
                renderHistory();
            } else {
                console.error("City not found!");
            }
        })
        .catch(error => console.error('Error:', error));
}

// Update current weather in the DOM
function updateCurrentWeather(data) {
    const weatherIcon = document.getElementById("weather-icon");
    const dataIcon = data.weather[0].icon;
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dataIcon}.png`);

    document.getElementById("city-name").textContent = data.name;
    document.getElementById("current-date").textContent = dayjs().format('MM/DD/YYYY');
    document.getElementById("temp").textContent = `Temp: ${data.main.temp} °F`;
    document.getElementById("wind").textContent = `Wind: ${data.wind.speed} MPH`;
    document.getElementById("humid").textContent = `Humidity: ${data.main.humidity}%`;
}

// Fetch 5-day forecast data using city name
function forecastSearch(city) {
    const queryURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=imperial`;
    
    fetch(queryURL)
        .then(response => response.json())
        .then(data => {
            const filteredTimes = data.list.filter(item => item.dt_txt.includes("12:00:00"));
            renderForecast(filteredTimes);
        })
        .catch(error => console.error('Error:', error));
}

// Render forecast data
function renderForecast(forecastArray) {
    forecastArray.forEach((forecast, index) => {
        const [year, month, day] = forecast.dt_txt.split(" ")[0].split('-');
        document.getElementById(`date-${index}`).textContent = `${month}/${day}/${year}`;
        document.getElementById(`icon-${index}`).innerHTML = `<img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png"/>`;
        document.getElementById(`temp-${index}`).textContent = `Temp: ${forecast.main.temp} °F`;
        document.getElementById(`wind-${index}`).textContent = `Wind: ${forecast.wind.speed} MPH`;
        document.getElementById(`humid-${index}`).textContent = `Humidity: ${forecast.main.humidity}%`;
    });
}

// Render search history
function renderHistory() {
    const historyContainer = document.getElementById("history");
    historyContainer.innerHTML = "";

    listOfCities.forEach(city => {
        const historyBtn = document.createElement("button");
        historyBtn.textContent = city;
        historyBtn.classList.add("btn", "btn-secondary", "mb-2");
        historyBtn.addEventListener("click", () => {
            weatherSearch(city);
            forecastSearch(city);
        });
        historyContainer.append(historyBtn);
    });
}

// Initial rendering of search history
renderHistory();
