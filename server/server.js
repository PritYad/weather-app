const express = require('express');
const app = express();
const API_KEY = 'f09dbfd1bae1b9f553e5b128d85fb154';
const axios = require('axios');
const cors = require('cors');


// route to get the weather data
// localhost:3000/weather?address=lahore

app.use(cors());
app.options('*', cors());

app.get('/weather', (req, res, next) => {
  const address = req.query.r;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${address}&appid=${API_KEY}&units=metric`;
  axios({
    method: 'get',
    url: url,
    responseType: 'json'
  })
    .then(response => {
      // TODO modify response
      res.send(response.data);
    })
    .catch(error => {
      let message = "";
      if (error.response) {
        // The request was made and the server responded with a status code
        console.log(error.response.data.message)
        message = 'Please enter a valid city';
      } else if (error.request) {
        // The request was made but no response was received
        message = 'Please search again with a valid city';
      } else {
        // Something happened in setting up the request that triggered an Error
        message = 'We are facing technical difficulties, please try again later';
      }
      res.send({
        status: error.response && error.response.data ? error.response.data.cod : '500',
        message
      });
    });
});

function modifyData(data) {
  const isWeatherDataValid = data && data.weather && data.weather.length > 0;
  const isMainValid = data && data.main;
  return {
    name: data.name || "",
    description: isWeatherDataValid ? data.weather[0].description : "",
    currentTemp: isMainValid ? data.main.temp : "",
    minTemp: isMainValid ? data.main.temp_min : "",
    maxTemp: isMainValid ? data.main.temp_max : "",
    winds: data && data.winds ? data.winds.all : "",
    feels_like: isWeatherDataValid ? data.main.feels_like : "",
    humidity: isWeatherDataValid ? data.main.humidity : "",
    pressure: isWeatherDataValid ? data.main.pressure : "",
    wind: data && data.wind ? data.wind.speed : "-"
  }
}

app.listen(5000, () => {
  console.log('Server is up and running on port: ', 5000)
});