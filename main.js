function updateGreeting() {
    // Load saved name or default to Tokyo
    const userName = localStorage.getItem('username') || 'Tokyo';
    const hour = new Date().getHours();
    let greeting = "Hello";
    let emoji = "🌞";

    if (hour >= 5 && hour < 12) {
        greeting = "Good Morning";
        emoji = "🌅";
    } else if (hour >= 12 && hour < 18) {
        greeting = "Good Afternoon";
        emoji = "🌞";
    } else if (hour >= 18 && hour < 22) {
        greeting = "Good Evening";
        emoji = "🌇";
    } else {
        greeting = "Good Night";
        emoji = "🌙";
    }

    const g = document.getElementById("greeting");
    g.innerHTML = `${greeting}, <span id="username">${userName}</span> ${emoji}`;

    // Make username clickable to change it
    const nameSpan = document.getElementById("username");
    nameSpan.addEventListener("click", () => {
        const newName = prompt("Enter your name:", userName);
        if (newName) {
            localStorage.setItem("username", newName);
            updateGreeting();
        }
    });
}
updateGreeting();

/* ---------- Local Wallpaper Picker (folder "wallpaper") ---------- */
const localWallpapers = Array.from({ length: 8 }, (_, i) => `wallpaper/bg${i + 1}.webp`);

function pickLocalWallpaper() {
    let idx = Number(localStorage.getItem('wallpaperIndex') || 0);
    document.body.style.backgroundImage = `url('${localWallpapers[idx]}')`;
    localStorage.setItem('wallpaperIndex', (idx + 1) % localWallpapers.length);
}
pickLocalWallpaper();

// Clock with smooth transitions
function updateClock() {
    const now = new Date();
    const hours = now.getHours() % 12 || 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = now.getHours() >= 12 ? 'PM' : 'AM';

    const clockElement = document.getElementById('clock');
    const newTime = `${hours}:${minutes} ${ampm}`;

    if (clockElement.textContent !== newTime) {
        // Animate the change
        const digits = clockElement.querySelectorAll('.digit');
        digits.forEach(digit => {
            digit.classList.add('changing');
            setTimeout(() => digit.classList.remove('changing'), 300);
        });

        // Update with animated digits
        clockElement.innerHTML = newTime.split('').map(char =>
            `<span class="digit">${char}</span>`
        ).join('');
    }
}
setInterval(updateClock, 1000);
updateClock();

// Quote of the Day
const quotes = [
    "Keep going. Everything you need will come to you.",
    "Discipline is choosing between what you want now and what you want most.",
    "The grind never lies.",
    "Focus beats talent when talent doesn't focus.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Push yourself, because no one else is going to do it for you.",
    "The only limit to your impact is your imagination and commitment.",
    "You don't have to be great to start, but you have to start to be great.",
    "Hard work beats talent when talent doesn't work hard.",
    "Dream big. Start small. Act now.",
    "Every champion was once a contender who refused to give up.",
    "Don't watch the clock; do what it does. Keep going.",
    "You are your only limit.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Small steps every day lead to big results.",
    "Be stronger than your excuses.",
    "Start where you are. Use what you have. Do what you can.",
    "If it doesn't challenge you, it won't change you.",
    "You miss 100% of the shots you don't take.",
    "Be so good they can't ignore you.",
    "Work until your idols become your rivals.",
    "Don't limit your challenges. Challenge your limits.",
    "Nothing worth having comes easy.",
    "Stay hungry. Stay foolish.",
    "Winners focus on winning. Losers focus on winners.",
    "Grind in silence. Let success make the noise.",
    "Consistency is more important than perfection.",
    "Stop doubting yourself. Work hard and make it happen.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Action is the foundational key to all success."
];
document.getElementById('quote').textContent = quotes[Math.floor(Math.random() * quotes.length)];

// 🔍 Search Engine Switcher
const engines = {
    google: { action: 'https://www.google.com/search', icon: 'https://www.google.com/favicon.ico' },
    duckduckgo: { action: 'https://duckduckgo.com/', icon: 'https://duckduckgo.com/favicon.ico' },
    brave: { action: 'https://search.brave.com/search', icon: 'https://brave.com/static-assets/images/brave-favicon.png' }
};

const currentIcon = document.getElementById('currentEngineIcon');
const engineSelect = document.getElementById('engineSelect');
const form = document.getElementById('searchForm');

