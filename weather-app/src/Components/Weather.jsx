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
                // console.log(result);
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
const createClouds = () => {
    const clouds = [];
    const cloudCount = 10; // Increase the number of clouds for more coverage
    for (let i = 0; i < cloudCount; i++) {
        clouds.push(
            <div
                key={i}
                className="cloud"
                style={{
                    width: `${Math.random() * 150 + 50}px`, // Random width between 50px and 200px
                    height: `${Math.random() * 60 + 30}px`, // Random height between 30px and 90px
                    left: `${Math.random() * 100}vw`, // Random position from 0 to 100vw
                    top: `${Math.random() * 20 + 10}vh`, // Random height from 10% to 30% of viewport height
                }}
            />
        );
    }
    return clouds;
};


    // Determine the background class based on temperature
    const getBackgroundClass = () => {
        if (weather.main) {
            const temperature = weather.main.temp;
            if (temperature < 15) {
                return 'cold'; // Cold background
            } else {
                return 'warm'; // Warm background
            }
        }
        return '';
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

            {(typeof weather.main != "undefined") ? (
                <div>
                    <div>
                        <div className="location">
                            {weather.name}, {weather.sys.country}
                        </div>
                        
                        <div className="date">
                            {dateBuilder(new Date())}
                        </div>
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

             {/* Render sun animation if it's sunny */}
             {weather.weather && weather.weather[0].main.toLowerCase() === 'clear' && (
                <div className="sun" />
            )}

             {/* Render rain animation if it's raining */}
             {weather.weather && weather.weather[0].main.toLowerCase() === 'rain' && (
                <div className="rain">
                    {createRainDrops()}
                </div>
            )}

            {/* Render cloud animation if it's cloudy */}
            {weather.weather && weather.weather[0].main.toLowerCase() === 'clouds' && (
                <div className="clouds">
                    {createClouds()}
                </div>
            )}
        </div>

        
    );
}
export default Weather;
