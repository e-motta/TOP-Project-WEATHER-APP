import './reset.css';
import './style.css';
import Service from './service';
import Process from './process';

const view = (() => {
  const displayCurrentWeather = (locationData, weatherData) => {
    if (locationData && weatherData) {
      const content = document.querySelector('.content');
      content.style.background = weatherData.weather.bcg;

      const temperature = document.querySelector('.current-top .temperature');
      temperature.textContent = weatherData.temp;

      const mainWeatherIcon = document.querySelector('.current-top .icon');
      mainWeatherIcon.src = weatherData.weather.iconUrl;

      const celsius = document.querySelector('.celsius');
      const fahrenheit = document.querySelector('.fahrenheit');
      if (localStorage.units === 'imperial') {
        celsius.classList.add('unselected');
        fahrenheit.classList.remove('unselected');
        localStorage.units = 'metric';
      }

      const mainWeatherDescription = document.querySelector('.current-description');
      mainWeatherDescription.textContent = weatherData.weather.description;

      const city = document.querySelector('.city');
      city.textContent = locationData.name;

      const time = document.querySelector('.time');
      time.textContent = weatherData.time;

      return true;
    }
    return false;
  };

  const displayDailyForecast = (forecastData) => {
    if (forecastData) {
      const allDays = document.querySelectorAll('.forecast-day');
      allDays.forEach((day, i) => {
        const weekday = day.querySelector('.weekday');
        weekday.textContent = forecastData[i].weekday;

        const icon = day.querySelector('.icon');
        icon.src = forecastData[i].weather.iconUrl;

        const max = day.querySelector('.max');
        max.textContent = forecastData[i].maxTemp;
        const min = day.querySelector('.min');
        min.textContent = forecastData[i].minTemp;
      });
      return true;
    }
    return false;
  };

  return { displayCurrentWeather, displayDailyForecast };
})();

async function loadData(service, city, units) {
  if (
    localStorage.locationData
    && localStorage.currentWeatherData
    && localStorage.dailyForecastData
  ) {
    view.displayCurrentWeather(
      JSON.parse(localStorage.locationData),
      JSON.parse(localStorage.currentWeatherData),
    );
    view.displayDailyForecast(JSON.parse(localStorage.dailyForecastData));
  }

  const location = await service.getCoordinates(city);
  const weather = await service.getWeather(location, units);
  const processedData = new Process(location, weather);

  const locationData = processedData.getLocation();
  const currentWeatherData = processedData.getCurrentWeather();
  const dailyForecastData = processedData.getDailyForecast();

  if (locationData) localStorage.locationData = JSON.stringify(locationData);
  if (currentWeatherData) localStorage.currentWeatherData = JSON.stringify(currentWeatherData);
  if (dailyForecastData) localStorage.dailyForecastData = JSON.stringify(dailyForecastData);

  return view.displayCurrentWeather(locationData, currentWeatherData)
         && view.displayDailyForecast(dailyForecastData);
}

async function main() {
  const service = new Service();

  localStorage.units = localStorage.units ? localStorage.units : 'metric';
  localStorage.city = localStorage.city ? localStorage.city : 'London';

  const { city } = localStorage;
  const { units } = localStorage;

  loadData(service, city, units);

  const changeView = (() => {
    const toggleUnits = () => {
      const celsius = document.querySelector('.celsius');
      const fahrenheit = document.querySelector('.fahrenheit');

      celsius.addEventListener('click', () => {
        celsius.classList.remove('unselected');
        fahrenheit.classList.add('unselected');
      });

      fahrenheit.addEventListener('click', () => {
        celsius.classList.add('unselected');
        fahrenheit.classList.remove('unselected');
      });
    };

    const handleChangeLocation = () => {
      const cityName = document.querySelector('.city');
      const form = document.querySelector('form');
      const cityInput = document.querySelector('.city-input');

      const confirmBtn = document.querySelector('.confirm');
      const cancelBtn = document.querySelector('.cancel');

      const changeBtn = document.querySelector('.change-location');

      const toggleInput = (e) => {
        e.preventDefault();
        changeBtn.classList.toggle('transparent');
        cityName.classList.toggle('invisible');
        form.classList.toggle('invisible');
        cityInput.focus();
      };

      changeBtn.addEventListener('click', toggleInput);
      confirmBtn.addEventListener('click', toggleInput);
      cancelBtn.addEventListener('click', toggleInput);
    };

    return { toggleUnits, handleChangeLocation };
  })();

  const changeData = (() => {
    const toggleUnits = () => {
      const units = document.querySelectorAll('.units');
      units.forEach((unit) => {
        unit.addEventListener('click', (e) => {
          loadData(service, localStorage.city, e.target.id);
          localStorage.units = e.target.id;
        });
      });
    };

    const handleChangeLocation = () => {
      const confirmBtn = document.querySelector('.confirm');
      confirmBtn.addEventListener('click', () => {
        const cityInput = document.querySelector('.city-input');
        const newLocation = cityInput.value;
        cityInput.value = '';
        loadData(service, newLocation, localStorage.units);
        localStorage.city = newLocation;
      });
    };

    return { toggleUnits, handleChangeLocation };
  })();

  changeData.toggleUnits();
  changeView.toggleUnits();

  changeData.handleChangeLocation();
  changeView.handleChangeLocation();
}

main();
