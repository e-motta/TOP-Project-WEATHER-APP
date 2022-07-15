class Service {
  constructor() {
    this.appID = '34f0fd9184c51ccfb3bbe52fa295b3b2';
  }

  async getCoordinates(location) {
    try {
      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${location}&appid=${this.appID}`,
      );
      const json = await response.json();
      localStorage.setItem('coordinates', JSON.stringify(json));
      return json;
    } catch {
      return false;
    }
  }

  async getWeather(coord, units) {
    try {
      const { lat, lon } = coord[0];
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${this.appID}`,
      );
      const json = await response.json();
      localStorage.setItem('weather', JSON.stringify(json));
      return json;
    } catch {
      return false;
    }
  }
}

export default Service;