currentIcon.addEventListener('click', () => {
    if (!engineSelect.classList.contains('show')) {
        engineSelect.classList.remove('hiding');
        engineSelect.classList.add('show');
    } else {
        engineSelect.classList.remove('show');
        engineSelect.classList.add('hiding');
        setTimeout(() => {
            engineSelect.classList.remove('hiding');
        }, 350);
    }
});

engineSelect.querySelectorAll('.engine-icon').forEach(icon => {
    icon.addEventListener('click', () => {
        const eng = engines[icon.dataset.action];
        form.action = eng.action;
        currentIcon.src = eng.icon;
        engineSelect.classList.remove('show');
        engineSelect.classList.add('hiding');
        setTimeout(() => {
            engineSelect.classList.remove('hiding');
        }, 350);

        const searchInput = document.getElementById('searchInput');
        if (icon.dataset.action === 'duckduckgo') {
            searchInput.placeholder = "Search Anonymously";
        } else {
            searchInput.placeholder = `Search with ${icon.dataset.action.charAt(0).toUpperCase() + icon.dataset.action.slice(1)}`;
        }
    });
});

document.getElementById('searchInput').placeholder = "Search with Google";

function addBookmarkPrompt() {
    // Ask for a short URL, prepend protocol if missing
    const input = prompt("Enter site URL (e.g. facebook.com)", "");
    if (!input) return;
    const url = input.startsWith("http://") || input.startsWith("https://")
        ? input
        : `https://${input}`;

    // Prompt for a display name or derive from hostname
    const name = prompt("Enter site name (optional):", "") ||
        new URL(url).hostname.replace("www.", "");

    // Save bookmark and re-render
    bookmarks.push({
        url,
        name,
        icon: `${new URL(url).origin}/favicon.ico`
    });
    localStorage.setItem('customBookmarks', JSON.stringify(bookmarks));
    renderBookmarks();
}

// Bookmarks (editable)
// Load or seed bookmarks
let bookmarks = JSON.parse(localStorage.getItem('customBookmarks') || "[]");
if (bookmarks.length === 0) {
    bookmarks = [
        { name: "YouTube Music", url: "https://music.youtube.com/", icon: "https://music.youtube.com/favicon.ico" },
        { name: "Reddit", url: "https://www.reddit.com", icon: "https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png" },
        { name: "GitHub", url: "https://github.com", icon: "https://github.githubassets.com/favicons/favicon.png" },
        { name: "Twitter", url: "https://twitter.com", icon: "https://abs.twimg.com/favicons/twitter.ico" }
    ];
    localStorage.setItem('customBookmarks', JSON.stringify(bookmarks));
}

async function fetchTitle(url) {
    try {
        const response = await fetch(url, { method: 'GET', mode: 'cors' });
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const title = doc.querySelector('title');
        return title ? title.innerText.trim() : null;
    } catch {
        return null;
    }
}

