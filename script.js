import { WEATHER_API_KEY } from "./config.js";
import { GEMINI_API_KEY } from "./config.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form[role='search']");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const city = document.getElementById("city").value.trim();
    if (city) {
      getWeatherData(city, "metric", WEATHER_API_KEY);
    }
  });
});

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

  const Cardtitle = document.body.getElementsByClassName("card-title")[0];
  Cardtitle.innerHTML = Location;
  const Cardicon = document.body.getElementsByClassName("card-icon")[0];
  Cardicon.src = iconUrl;
  const tempContainer =
    document.body.getElementsByClassName("tempContainer")[0];
  tempContainer.innerHTML = `${temperature}°C`;
  const feelslikeContainer =
    document.body.getElementsByClassName("feelslikeContainer")[0];
  feelslikeContainer.innerHTML = `Feels Like ${FeelLike} °C`;
  const humidityContainer =
    document.body.getElementsByClassName("humidityContainer")[0];
  humidityContainer.innerHTML = `${humidity} %`;
  const windSpeedContainer =
    document.body.getElementsByClassName("windSpeedContainer")[0];
  windSpeedContainer.innerHTML = `${windSpeed} km/h`;
  const descriptionContainer = document.body.getElementsByClassName(
    "descriptionContainer"
  )[0];
  descriptionContainer.innerHTML = `${description}`;
}

getWeatherData("New Delhi", "metric", WEATHER_API_KEY);

//Chatbot Logic

const chatContainer = document.getElementById("chat-container");
const chatToggle = document.getElementById("chat-toggle");
const chatClose = document.getElementById("chat-close");
const chatSend = document.getElementById("chat-send");
const userInput = document.getElementById("chat-input");
const chatBody = document.getElementById("chat-body");

chatToggle.addEventListener("click", () => {
  chatContainer.classList.toggle("open");
});

chatClose.addEventListener("click", () => {
  chatContainer.classList.remove("open");
});

async function sendMessage() {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  appendMessage(userMessage, "user");
  userInput.value = "";
  
  const SYSTEM_PROMPT = `
  You are a weather assistant designed to provide accurate, concise, and up-to-date weather information.
  
  Your responsibilities include:
  - Answering questions related to temperature, humidity, wind speed, and brief weather summaries.
  - Providing weather updates for specific locations or cities when mentioned.
  - Offering general weather summaries when location is not specified.
  - Responding only to weather-related queries.
  
  Behavior rules:
  - If a user asks a non-weather-related question, politely inform them that you specialize only in weather information and encourage them to ask about the weather instead.
  - Avoid engaging in small talk or general conversation.
  - Keep responses clear, factual, and user-friendly.
  
  Your goal is to assist users by delivering reliable and relevant weather information only.
  `;
  
  const payload = {
    system_instruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents: {
      parts: [{ text: userMessage }],
    },
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();
    const botReply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Hmm, I couldn't come up with a response.";
    console.log(botReply);
    appendMessage(botReply, "bot");
  } catch (error) {
    console.error(error);
    appendMessage("An error occurred while getting a response.", "bot");
  }
}

function appendMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("chat-message", sender);
  messageDiv.innerHTML = `<p>${text}</p>`;
  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendMessage();
});

chatSend.addEventListener("click", sendMessage);
