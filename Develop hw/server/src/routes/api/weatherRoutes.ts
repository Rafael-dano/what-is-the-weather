import { Router, type Request, type Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Define the interface for the geoResponse data
interface GeoLocation {
  lat: number;
  lon: number;
  name: string;
}

interface WeatherResponse {
  data: GeoLocation[];
}

router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // ✅ Get city coordinates with proper typing
    const geoResponse = await axios.get<WeatherResponse>(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    if (geoResponse.data.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { lat, lon } = geoResponse.data[0];

    // ✅ Get weather data
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    const weatherData = weatherResponse.data;

    // Rest of the code remains the same...
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Error fetching weather data' });
  }
});


const router = Router();
const HISTORY_FILE = path.join(__dirname, '../../data/searchHistory.json'); // Ensure the path is correct

/// ✅ POST Request to retrieve weather data and save search history
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;
  if (!city) {
    return res.status(400).json({ error: 'City is required' });
  }

  try {
    // ✅ Get city coordinates
    const geoResponse = await axios.get(
      `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`
    );

    if (geoResponse.data.length === 0) {
      return res.status(404).json({ error: 'City not found' });
    }

    const { lat, lon } = geoResponse.data[0];

    // ✅ Get weather data
    const weatherResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`
    );
    const weatherData = weatherResponse.data;

    // ✅ Read and update search history
    let history = [];
    try {
      const historyData = await fs.readFile(HISTORY_FILE, 'utf8');
      history = JSON.parse(historyData);
    } catch (error) {
      console.error('History file not found or empty, creating a new one.');
    }

    const newEntry = { id: uuidv4(), city, lat, lon };
    history.push(newEntry);

    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));

    res.json(weatherData); // Returning weather data
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Error fetching weather data' });
  }
});


// ✅ GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf8');
    const history = JSON.parse(data);
    res.json(history);
  } catch (error) {
    console.error('Error reading search history:', error);
    res.status(500).json({ error: 'Error reading search history' });
  }
});

// ✅ BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const cityId = req.params.id;

  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf8');
    let history = JSON.parse(data);
    
    // Remove the city by ID
    history = history.filter((entry) => entry.id !== cityId);

    await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));

    res.json({ message: 'City deleted' });
  } catch (error) {
    console.error('Error deleting city from history:', error);
    res.status(500).json({ error: 'Error deleting city' });
  }
});

export default router;