async function renderBookmarks() {
    // Load current bookmarks list
    bookmarks = JSON.parse(localStorage.getItem('customBookmarks'));
    const container = document.getElementById('bookmarks');
    container.innerHTML = "";

    // Map common sites to Lucide/Feather/Tabler icon names
    const iconMap = {
        'github.com': { lucide: 'github', feather: 'github', tabler: 'brand-github' },
        'mail.google.com': { lucide: 'mail', feather: 'mail', tabler: 'mail' },
        'music.youtube.com': { lucide: 'youtube', feather: 'youtube', tabler: 'brand-youtube' },
        'www.reddit.com': { lucide: 'reddit', feather: '', tabler: 'brand-reddit' },
        'twitter.com': { lucide: 'twitter', feather: 'twitter', tabler: 'brand-twitter' },
        'meet.google.com': { lucide: 'video', feather: 'video', tabler: 'video' },
        'drive.google.com': { lucide: 'folder', feather: 'folder', tabler: 'brand-google-drive' },
        'facebook.com': { lucide: 'facebook', feather: '', tabler: 'brand-facebook' },
        'www.facebook.com': { lucide: 'facebook', feather: '', tabler: 'brand-facebook' },
        'youtube.com': { lucide: 'youtube', feather: 'youtube', tabler: 'brand-youtube' },
        'www.youtube.com': { lucide: 'youtube', feather: 'youtube', tabler: 'brand-youtube' },
        'wix.com': { lucide: 'globe', feather: 'globe', tabler: 'world' },
        'www.wix.com': { lucide: 'globe', feather: 'globe', tabler: 'world' },
        'reddit.com': { lucide: 'reddit', feather: '', tabler: 'brand-reddit' },
        'web.telegram.org': { lucide: 'message-circle', feather: 'message-circle', tabler: 'brand-telegram' },
        't.me': { lucide: 'message-circle', feather: 'message-circle', tabler: 'brand-telegram' },
        // Add more mappings as needed
    };

    for (let i = 0; i < bookmarks.length; i++) {
        const b = bookmarks[i];
        const url = new URL(b.url);
        let name = b.name;
        if (!name) {
            name = await fetchTitle(b.url);
            name = name || url.hostname.replace("www.", "");
            bookmarks[i].name = name;
            localStorage.setItem('customBookmarks', JSON.stringify(bookmarks));
        }
        // Icon logic: Lucide > Feather > Tabler > favicon > fallback
        let iconHtml = '';
        const mapping = iconMap[url.hostname];
        // Custom black and white Reddit SVG
        const redditSVG = `<svg class="bookmark-icon" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="black" stroke-width="1.5" fill="white"/><circle cx="9" cy="13.5" r="1.5" fill="black"/><circle cx="15" cy="13.5" r="1.5" fill="black"/><path d="M8.5 16c1.5 1 5.5 1 7 0" stroke="black" stroke-width="1.5" fill="none"/><circle cx="19" cy="6" r="1.2" fill="white" stroke="black" stroke-width="1.2"/><path d="M16.5 7.5l-2.5-1 1-3" stroke="black" stroke-width="1.2" fill="none"/></svg>`;
        if (url.hostname === 'reddit.com' || url.hostname === 'www.reddit.com') {
            iconHtml = redditSVG;
        } else if (mapping && mapping.lucide) {
            iconHtml = `<i data-lucide="${mapping.lucide}" class="bookmark-icon"></i>`;
        } else if (mapping && mapping.feather) {
            iconHtml = `<i data-feather="${mapping.feather}" class="bookmark-icon"></i>`;
        } else if (mapping && mapping.tabler) {
            iconHtml = `<i class="ti ${mapping.tabler} bookmark-icon"></i>`;
        } else {
            // fallback to favicon image
            let icon = b.icon || `${url.origin}/favicon.ico`;
            if (url.hostname === 'mail.google.com') {
                icon = 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico';
            }
            iconHtml = `<img src="${icon}" alt="${name}" class="bookmark-icon">`;
        }

        const a = document.createElement('a');
        a.href = b.url;
        a.target = "_self";
        a.className = "bookmark";
        a.innerHTML = `${iconHtml}<span class="bookmark-name">${name}</span>`;

        // Fallback to default icon if favicon fails to load (for <img> only)
        const img = a.querySelector('img');
        if (img) {
            img.onerror = function () {
                this.onerror = null;
                this.src = 'icons/icon-192.png'; // fallback icon
            };
        }

        a.addEventListener('click', (e) => {
            // Left click opens the link
            window.location.href = b.url;
        });

        a.addEventListener('contextmenu', async (e) => {
            e.preventDefault();
            const newUrl = prompt(`Edit URL for ${name}:`, b.url);
            const newName = prompt(`Edit Name for ${name}:`, name);
            if (newUrl && newName !== null) {
                const updatedUrl = new URL(newUrl.startsWith("http") ? newUrl : "https://" + newUrl);
                bookmarks[i] = {
                    url: updatedUrl.href,
                    name: newName,
                    icon: `${updatedUrl.origin}/favicon.ico`
                };
                localStorage.setItem('customBookmarks', JSON.stringify(bookmarks));
                renderBookmarks();
            }
        });

        // --- Drag and Drop for custom bookmarks ---
        a.setAttribute('draggable', 'true');
        a.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', i.toString());
        });
        a.addEventListener('dragover', e => {
            e.preventDefault();
        });
        a.addEventListener('drop', e => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
            const toIndex = i;
            // Only reorder bookmarks if both are user-editable (all bookmarks are now editable)
            const [moved] = bookmarks.splice(fromIndex, 1);
            bookmarks.splice(toIndex, 0, moved);
            localStorage.setItem('customBookmarks', JSON.stringify(bookmarks));
            renderBookmarks();
        });
        // ---

        container.appendChild(a);
    }
    // --- "add bookmark" tile ---
    const addTile = document.createElement('div');
    addTile.className = 'bookmark-add';
    addTile.textContent = '+';
    addTile.title = "Add bookmark";
    addTile.setAttribute('draggable', 'false');
    addTile.addEventListener('click', () => addBookmarkPrompt());
    container.appendChild(addTile);
}
renderBookmarks();

