import React, { useState } from "react";
import './Weather.css';

const api = {
    key: "c49c77f912c085f21053770c4160dd79",
    base: "https://api.openweathermap.org/data/2.5/"
};

function Weather() {
    const [query, setQuery] = useState('');
    const [weather, setWeather] = useState({});

    const search = evt => {
        if (evt.key === "Enter") {
            fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
            .then(res => res.json())
            .then(result => {
                setWeather(result);
                setQuery('');
            });
        }
    };

    const dateBuilder = (d) => {
        let months = ["January", "February", "March", "April", "May", "June", "July", 
            "August", "September", "October", "November", "December"];
        let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

        let day = days[d.getDay()];
        let date = d.getDate();
        let month = months[d.getMonth()];
        let year = d.getFullYear();
        
        return `${day} ${date} ${month} ${year}`; 
    };

    // Function to format the local time based on the timezone offset
    const getLocalTime = () => {
        if (weather.timezone) {
            const utcTime = new Date().getTime();
            const localTime = new Date(utcTime + weather.timezone * 1000);
            return localTime;
        }
        return null;
    };

    // Function to create random stars
    const createStars = (count) => {
        const stars = [];
        for (let i = 0; i < count; i++) {
            stars.push(
                <div
                    key={i}
                    className="star"
                    style={{
                        left: `${Math.random() * 100}vw`,
                        top: `${Math.random() * 100}vh`,
                        animationDuration: `${Math.random() * 1 + 1}s`,
                        opacity: Math.random()
                    }}
                />
            );
        }
        return stars;
    };

    // Determine the background class based on the local time
    const getBackgroundClass = () => {
        const localTime = getLocalTime();
        if (localTime) {
            const hours = localTime.getUTCHours();

            if (hours >= 6 && hours < 18) {
                if (weather.main) {
                    const temperature = weather.main.temp;
                    return temperature < 16 ? 'cold' : 'warm';
                }
                return 'day'; // Default to day background if no weather data
            } else {
                return 'night'; // Night background with stars
            }
        }
        return '';
    };

    const isNighttime = () => {
        const localTime = getLocalTime();
        if (localTime) {
            const hours = localTime.getUTCHours();
            return hours < 6 || hours >= 18; // Nighttime condition
        }
        return false;
    };

    return (
        <div className={`weather-content ${getBackgroundClass()}`}>
            <div className="search-box">
                <input 
                    type="text"
                    className="search-bar"
                    placeholder="Search..."
                    onChange={(e) => setQuery(e.target.value)}
                    value={query}
                    onKeyDown={search}
                />
            </div>

            {(typeof weather.main !== "undefined") ? (
                <div>
                    <div>
                        <div className="location">
                            {weather.name}, {weather.sys.country}
                        </div>
                        
                        <div className="date">
                            {dateBuilder(new Date())}
                        </div>
                    </div>

                    <div className="time">
                        {getLocalTime()?.toLocaleTimeString()} 
                    </div>

                    <div className="weather-box">
                        <div className="temp"> 
                            {Math.round(weather.main.temp)}°C
                        </div>

                        <div className="weather">
                            {weather.weather[0].main}
                        </div>
                    </div>
                </div>
            ) : ('')}

            {/* Render stars animation if it's nighttime */}
            {isNighttime() && (
                <div className="stars">
                    {createStars(100)}
                </div>
            )}

            {/* Render clouds if the weather indicates so */}
            {weather.weather && weather.weather[0].main.toLowerCase() === 'clouds' && (
                <div className="clouds">
                    {createClouds(10)} 
                </div>
            )}

            {/* Render rain if the weather indicates so */}
            {weather.weather && weather.weather[0].main.toLowerCase() === 'rain' && (
                <div className="rain">
                    {createRainDrops()}
                </div>
            )}
        </div>
    );
}

// Function to create random rain drops
const createRainDrops = () => {
    const drops = [];
    for (let i = 0; i < 100; i++) {
        drops.push(
            <div
                key={i}
                className="drop"
                style={{
                    left: `${Math.random() * 100}vw`, // Random position from 0 to 100vw
                    animationDuration: `${Math.random() * 0.5 + 0.5}s`, // Random speed for drops
                    animationDelay: `${Math.random() * 2}s` // Random delay for staggered effect
                }}
            />
        );
    }
    return drops;
};

// Function to create random clouds
const createClouds = (count) => {
    const clouds = [];
    for (let i = 0; i < count; i++) {
        clouds.push(
            <div
                key={i}
                className="cloud"
                style={{
                    width: '100px', // Fixed width for clouds
                    height: '50px', // Fixed height for clouds
                    left: `${Math.random() * 100}vw`, // Random position from 0 to 100vw
                    top: `${Math.random() * 20 + 10}vh`, // Random height from 10% to 30% of viewport height
                    filter: 'blur(5px)', // Increased blur for softness
                }} 
            />
        );
    }
    return clouds;
};

export default Weather;
