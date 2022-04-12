// variables for lat and lon
let lat;
let lon;
let zip = document.getElementById("zip");
const cityName = document.getElementById("city");
const state = document.getElementById("state");
const sbmtBtn = document.getElementById("sbmtBtn");
const sbmtBtn2 = document.getElementById("sbmtBtn2");

// click on search button by zip code
$(sbmtBtn).click(function (e) {
  e.preventDefault();
  let zipContent = zip.value.trim();
  $("#user-form").children("input").val("");
  const geoCodeApi = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipContent}&appid=3454b11b4e1a8d3727031927c205e6e6`;

  //call geo API and assign lat and lon to the return values
  fetch(geoCodeApi).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        lat = data.lat;
        lon = data.lon;

        const cityName = data.name.toLowerCase();
        localStorage.setItem(cityName, [lat, lon]);

        getWeather(lat, lon);
      });
    } else {
      alert("You didnt enter valid search criteria try again");
    }
  });
});

// search by city name and state
$(sbmtBtn2).click(function (e) {
  e.preventDefault();
  const cityNameContent = cityName.value.trim();
  const stateContent = state.value;
  const geoCodeApiState = `http://api.openweathermap.org/geo/1.0/direct?q=${cityNameContent},${stateContent},US&limit=1&appid=3454b11b4e1a8d3727031927c205e6e6`;

  $("#state-form").children("input").val("");

  //call geo API and assign lat and lon to the return values
  fetch(geoCodeApiState).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        lat = data[0].lat;
        lon = data[0].lon;
        cityNameContent.toLowerCase();
        localStorage.setItem(cityNameContent, [lat, lon]);
      });
    } else {
      alert("You didnt enter valid search criteria try again");
    }
  });
});

// function to send the lat and lon into the API to get weather details
function getWeather(lat, lon) {
  const weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&appid=3454b11b4e1a8d3727031927c205e6e6`;
  fetch(weatherApi).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        console.log(data);
        let dateData = data.current.dt;
        let date = new Date(dateData * 1000);

        console.log(date.toLocaleDateString("en-us"));
        populateDaily(data);
        populateOutlook(data);
      });
    } else {
      alert("You didnt enter valid search criteria try again");
    }
  });
}

//function to populate the daily portion of the UI
function populateDaily(data) {
  const dailyList = document.getElementById("day-list");
  const dailyForcast = {
    Temp: data.current.temp,
    Humidity: data.current.humidity,
    Wind: data.current.wind_speed,
    ['UV Index']: data.current.uvi,
    Icon: data.current.weather[0].icon,
  };

  const keys = Object.keys(dailyForcast)
  console.log(keys)

  keys.forEach((key, index) => {
    console.log(`${key}: ${dailyForcast[key]}`);
  })
  

}

function populateOutlook(data) {
  console.log("I am from the outlook function");
}