// Enhanced search functionality
const searchInput = document.getElementById('searchInput');
const searchSuggestions = document.getElementById('searchSuggestions');

// Search history
let searchHistory = JSON.parse(localStorage.getItem('searchHistory') || '[]');

// Search suggestions
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length > 0) {
        showSuggestions(query);
    } else {
        hideSuggestions();
    }
});

searchInput.addEventListener('focus', () => {
    document.body.classList.add('search-focused');
    document.querySelector('.search-bar').classList.add('focused');
    if (searchInput.value.trim().length > 0) {
        showSuggestions(searchInput.value.trim());
    }
});

searchInput.addEventListener('blur', () => {
    document.body.classList.remove('search-focused');
    document.querySelector('.search-bar').classList.remove('focused');
});

// Hide suggestions when clicking outside
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
        hideSuggestions();
    }
});

function showSuggestions(query) {
    const suggestions = [];

    // Add search history
    searchHistory
        .filter(item => item.toLowerCase().includes(query.toLowerCase()))
        .slice(0, 3)
        .forEach(item => {
            suggestions.push({
                text: item,
                type: 'History',
                icon: 'clock'
            });
        });

    // Add common searches
    const commonSearches = [
        'weather', 'news', 'maps', 'translate', 'calculator'
    ].filter(item => item.toLowerCase().includes(query.toLowerCase()));

    commonSearches.forEach(item => {
        suggestions.push({
            text: item,
            type: 'Suggestion',
            icon: 'search'
        });
    });

    if (suggestions.length > 0) {
        searchSuggestions.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" onclick="selectSuggestion('${suggestion.text}')">
                <i data-lucide="${suggestion.icon}" class="icon"></i>
                <div class="text">${suggestion.text}</div>
                <div class="type">${suggestion.type}</div>
            </div>
        `).join('');
        searchSuggestions.classList.add('show');
        lucide.createIcons();
    } else {
        hideSuggestions();
    }
}

function hideSuggestions() {
    searchSuggestions.innerHTML = '';
    searchSuggestions.classList.remove('show');
}

function selectSuggestion(text) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = text;
    hideSuggestions();
}

// Save search history
document.getElementById('searchForm').addEventListener('submit', (e) => {
    const query = searchInput.value.trim();
    if (query && !searchHistory.includes(query)) {
        searchHistory.unshift(query);
        searchHistory = searchHistory.slice(0, 10); // Keep last 10 searches
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
});

// Helper to map weather codes to emoji
function getWeatherEmoji(code) {
    if (code === 0) return '☀️';
    if (code >= 1 && code <= 3) return '🌤️';
    if (code >= 45 && code <= 48) return '🌫️';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 86)) return '🌧️';
    if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) return '🌨️';
    if (code >= 95 && code <= 99) return '⛈️';
    return '☁️';
}

// After DOMContentLoaded, replace Lucide and Feather icons
document.addEventListener('DOMContentLoaded', function () {
    if (window.lucide) lucide.createIcons();
    if (window.feather) feather.replace();

    // Initialize weather after DOM is loaded
    initializeWeather();
});

// Initialize weather functionality
function initializeWeather() {
    console.log('Initializing weather...');

    // Check if weather element exists
    const weatherElement = document.getElementById('weather');
    if (!weatherElement) {
        console.error('Weather element not found in DOM!');
        return;
    }
    console.log('Weather element found:', weatherElement);

    // Try geolocation first, then fallback
    if (navigator.geolocation) {
        console.log('Geolocation available, requesting position...');
        navigator.geolocation.getCurrentPosition(
            async pos => {
                console.log('Geolocation successful:', pos.coords);
                const { latitude, longitude } = pos.coords;
                // Reverse geocode for city/country
                let city = 'Your Location', country = '';
                try {
                    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/reverse?latitude=${latitude}&longitude=${longitude}&language=en`);
                    const geoData = await geoRes.json();
                    if (geoData.results && geoData.results.length) {
                        city = geoData.results[0].name;
                        country = geoData.results[0].country;
                    }
                } catch (error) {
                    console.log('Reverse geocoding failed:', error);
                }
                fetchWeather(latitude, longitude, city, country);
            },
            (error) => {
                console.log('Geolocation failed:', error);
                fetchWeatherByIP();
            }
        );
    } else {
        console.log('Geolocation not available, using IP fallback');
        fetchWeatherByIP();
    }
}

