import { API_KEY } from "./config.js";



async function getWeatherData(city, unitgroup = "metric", API_KEY) {
  const response = await fetch(
    `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=${unitgroup}&key=${API_KEY}`,
    {
      method: "GET",
      headers: {},
    }
  );
  const data = await response.json();
  displayWeatherData(data);
}

function displayWeatherData(data) {
  const Location = data.resolvedAddress;
  const iconName = data.currentConditions.icon;
  const iconUrl = `https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/SVG/2nd%20Set%20-%20Color/${iconName}.svg`;
  const temperature = data.currentConditions.temp;
  const FeelLike = data.currentConditions.feelslike;
  const humidity = data.currentConditions.humidity;
  const windSpeed = data.currentConditions.windspeed;
  const description = data.currentConditions.conditions;  
  console.log(description)
  
  const Cardtitle = document.body.getElementsByClassName("card-title")[0];
  Cardtitle.innerHTML = Location;
  const Cardicon = document.body.getElementsByClassName("card-icon")[0];
  Cardicon.src = iconUrl;
  const tempContainer = document.body.getElementsByClassName("tempContainer")[0];
  tempContainer.innerHTML = `${temperature}°C`;
  const feelslikeContainer =document.body.getElementsByClassName("feelslikeContainer")[0];
  feelslikeContainer.innerHTML = `Feels Like ${FeelLike} °C`;
  const humidityContainer = document.body.getElementsByClassName("humidityContainer")[0];
  humidityContainer.innerHTML = `${humidity}%`;
  const windSpeedContainer = document.body.getElementsByClassName("windSpeedContainer")[0];
  windSpeedContainer.innerHTML = `${windSpeed}km/h`;
  const descriptionContainer = document.body.getElementsByClassName("descriptionContainer")[0];
  descriptionContainer.innerHTML = `${description}`;
  console.log(descriptionContainer);
}

getWeatherData("kolkata", "uk", API_KEY);
