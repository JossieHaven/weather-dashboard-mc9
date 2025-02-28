import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
    try {
    // TODO: GET weather data from city name
      const cityName = req.body.cityName;
  
      WeatherService.getWeatherForCity(cityName).then((data) => {
        // TODO: save city to search history
        HistoryService.addCity(cityName);
  
        res.json(data);
      });
    } catch (error) {
      res.status(500).json(error);
    }
  });
  


// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
    HistoryService.getCities()
      .then((data) => {
        return res.json(data);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  });

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ error: "Invalid City ID" });

    }
    
    await HistoryService.removeCity(id);
    return res.json({ message: "City removed from history" });
  } catch (error) {
    console.error("Error removing city from history:", error);
    return res.status(500).json( {error: "Failed to delete city from history" });
  }
});

export default router;