// Add manual refresh function for debugging
function refreshWeather() {
    console.log('Manual weather refresh triggered');
    initializeWeather();
}

// Make refreshWeather available globally for debugging
window.refreshWeather = refreshWeather;

// Test weather with hardcoded coordinates (Tokyo)
function testWeather() {
    console.log('Testing weather with Tokyo coordinates...');
    fetchWeather(35.6762, 139.6503, 'Tokyo', 'Japan');
}

// Make testWeather available globally for debugging
window.testWeather = testWeather;

// Fallback to IP-based lookup
function fetchWeatherByIP() {
    console.log('Fetching weather by IP...');
    fetch('https://ipapi.co/json/')
        .then(r => r.json())
        .then(loc => {
            console.log('IP location data:', loc);
            fetchWeather(loc.latitude, loc.longitude, loc.city, loc.country_name);
        })
        .catch((error) => {
            console.log('IP geolocation failed:', error);
            // Set a fallback message
            const w = document.getElementById('weather');
            if (w) {
                w.innerHTML = 'Weather unavailable';
            }
        });
}

// Enhanced weather with loading animation
async function fetchWeather(latitude, longitude, city, country) {
    console.log('Fetching weather for:', latitude, longitude, city, country);
    const w = document.getElementById('weather');
    if (!w) {
        console.error('Weather element not found!');
        return;
    }

    w.innerHTML = '<div class="weather-loading"></div> Loading weather...';

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto`;
    try {
        console.log('Fetching from weather API:', weatherUrl);
        const response = await fetch(weatherUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Weather data received:', data);

        const cw = data.current_weather;
        const daily = data.daily;
        const up = new Date(cw.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        let html = `
      <div class="weather-header">
        <div class="weather-location">${city}${country ? ', ' + country : ''}</div>
        <div class="weather-update">update: ${up}</div>
      
      <div class="weather-main">
        <div class="weather-icon">${getWeatherEmoji(cw.weathercode)}</div>
        <div class="weather-temp-large">${cw.temperature.toFixed(1)}°C</div>
      </div>
      <div class="weather-forecast">`;
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 1; i <= 4; i++) {
            const d = new Date(daily.time[i]);
            const day = weekdays[d.getDay()];
            const icon = getWeatherEmoji(daily.weathercode[i]);
            const min = daily.temperature_2m_min[i].toFixed(1);
            const max = daily.temperature_2m_max[i].toFixed(1);
            html += `
        <div class="forecast-day">
          <div class="forecast-name">${day}</div>
          <div class="forecast-icon">${icon}</div>
          <div class="forecast-range">${min}-${max}°</div>
        </div>`;
        }
        html += `</div>`;
        w.innerHTML = html;
        console.log('Weather updated successfully');
    } catch (error) {
        console.error('Weather fetch failed:', error);
        w.innerHTML = 'Weather unavailable';
    }
}

// Hide weather widget if it overlaps the clock or greeting
function checkWeatherOverlap() {
    const weather = document.getElementById('weather');
    const clock = document.getElementById('clock');
    const greeting = document.getElementById('greeting');
    if (!weather || !clock || !greeting) return;
    // Hide on narrow viewports
    if (window.innerWidth < 1000) {
        weather.style.display = 'none';
        return;
    }
    const wRect = weather.getBoundingClientRect();
    const cRect = clock.getBoundingClientRect();
    const gRect = greeting.getBoundingClientRect();
    const overlapClock = !(wRect.right < cRect.left ||
        wRect.left > cRect.right ||
        wRect.bottom < cRect.top ||
        wRect.top > cRect.bottom);
    const overlapGreeting = !(wRect.right < gRect.left ||
        wRect.left > gRect.right ||
        wRect.bottom < gRect.top ||
        wRect.top > gRect.bottom);
    const overlap = overlapClock || overlapGreeting;
    weather.style.display = overlap ? 'none' : '';
}

window.addEventListener('load', checkWeatherOverlap);
window.addEventListener('resize', checkWeatherOverlap);