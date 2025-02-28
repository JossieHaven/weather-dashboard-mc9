import dayjs, { type Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state: string;
}

// TODO: Define a class for the Weather object
class Weather {
  city: string;
  date: Dayjs | string;
  tempF: number;
  windSpeed: number;
  humidity: number;
  icon: string;
  iconDescription: string;
  constructor(
    city: string,
    date: Dayjs | string,
    tempF: number,
    windSpeed: number,
    humidity: number,
    icon: string,
    iconDescription: string
  ) {
    this.city = city;
    this.date = date;
    this.tempF = tempF;
    this.windSpeed = windSpeed;
    this.humidity = humidity;
    this.icon = icon;
    this.iconDescription = iconDescription;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  
  private baseURL?: string;

  private apiKey?: string;

  private city = '';

  constructor() {
    this.baseURL = process.env.API_BASE_URL || '';

    this.apiKey = process.env.API_KEY || '';
  }
  // * Note: The following methods are here as a guide, but you are welcome to provide your own solution.
  // * Just keep in mind the getWeatherForCity method is being called in your
  // * 09-Servers-and-APIs/02-Challenge/Develop/server/src/routes/api/weatherRoutes.ts file
  
  // * the array of Weather objects you are returning ultimately goes to
  // * 09-Servers-and-APIs/02-Challenge/Develop/client/src/main.ts

  // TODO: Create fetchLocationData method
  // private async fetchLocationData(query: string) {}
  // TODO: Create destructureLocationData method
  // private destructureLocationData(locationData: Coordinates): Coordinates {}
  // TODO: Create buildGeocodeQuery method
  // private buildGeocodeQuery(): string {}
  // TODO: Create buildWeatherQuery method
  // private buildWeatherQuery(coordinates: Coordinates): string {}
  // TODO: Create fetchAndDestructureLocationData method
  // private async fetchAndDestructureLocationData() {}
  // TODO: Create fetchWeatherData method
  // private async fetchWeatherData(coordinates: Coordinates) {}
  // TODO: Build parseCurrentWeather method
  // private parseCurrentWeather(response: any) {}
  // TODO: Complete buildForecastArray method
  // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
  // TODO: Complete getWeatherForCity method
  // async getWeatherForCity(city: string) {}
}
async getWeatherForCity(city: string) {
  const requestURL = `${this.baseURL}/geo/1.0/direct?q=${city}&limit=5&appid=${this.apiKey}`;

  const newInfo = await fetch(requestURL);

  if (!newInfo.ok) {
    console.log(`Error:${newInfo.statusText}`);
  }

  const locationObj: Array<any> = await newInfo.json();

  const { lat, lon }: Coordinates = locationObj[0];

  const cityUrl = `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=imperial`;

  const cityInfo = await fetch(cityUrl);

  if (!cityInfo.ok) {
    console.log(`Error:${cityInfo.statusText}`);
  }

  const cityObj = await cityInfo.json();

  // console.log(cityObj);
  const forecast = [];

  for (let i = 0; i < cityObj.list.length; i += 8) {
    const tempF = cityObj.list[i].main.temp;
    const windSpeed = cityObj.list[i].wind.speed;
    const humidity = cityObj.list[i].main.humidity;
    const icon = cityObj.list[i].weather[0].icon;
    const iconDescription = cityObj.list[i].weather[0].iconDescription;
    const date = dayjs.unix(cityObj.list[i].dt).format("MM-DD-YYYY");

    const weatherObj = new Weather(
      city,
      date,
      tempF,
      windSpeed,
      humidity,
      icon,
      iconDescription
    );

    forecast.push(weatherObj);

    if (i + 8 === 40) {
      i--;
    }
  }

  return forecast;
}
}

export default new WeatherService();
