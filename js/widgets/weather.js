// Enhanced weather widget
export function initWeather() {
    const weatherEl = document.getElementById('weather');
    if (!weatherEl) return;

    weatherEl.innerHTML = '<div class="loading">Loading weather...</div>';

    function mapWeatherCode(code) {
        const weatherCodes = {
            0: 'sun',
            1: 'cloud-sun', 2: 'cloud-sun', 3: 'cloud',
            45: 'cloud-fog', 48: 'cloud-fog',
            51: 'cloud-drizzle', 53: 'cloud-drizzle', 55: 'cloud-drizzle',
            56: 'cloud-drizzle', 57: 'cloud-drizzle',
            61: 'cloud-rain', 63: 'cloud-rain', 65: 'cloud-rain',
            66: 'cloud-rain-wind', 67: 'cloud-rain-wind',
            71: 'cloud-snow', 73: 'cloud-snow', 75: 'cloud-snow', 77: 'cloud-snow',
            80: 'cloud-rain-wind', 81: 'cloud-rain-wind', 82: 'cloud-rain-wind',
            85: 'cloud-snow', 86: 'cloud-snow',
            95: 'cloud-lightning', 96: 'cloud-lightning', 99: 'cloud-lightning'
        };
        return weatherCodes[code] || 'cloud';
    }

    // Get city name from coordinates using reverse geocoding
    function getCityName(lat, lon) {
        return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
            .then(response => response.json())
            .then(data => {
                return data.city || data.locality || data.principalSubdivision || 'Local';
            })
            .catch(() => 'Local');
    }

    function fetchWeather(lat, lon, locationName = 'Local') {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=3&timezone=auto`;
        
        // Get city name if coordinates are provided
        const cityPromise = (lat && lon && locationName === 'Local') 
            ? getCityName(lat, lon) 
            : Promise.resolve(locationName);

        Promise.all([fetch(url).then(r => r.json()), cityPromise])
            .then(([data, cityName]) => {
                if (!data.current || !data.daily) {
                    throw new Error('Incomplete weather data');
                }

                const current = data.current;
                const daily = data.daily;
                const updateTime = new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                });

                const forecastHtml = daily.time.slice(0, 3).map((dateStr, index) => {
                    const date = new Date(dateStr + 'T00:00:00');
                    const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });
                    const high = Math.round(daily.temperature_2m_max[index]);
                    const low = Math.round(daily.temperature_2m_min[index]);
                    const icon = mapWeatherCode(daily.weather_code[index]);
                    
                    return `
                        <div class="forecast-day">
                            <div class="forecast-name">${dayName}</div>
                            <i data-lucide="${icon}" class="forecast-icon"></i>
                            <div class="forecast-range">${low}°/${high}°</div>
                        </div>
                    `;
                }).join('');

                weatherEl.innerHTML = `
                    <div class="weather-header">
                        <div class="weather-location">${cityName}</div>
                        <div class="weather-update">${updateTime}</div>
                    </div>
                    <div class="weather-main">
                        <i data-lucide="${mapWeatherCode(current.weather_code)}" class="weather-icon"></i>
                        <div>
                            <div class="weather-temp-large">${Math.round(current.temperature_2m)}°C</div>
                            <div class="weather-wind">${Math.round(current.wind_speed_10m)} km/h</div>
                        </div>
                    </div>
                    <div class="weather-forecast">
                        ${forecastHtml}
                    </div>
                `;

                weatherEl.classList.remove('loading');
                if (window.lucide) lucide.createIcons();
            })
            .catch(error => {
                console.error('Weather fetch failed:', error);
                weatherEl.innerHTML = `
                    <div style="text-align: center; opacity: 0.7; font-size: 0.8rem;">
                        Weather unavailable
                    </div>
                `;
            });
    }

    // Get location and fetch weather
    if (navigator.geolocation) {
        const timeoutId = setTimeout(() => {
            fetchWeather(32.0853, 34.7818, 'Tel Aviv'); // Fallback
        }, 5000);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                clearTimeout(timeoutId);
                fetchWeather(
                    position.coords.latitude,
                    position.coords.longitude,
                    'Local'
                );
            },
            () => {
                clearTimeout(timeoutId);
                fetchWeather(32.0853, 34.7818, 'Tel Aviv'); // Fallback
            },
            {
                enableHighAccuracy: false,
                timeout: 4000,
                maximumAge: 600000
            }
        );
    } else {
        fetchWeather(32.0853, 34.7818, 'Tel Aviv'); // Fallback
    }
}