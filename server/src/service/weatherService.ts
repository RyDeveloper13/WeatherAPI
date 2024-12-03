import dotenv from "dotenv";
dotenv.config();

// Define the interface for Coordinates
interface Coordinates {
  lat: number;
  lon: number;
}

// Define the interface for Weather
class Weather {
  city: string;
  tempF: number;
  humidity: number;
  windSpeed: number;
  date: string;
  icon: string;
  iconDescription: string;
  constructor(city:string, tempF:number, humidity:number, windSpeed:number, date:string, icon:string, iconDescription:string){
    this.city=city;
    this.tempF=tempF;
    this.humidity=humidity;
    this.windSpeed=windSpeed;
    this.date=date;
    this.icon=icon;
    this.iconDescription=iconDescription;
  }
}

class WeatherService {
  private baseURL: string;
  private apiKey: string;
  cityname=''

  constructor() {
    this.baseURL = process.env.API_BASE_URL|| "";
    this.apiKey = process.env.API_KEY || "";

    if (!this.apiKey) {
      throw new Error("API Key for weather service is missing. Add it to your .env file.");
    }
  }

  // Fetch location data based on city name
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(
      `${this.baseURL}/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Error fetching location data: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.length) {
      throw new Error(`No location found for query: ${query}`);
    }
    const coordinates:Coordinates= {
      lat: data[0].lat, lon: data[0].lon
    }

    return coordinates;
  }

  // Fetch weather data based on coordinates
  private async fetchWeatherData(coordinates: Coordinates) {
    const { lat, lon } = coordinates;
    const response = await fetch(
      `${this.baseURL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Error fetching weather data: ${response.statusText}`);
    }

    const data = await response.json();
    console.log (data)
    let currentWeather: Weather= this.parseCurrentWeather(data.list[0])
    let forecastArr = this.buildForecastArray(currentWeather,data.list);
    return forecastArr
  }
  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any) {
    const currentWeather= new Weather(
      this.cityname,
      response.main.temp, 
      response.main.humidity,
      response.wind.speed,
      response.dt_txt,
      response.weather[0].icon,
      response.weather[0].description,
    )
    return currentWeather
  }
  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]) {
    const filterweather=weatherData.filter((data:any)=>{
      return data.dt_txt.includes('12:00:00')
    })
    const forecastArray=filterweather.map((item)=>{
      return new Weather(
      this.cityname,
      item.main.temp, 
      item.main.humidity,
      item.wind.speed,
      item.dt_txt,
      item.weather[0].icon,
      item.weather[0].description,
      )
    })
    console.log (forecastArray)
    return [currentWeather, forecastArray]
  }

  // Get weather data for a specific city
  public async getWeatherForCity(city: string) {
    this.cityname=city
    const coordinates = await this.fetchLocationData(city);
    return await this.fetchWeatherData(coordinates);
  }
}
export default new WeatherService();
// Example usage
// (async () => {
//   try {
//     const weatherService = new WeatherService();
//     const weather = await weatherService.getWeatherForCity("Seattle");
//     console.log("Weather in Seattle:", weather);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// })();
