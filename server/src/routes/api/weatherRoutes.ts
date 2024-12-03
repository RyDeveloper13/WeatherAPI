import { Router } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/',async (req, res) => {
  // TODO: GET weather data from city name
  // TODO: save city to search history
  // try{
    let city = req.body.cityName
    let weatherdata = await WeatherService.getWeatherForCity(city)
    await HistoryService.addCity(city)
    console.log (weatherdata)
    res.json(weatherdata)
  // } catch (err){
  //   res.json(err)
  // }
});

// TODO: GET search history
router.get('/history', async (_req, res) => {
  try {
    const citydata = await HistoryService.getCities()
    res.json (citydata)
  } catch (error) {
    res.json(error)
  }
});

// * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req, res) => {});

export default router;
