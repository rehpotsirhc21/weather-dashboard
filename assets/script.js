// variables for lat and lon
let lat;
let lon;
let zip = document.getElementById("zip");
const cityName = document.getElementById("city");
const state = document.getElementById("state")
const sbmtBtn = document.getElementById("sbmtBtn");
const sbmtBtn2 = document.getElementById("sbmtBtn2");

// click on search button by zip code
$(sbmtBtn).click(function (e) {
  e.preventDefault();
  let zipContent = zip.value.trim();
  $('#user-form').children('input').val('')
  const geoCodeApi = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipContent}&appid=3454b11b4e1a8d3727031927c205e6e6`;
  console.log(zipContent, geoCodeApi);
    
  //call geo API and assign lat and lon to the return values
  fetch(geoCodeApi).then(function (response) {
    if (response.ok) {
      console.log(response);
      response.json().then(function (data) {
        lat = data.lat;
        lon = data.lon;
        $("#user-form-state")[0].reset();
        const cityName = data.name
        localStorage.setItem(cityName , [lat, lon])
       
        console.log(data);
        console.log(lat, lon, cityName);
        
        getWeather(lat, lon);
      });
    }
  });
});

// search by city name and state
$(sbmtBtn2).click(function (e) {
    e.preventDefault();
    const cityNameContent = cityName.value.trim();
    const stateContent = state.value
    const geoCodeApiState = `http://api.openweathermap.org/geo/1.0/direct?q=${cityNameContent},${stateContent},US&limit=1&appid=3454b11b4e1a8d3727031927c205e6e6`;
    console.log(cityNameContent, stateContent, geoCodeApiState);
    $("#state-form")[0].reset();
  
    //call geo API and assign lat and lon to the return values
    fetch(geoCodeApiState).then(function (response) {
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          lat = data[0].lat;
          lon = data[0].lon;
          localStorage.setItem(cityNameContent, [lat , lon])
          console.log(data);
          console.log(lat, lon);
          getWeather(lat, lon);
        });
      }
    });
  });

function getWeather(lat, lon) {
   
}

//API URLS

const weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=3454b11b4e1a8d3727031927c205e6e6`;
