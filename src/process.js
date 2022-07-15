import { DateTime } from 'luxon';

class Process {
  constructor(locationResponse, weatherResponse) {
    [this.locationResponse] = locationResponse;
    this.weatherResponse = weatherResponse;
    this.currentWeather = this.weatherResponse.current;
    this.dailyForecast = this.weatherResponse.daily;

    this.backgroundColorObj = {
      '01d': 'rgb(163, 255, 255)',
      '01n': 'rgb(157, 153, 180)',
      '02d': 'rgb(214, 214, 214)',
      '02n': 'rgb(157, 153, 180)',
      '03d': 'rgb(214, 214, 214)',
      '03n': 'rgb(157, 153, 180)',
      '04d': 'rgb(214, 214, 214)',
      '04n': 'rgb(157, 153, 180)',
      '09d': 'rgb(214, 214, 214)',
      '09n': 'rgb(157, 153, 180)',
      '10d': 'rgb(214, 214, 214)',
      '10n': 'rgb(157, 153, 180)',
      '11d': 'rgb(214, 214, 214)',
      '11n': 'rgb(157, 153, 180)',
      '13d': 'rgb(235, 235, 235)',
      '13n': 'rgb(157, 153, 180)',
      '50d': 'rgb(235, 235, 235)',
      '50n': 'rgb(157, 153, 180)',
    };
  }

  getLocation() {
    if (this.locationResponse) {
      const locationInfo = {
        name: this.locationResponse.name,
      };
      return locationInfo;
    }
    return false;
  }

  getCurrentWeather() {
    if (this.weatherResponse) {
      const weather = {
        time: DateTime
          .fromSeconds(this.currentWeather.dt)
          .setZone(this.weatherResponse.timezone)
          .toLocaleString({
            weekday: 'long',
            hour: 'numeric',
          }),
        feels_like: this.currentWeather.feels_like,
        temp: Math.round(this.currentWeather.temp),
        weather: {
          main: this.currentWeather.weather[0].main,
          description: this.currentWeather.weather[0].description,
          bcg: this.backgroundColorObj[this.currentWeather.weather[0].icon],
          iconUrl: `http://openweathermap.org/img/wn/${this.currentWeather.weather[0].icon}@2x.png`,
        },
      };
      return weather;
    }
    return false;
  }

  getDailyForecast() {
    if (this.weatherResponse) {
      const dailyForecast = [];
      this.weatherResponse.daily.forEach((day) => {
        dailyForecast.push({
          weekday: DateTime
            .fromSeconds(day.dt)
            .setZone(this.weatherResponse.timezone)
            .toLocaleString({
              weekday: 'short',
            }),
          maxTemp: `${Math.round(day.temp.max)}°`,
          minTemp: `${Math.round(day.temp.min)}°`,
          weather: {
            main: day.weather[0].main,
            description: day.weather[0].description,
            iconUrl: `http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`,
          },
        });
      });
      return dailyForecast;
    }
    return false;
  }
}

export default Process;
