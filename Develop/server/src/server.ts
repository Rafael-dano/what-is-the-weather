const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

const HISTORY_FILE = path.join(__dirname, 'searchHistory.json');

// Serve static front-end files (if applicable)
app.use(express.static('public'));

// Route to serve the index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get search history
app.get('/api/weather/history', (req, res) => {
    fs.readFile(HISTORY_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading history file' });
        }
        res.json(JSON.parse(data));
    });
});

// Save a city and fetch weather data
app.post('/api/weather', async (req, res) => {
    const { city } = req.body;
    if (!city) {
        return res.status(400).json({ error: 'City is required' });
    }

    try {
        // Get city coordinates
        const geoResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`);
        if (geoResponse.data.length === 0) {
            return res.status(404).json({ error: 'City not found' });
        }

        const { lat, lon } = geoResponse.data[0];

        // Get weather data
        const weatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`);
        const weatherData = weatherResponse.data;

        // Read and update history
        fs.readFile(HISTORY_FILE, 'utf8', (err, data) => {
            const history = err ? [] : JSON.parse(data);
            const newEntry = { id: uuidv4(), city, lat, lon };
            history.push(newEntry);

            fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), (err) => {
                if (err) {
                    return res.status(500).json({ error: 'Error saving history' });
                }
                res.json(weatherData);
            });
        });

    } catch (error) {
        res.status(500).json({ error: 'Error fetching weather data' });
    }
});

// DELETE a city from history (Bonus)
app.delete('/api/weather/history/:id', (req, res) => {
    const cityId = req.params.id;

    fs.readFile(HISTORY_FILE, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Error reading history file' });
        }

        let history = JSON.parse(data);
        history = history.filter(city => city.id !== cityId);

        fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating history' });
            }
            res.json({ message: 'City deleted' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

