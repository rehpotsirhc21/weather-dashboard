// variables
let lat;
let lon;
let cityName;
let date;
let zip = document.getElementById("zip");
const cityNameEl = document.getElementById("city");
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
        cityName = data.name;
        // store info inlocal storage
        localStorage.setItem(cityName, JSON.stringify([lat, lon]));

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
  const cityNameContent = cityNameEl.value.trim();
  const stateContent = state.value;
  const geoCodeApiState = `http://api.openweathermap.org/geo/1.0/direct?q=${cityNameContent},${stateContent},US&limit=1&appid=3454b11b4e1a8d3727031927c205e6e6`;

  $("#state-form").children("input").val("");

  //call geo API and assign lat and lon to the return values
  fetch(geoCodeApiState).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        lat = data[0].lat;
        lon = data[0].lon;
        cityName = data[0].name;

        localStorage.setItem(cityName, [lat, lon]);
        getWeather(lat, lon)
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
        date = new Date(dateData * 1000);
        date = date.toLocaleDateString("en-us");

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
  //create title for the day
  const iconEl = document.getElementById("icon");
  const nameEl = document.getElementById("cname");
  const dateEl = document.getElementById("cdate");
  const icon = data.current.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
  const imageEl = document.createElement("img");
  imageEl.setAttribute("src", iconUrl);

  nameEl.append(cityName);
  dateEl.append(date);
  iconEl.appendChild(imageEl);

  // create list for the day
  const dailyList = document.getElementById("day-list");
  const dailyForcast = {
    Temp: `${data.current.temp}\u00B0 `,
    Humidity: `${data.current.humidity}\u0025`,
    Wind: `${data.current.wind_speed} MPH `,
    ["UV Index"]: data.current.uvi,
    
  };

  const keys = Object.keys(dailyForcast);
  console.log(keys);

  keys.forEach((key, index) => {
    const listItemEl = document.createElement("li");
    const spanEl = document.createElement("span")
    spanEl.setAttribute("id", key)

   
    
    listItemEl.textContent = `${key}: `;
    spanEl.textContent = `${dailyForcast[key]}`
    $(listItemEl).append(spanEl)
    $(dailyList).append(listItemEl);
  });

  //UV index styles

  const uvIndexEl = document.getElementById("UV Index")
  
  console.log(uvIndexEl)
  if (dailyForcast["UV Index"] < 3) {
      uvIndexEl.classList.add("green")
      
  }
  if (dailyForcast["UV Index"] > 3 && dailyForcast["UV Index"] < 8) {
    uvIndexEl.classList.add("orange")
    
}
if (dailyForcast["UV Index"] > 7) {
    uvIndexEl.classList.add("red")
    
}
}

function populateOutlook(data) {
  console.log("I am from the outlook function");
}

/// populate info from local storage onto buttons to get results
function onLoad() {
  var help = localStorage.getItem("Coon Rapids");
  help = JSON.parse(help);
  console.log(typeof help);
  console.log(help);
}
