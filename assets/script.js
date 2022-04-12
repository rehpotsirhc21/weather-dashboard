// variables for lat and lon
let lat;
let lon;
const zip = document.getElementById("zip");
const sbmtBtn = document.getElementById("sbmtBtn");

// click on search button
$(sbmtBtn).click(function (e) {
  e.preventDefault();
  const zipContent = zip.value.trim();
  const geoCodeApi = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipContent}&appid=3454b11b4e1a8d3727031927c205e6e6`;
  console.log(zipContent, geoCodeApi);

  //call geo API and assign lat and lon to the return values
  fetch(geoCodeApi).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        lat = data.lat;
        lon = data.lon;
        console.log(data);
        console.log(lat, lon);
        getWeather(lat, lon);
      });
    }
  });
});

function getWeather(lat, lon) {}

//API URLS

const weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=3454b11b4e1a8d3727031927c205e6e6`;
