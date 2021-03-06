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
const clearBtn = document.getElementById("refresh");
const buttonUi = document.getElementById("historyBtn");

$(clearBtn).click(function () {
  location.reload();
});
// click on search button by zip code
$(sbmtBtn).click(function (e) {
  e.preventDefault();
  clearSearch();

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
  $(clearBtn).removeClass("hide");
  clearSearch();
  const cityNameContent = cityNameEl.value.trim();
  const stateContent = state.value;
  const geoCodeApiState = `https://api.openweathermap.org/geo/1.0/direct?q=${cityNameContent},${stateContent},US&limit=1&appid=3454b11b4e1a8d3727031927c205e6e6`;

  $("#state-form").children("input").val("");

  //call geo API and assign lat and lon to the return values
  fetch(geoCodeApiState).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        lat = data[0].lat;
        lon = data[0].lon;
        cityName = data[0].name;

        localStorage.setItem(cityName, JSON.stringify([lat, lon]));
        getWeather(lat, lon);
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

  keys.forEach((key, index) => {
    const listItemEl = document.createElement("li");
    const spanEl = document.createElement("span");
    spanEl.setAttribute("id", key);

    listItemEl.textContent = `${key}: `;
    spanEl.textContent = `${dailyForcast[key]}`;
    $(listItemEl).append(spanEl);
    $(dailyList).append(listItemEl);
  });

  //UV index styles

  const uvIndexEl = document.getElementById("UV Index");

  if (dailyForcast["UV Index"] < 3) {
    uvIndexEl.classList.add("green");
  }
  if (dailyForcast["UV Index"] > 3 && dailyForcast["UV Index"] < 8) {
    uvIndexEl.classList.add("orange");
  }
  if (dailyForcast["UV Index"] > 7) {
    uvIndexEl.classList.add("red");
  }
}
// function to populate 5 day outlook
function populateOutlook(data) {
  for (let i = 1; i < 6; i++) {
    dateData = data.daily[i].dt;
    date = new Date(dateData * 1000);
    date = date.toLocaleDateString("en-us");
    const divEl = document.getElementById(`data-${i}`);
    const icon = `${data.daily[i].weather[0].icon}`;
    const iconUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

    const dateEl = document.createElement("p");
    const imgEl = document.createElement("img");
    imgEl.setAttribute("src", iconUrl);
    imgEl.setAttribute("class", "rounded mx-auto d-block");
    dateEl.textContent = date;
    divEl.append(dateEl);
    divEl.append(imgEl);

    const outlookData = {
      Temp: `${data.daily[i].temp.day}\u00B0`,
      Wind: `${data.daily[i].wind_speed} MPH`,
      Humidity: `${data.daily[i].humidity}\u0025`,
    };

    const keys = Object.keys(outlookData);
    keys.forEach((key) => {
      const ulEl = document.getElementById(`day-${i}`);
      const liEl = document.createElement("li");
      liEl.textContent = `${key}: ${outlookData[key]}`;
      ulEl.appendChild(liEl);
    });
  }
}

/// populate info from local storage onto buttons to get results
function populateButtons() {
  for (let [key, value] of Object.entries(localStorage)) {
    buttonEl = document.createElement("button");
    buttonEl.textContent = key;
    buttonEl.setAttribute("type", "submit");
    buttonEl.setAttribute("class", "btn btn-outline-primary mx-1 my-1 histBtn");

    cityName = key;
    buttonEl.setAttribute("id", cityName);

    buttonUi.append(buttonEl);
    value = JSON.parse(localStorage.getItem(key));
    lat = value[0];
    lon = value[1];
  }
}
window.onload = populateButtons();

$(".histBtn").click(function (e) {
  event.stopPropagation();
  clearSearch();
  const key = e.target.id;
  const latLon = JSON.parse(localStorage.getItem(key));
  cityName = key;
  lat = latLon[0];
  lon = latLon[1];
  getWeather(lat, lon);
});

//function to clean up UI when a search is performed
function clearSearch() {
  const zipSearch = document.getElementById("zSearch");
  const cSearch = document.getElementById("cSearch");
  $(clearBtn).removeClass("hide");
  $(cSearch).addClass("hide");
  $(zSearch).addClass("hide");
  if (buttonUi) {
    $(buttonUi).addClass("hide");
  }
}
