// Enhanced weather widget with manual location
import { loadSettings } from '../core/storage.js';

const WEATHER_STORAGE_KEY = 'weatherLocation';

export function initWeather() {
    const weatherEl = document.getElementById('weather');
    if (!weatherEl) return;

    weatherEl.innerHTML = '<div class="loading">Loading weather...</div>';

    // Load saved location
    const savedLocation = localStorage.getItem(WEATHER_STORAGE_KEY);
    let currentLocation = savedLocation ? JSON.parse(savedLocation) : null;

    function convertTemperature(celsius) {
        const settings = loadSettings();
        if (settings.temperatureUnit === 'F') {
            return Math.round((celsius * 9/5) + 32);
        }
        return Math.round(celsius);
    }

    function getTemperatureUnit() {
        const settings = loadSettings();
        return settings.temperatureUnit === 'F' ? '°F' : '°C';
    }

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

    // Search for location by name
    async function searchLocation(query) {
        try {
            const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
            const data = await response.json();
            return data.results || [];
        } catch (error) {
            console.error('Location search failed:', error);
            return [];
        }
    }

    function createLocationUI(locationName) {
        return `
            <div class="weather-header">
                <div class="weather-location" id="weatherLocation">
                    ${locationName}
                    <i data-lucide="map-pin"></i>
                </div>
                <div class="weather-update" id="weatherUpdate"></div>
            </div>
            <div class="weather-location-input" id="weatherLocationInput">
                <input type="text" id="locationSearchInput" placeholder="Search for a city..." />
                <div class="weather-location-actions">
                    <button class="weather-location-btn" id="locationCancelBtn">Cancel</button>
                    <button class="weather-location-btn" id="locationAutoBtn">Auto-detect</button>
                    <button class="weather-location-btn primary" id="locationSearchBtn">Search</button>
                </div>
                <div id="locationSearchResults"></div>
            </div>
        `;
    }

    function showLocationInput() {
        const input = document.getElementById('weatherLocationInput');
        const searchInput = document.getElementById('locationSearchInput');
        if (input) {
            input.classList.add('show');
            searchInput.focus();
            searchInput.select();
        }
    }

    function hideLocationInput() {
        const input = document.getElementById('weatherLocationInput');
        if (input) {
            input.classList.remove('show');
            document.getElementById('locationSearchInput').value = '';
            document.getElementById('locationSearchResults').innerHTML = '';
        }
    }

    async function handleLocationSearch() {
        const query = document.getElementById('locationSearchInput').value.trim();
        if (!query) return;

        const resultsEl = document.getElementById('locationSearchResults');
        resultsEl.innerHTML = '<div style="padding: 8px; opacity: 0.6;">Searching...</div>';

        const results = await searchLocation(query);
        
        if (results.length === 0) {
            resultsEl.innerHTML = '<div style="padding: 8px; opacity: 0.6;">No results found</div>';
            return;
        }

        resultsEl.innerHTML = results.map(location => `
            <div class="weather-location-result" style="
                padding: 8px;
                margin-top: 8px;
                background: rgba(255,255,255,0.05);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 0.85rem;
            " onmouseover="this.style.background='rgba(255,255,255,0.1)'" 
               onmouseout="this.style.background='rgba(255,255,255,0.05)'"
               onclick="selectWeatherLocation(${location.latitude}, ${location.longitude}, '${location.name.replace(/'/g, "\\'")}', '${location.country || ''}')">
                <div style="font-weight: 500;">${location.name}</div>
                <div style="opacity: 0.6; font-size: 0.8rem;">
                    ${location.admin1 ? location.admin1 + ', ' : ''}${location.country || ''}
                </div>
            </div>
        `).join('');
    }

    // Make this function global for onclick
    window.selectWeatherLocation = function(lat, lon, name, country) {
        currentLocation = { lat, lon, name, country };
        localStorage.setItem(WEATHER_STORAGE_KEY, JSON.stringify(currentLocation));
        hideLocationInput();
        fetchWeather(lat, lon, name);
    };

    function fetchWeather(lat, lon, locationName = 'Local') {
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=3&timezone=auto`;
        
        fetch(url)
            .then(r => r.json())
            .then(data => {
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
                    const high = convertTemperature(daily.temperature_2m_max[index]);
                    const low = convertTemperature(daily.temperature_2m_min[index]);
                    const icon = mapWeatherCode(daily.weather_code[index]);
                    const unit = getTemperatureUnit();
                    
                    return `
                        <div class="forecast-day">
                            <div class="forecast-name">${dayName}</div>
                            <i data-lucide="${icon}" class="forecast-icon"></i>
                            <div class="forecast-range">${low}${unit}/${high}${unit}</div>
                        </div>
                    `;
                }).join('');

                weatherEl.innerHTML = `
                    ${createLocationUI(locationName)}
                    <div class="weather-main">
                        <i data-lucide="${mapWeatherCode(current.weather_code)}" class="weather-icon"></i>
                        <div>
                            <div class="weather-temp-large">${convertTemperature(current.temperature_2m)}${getTemperatureUnit()}</div>
                            <div class="weather-wind">${Math.round(current.wind_speed_10m)} km/h</div>
                        </div>
                    </div>
                    <div class="weather-forecast">
                        ${forecastHtml}
                    </div>
                `;

                // Update the time
                document.getElementById('weatherUpdate').textContent = updateTime;

                weatherEl.classList.remove('loading');
                if (window.lucide) lucide.createIcons();

                // Setup event listeners
                setupWeatherEventListeners();
            })
            .catch(error => {
                console.error('Weather fetch failed:', error);
                weatherEl.innerHTML = `
                    <div style="text-align: center; opacity: 0.7; font-size: 0.8rem;">
                        Weather unavailable
                        <div style="margin-top: 8px;">
                            <button class="weather-location-btn" onclick="initWeather()">Retry</button>
                        </div>
                    </div>
                `;
            });
    }

    function setupWeatherEventListeners() {
        const locationEl = document.getElementById('weatherLocation');
        const cancelBtn = document.getElementById('locationCancelBtn');
        const autoBtn = document.getElementById('locationAutoBtn');
        const searchBtn = document.getElementById('locationSearchBtn');
        const searchInput = document.getElementById('locationSearchInput');

        if (locationEl) {
            locationEl.addEventListener('click', showLocationInput);
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', hideLocationInput);
        }

        if (autoBtn) {
            autoBtn.addEventListener('click', () => {
                hideLocationInput();
                localStorage.removeItem(WEATHER_STORAGE_KEY);
                getLocationAndFetch();
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', handleLocationSearch);
        }

        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleLocationSearch();
                }
            });
        }

        // Click outside to close
        document.addEventListener('click', (e) => {
            const widget = document.querySelector('.weather-widget');
            if (widget && !widget.contains(e.target)) {
                hideLocationInput();
            }
        });
    }

    function getLocationAndFetch() {
        // Check if we have a saved location
        if (currentLocation) {
            fetchWeather(currentLocation.lat, currentLocation.lon, currentLocation.name);
            return;
        }

        // Otherwise, try to get current location
        if (navigator.geolocation) {
            const timeoutId = setTimeout(() => {
                fetchWeather(32.0853, 34.7818, 'Tel Aviv'); // Fallback
            }, 5000);

            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    clearTimeout(timeoutId);
                    const cityName = await getCityName(
                        position.coords.latitude,
                        position.coords.longitude
                    );
                    fetchWeather(
                        position.coords.latitude,
                        position.coords.longitude,
                        cityName
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

    // Start fetching weather
    getLocationAndFetch();
}

// Re-export for global access
window.initWeather = initWeather;
