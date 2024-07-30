import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import clouds from './assets/clouds.json';
import rain from './assets/rain.json';
import sun from './assets/sun.json';
import './App.css';

const API_KEY = '9a4d3318dccf4fad70e7087665d93a9d'; // OpenWeatherMap API key

const App = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [description, setDescription] = useState('');
    const [animationData, setAnimationData] = useState(null);
    const [animationSpeeds, setAnimationSpeeds] = useState([]); // Different speeds for cloud animations

    const fetchWeatherByCity = useCallback(async (city) => {
        setLoading(true);
        setError(null);
        setDescription('');
        try {
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`);
            setWeather(response.data);
            generateDescription(response.data);
            setAnimation(response.data.weather[0].main.toLowerCase());
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Error fetching weather data. Please try again.');
            setWeather(null);
        }
        setLoading(false);
    }, []);

    const fetchWeatherByCoords = useCallback(async (lat, lon) => {
        setLoading(true);
        setError(null);
        setDescription('');
        try {
            const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
            setWeather(response.data);
            generateDescription(response.data);
            setAnimation(response.data.weather[0].main.toLowerCase());
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Error fetching weather data. Please try again.');
            setWeather(null);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        document.body.className = getTimeOfDay();
        const getLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        fetchWeatherByCoords(latitude, longitude);
                    },
                    (error) => {
                        console.error('Error getting geolocation:', error);
                        fetchWeatherByCity('London'); // Default to London if geolocation fails
                    }
                );
            } else {
                console.error('Geolocation is not supported by this browser.');
                fetchWeatherByCity('London'); // Default to London if geolocation is not supported
            }
        };
        getLocation();
    }, [fetchWeatherByCity, fetchWeatherByCoords]);

    const setAnimation = (weatherCondition) => {
        const getRandomSpeedOne = () => (Math.random() * (2.5 - 0.9) + 0.9).toFixed(2);
        const getRandomSpeedTwo = () => (Math.random() * (2.5 - 0.9) + 0.9).toFixed(2);

        switch (weatherCondition) {
            case 'rain':
                setAnimationData(rain);
                setAnimationSpeeds([1]); // Only one animation for rain
                break;
            case 'clear':
                setAnimationData(sun);
                setAnimationSpeeds([1]); // Only one animation for sun
                break;
            case 'clouds':
            default:
                setAnimationData(clouds);
                setAnimationSpeeds([getRandomSpeedOne(), getRandomSpeedTwo()]); // Random speeds for clouds
                break;
        }
    };

    const generateDescription = (weatherData) => {
        const temp = (weatherData.main.temp - 273.15);
        const calTemp = Math.round(temp);
        const condition = weatherData.weather[0].description;
        const windSpeed = weatherData.wind.speed;
        const humidity = weatherData.main.humidity;

        let desc = '';

        if (condition.includes('rain')) {
            desc += 'Det anbefales at medbringe en paraply eller tage en regnjakke på. ';
        } else if (condition.includes('clear')) {
            desc += 'Vejret er klart, en perfekt dag til udendørs aktiviteter. ';
        } else if (condition.includes('cloud')) {
            desc += 'Det er skyet. ';
        } else if (condition.includes('snow')) {
            desc += 'Det sner, klæd dig varmt. ';
        }

        desc += `Temperaturen er på ${calTemp}°C. `;

        if (calTemp < 0) {
            desc += 'Det er frysevejr udenfor, tag varmt vintertøj på. ';
        } else if (calTemp < 10) {
            desc += 'Det er koldt, klæd dig varmt. ';
        } else if (calTemp < 20) {
            desc += 'Det er køligt, tag en jakke på. ';
        } else if (calTemp > 30) {
            desc += 'Det er varmt, tag let tøj på og hold dig hydreret. ';
        }

        desc += `Vindhastigheden er ${windSpeed} m/s og luftfugtigheden er ${humidity}%.`;

        setDescription(desc);
    };

    const defaultOptions = (animationData, speed) => ({
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        },
        speed: speed,
    });

    const conditionMapping = {
        clear: 'Klart',
        clouds: 'Skyet',
        rain: 'Regn',
        snow: 'Sne',
        mist: 'Tåge',
        fog: 'Tåge',
        thunderstorm: 'Tordenvejr',
        drizzle: 'Støvregn',
    };

    return (
        <div className="App">
            <div className="lottie-background">
                {animationSpeeds.length > 1
                    ? animationSpeeds.map((speed, index) => (
                        <div key={index} className={`lottie-container lottie-${index}`}>
                            <Lottie options={defaultOptions(animationData, speed)} height={'100%'} width={'100%'} />
                        </div>
                    ))
                    : <Lottie options={defaultOptions(animationData, animationSpeeds[0])} height={'100%'} width={'100%'} />}
            </div>
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {weather && !loading && !error && (
                <>
                    <div className="weather-container">
                        <div className="header">
                            <div className="time">{new Date().toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })}</div>
                            <div className="location-condition">
                                <div className="location">{weather.name}</div>
                                <div className="separator"></div>
                                <div className="condition">{conditionMapping[weather.weather[0].main.toLowerCase()] || weather.weather[0].description}</div>
                            </div>
                        </div>
                        <div className="main">
                            <div className="weather-main">
                                <div className="temperature">{Math.round(weather.main.temp - 273.15)}°</div>
                            </div>
                        </div>
                        <div className="details">
                            <div className="detail-item">
                                <p>Wind</p>
                                <p>{weather.wind.speed} m/s</p>
                            </div>
                            <div className="detail-item">
                                <p>Humidity</p>
                                <p>{weather.main.humidity}%</p>
                            </div>
                        </div>
                        <div className="description">
                            <p>{description}</p>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 9) {
        return 'morning';
    } else if (hour >= 9 && hour < 18) {
        return 'afternoon';
    } else if (hour >= 18 && hour < 22) {
        return 'evening';
    } else {
        return 'night';
    }
};

export default App;
