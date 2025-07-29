'use strict';
/* === Shared helpers / constants (optimization pass) === */
const MAX_BOOKMARKS = 12;

/** Safe JSON parse for bookmarks */
function loadBookmarks() {
    try {
        const raw = localStorage.getItem('customBookmarks');
        if (!raw) return [];
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : [];
    } catch (e) {
        console.warn('Bookmark parse failed, resetting.', e);
        return [];
    }
}

function saveBookmarks(list) {
    try {
        localStorage.setItem('customBookmarks', JSON.stringify(list.slice(0, MAX_BOOKMARKS)));
    } catch (e) {
        console.warn('Bookmark save failed:', e);
    }
}

/** Debounced icon refresh to avoid spamming icon libraries */
let _iconRefreshTimer = null;
function refreshIcons() {
    if (_iconRefreshTimer) return;
    _iconRefreshTimer = requestAnimationFrame(() => {
        _iconRefreshTimer = null;
        try {
            if (window.lucide && typeof lucide.createIcons === 'function') {
                lucide.createIcons();
            }
            if (window.feather && typeof feather.replace === 'function') {
                feather.replace();
            }
        } catch (e) {
            console.warn('Icon init failed:', e);
        }
    });
}

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
    if (bookmarks.length > MAX_BOOKMARKS) {
        bookmarks = bookmarks.slice(0, MAX_BOOKMARKS);
    }
    saveBookmarks(bookmarks);
    renderBookmarks();
}

// Bookmarks (editable)
// Load or seed bookmarks
let bookmarks = loadBookmarks();
if (bookmarks.length === 0) {
    bookmarks = [
        { name: "YouTube Music", url: "https://music.youtube.com/", icon: "https://music.youtube.com/favicon.ico" },
        { name: "Reddit", url: "https://www.reddit.com", icon: "https://www.redditstatic.com/desktop2x/img/favicon/favicon-32x32.png" },
        { name: "GitHub", url: "https://github.com", icon: "https://github.githubassets.com/favicons/favicon.png" },
        { name: "Twitter", url: "https://twitter.com", icon: "https://abs.twimg.com/favicons/twitter.ico" }
    ];
    saveBookmarks(bookmarks);
}

async function renderBookmarks() {
    // Load current bookmarks list
    bookmarks = loadBookmarks();
    const container = document.getElementById('bookmarks');
    container.innerHTML = "";

    const displayBookmarks = bookmarks;

    // Map common sites to Lucide/Feather/Tabler icon names (for fallback)
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

    // Create a grid: 6 top, 6 bottom
    const topRow = document.createElement('div');
    topRow.className = 'bookmark-row top-row';
    const bottomRow = document.createElement('div');
    bottomRow.className = 'bookmark-row bottom-row';

    for (let i = 0; i < displayBookmarks.length; i++) {
        const b = displayBookmarks[i];
        const url = new URL(b.url);
        let name = b.name;
        if (!name) {
            name = url.hostname.replace("www.", "");
            bookmarks[i].name = name;
            localStorage.setItem('customBookmarks', JSON.stringify(bookmarks));
        }
        // Always try favicon first
        let icon = b.icon || `${url.origin}/favicon.ico`;
        if (url.hostname === 'mail.google.com') {
            icon = 'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico';
        }
        let iconHtml = `<img src="${icon}" alt="${name}" class="bookmark-icon">`;
        // Fallback to library icon if favicon fails
        const mapping = iconMap[url.hostname];
        let fallbackIconHtml = '';
        if (mapping && mapping.lucide) {
            fallbackIconHtml = `<i data-lucide="${mapping.lucide}" class="bookmark-icon"></i>`;
        } else if (mapping && mapping.feather) {
            fallbackIconHtml = `<i data-feather="${mapping.feather}" class="bookmark-icon"></i>`;
        } else if (mapping && mapping.tabler) {
            fallbackIconHtml = `<i class="ti ti-${mapping.tabler} bookmark-icon"></i>`;
        } else {
            fallbackIconHtml = `<span class="bookmark-icon" style="display:flex;align-items:center;justify-content:center;font-size:1.5em;">★</span>`;
        }

        const a = document.createElement('a');
        a.href = b.url;
        a.target = "_self";
        a.className = "bookmark";
        a.innerHTML = `${iconHtml}<span class="bookmark-name">${name}</span>`;

        // Fallback to library icon if favicon fails to load
        const img = a.querySelector('img');
        if (img) {
            img.onerror = function () {
                this.onerror = null;
                a.innerHTML = `${fallbackIconHtml}<span class="bookmark-name">${name}</span>`;
                refreshIcons();
            };
        }

        a.addEventListener('click', (e) => {
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
            const [moved] = bookmarks.splice(fromIndex, 1);
            bookmarks.splice(toIndex, 0, moved);
            localStorage.setItem('customBookmarks', JSON.stringify(bookmarks));
            renderBookmarks();
        });

        if (i < 6) {
            topRow.appendChild(a);
        } else {
            bottomRow.appendChild(a);
        }
    }
    container.appendChild(topRow);
    container.appendChild(bottomRow);

    // --- "add bookmark" tile ---
    const addTile = document.createElement('div');
    addTile.className = 'bookmark-add';
    addTile.textContent = '+';
    addTile.title = "Add bookmark";
    addTile.setAttribute('draggable', 'false');
    addTile.addEventListener('click', () => addBookmarkPrompt());
    container.appendChild(addTile);

    // Re-init icon libraries after (re)render
    refreshIcons();
}

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
document.addEventListener('DOMContentLoaded', function () {
    refreshIcons();
    renderBookmarks();
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
        refreshIcons();
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

/* ---------- Weather Widget (Open-Meteo, no API key) ---------- */
(function initWeather(){
    const el = document.getElementById('weather');
    if(!el) return;

    // Show spinner if stylesheet provides the class
    el.innerHTML = '<div class="weather-loading"></div>';

    let usedFallback = false;

    function mapWeatherCode(code){
        if([0].includes(code)) return 'sun';                        // Clear
        if([1,2].includes(code)) return 'cloud-sun';                // Mostly / partly cloudy
        if([3,45,48].includes(code)) return 'cloud-fog';            // Overcast or fog
        if([51,53,55,56,57].includes(code)) return 'cloud-drizzle'; // Drizzle / freezing drizzle
        if([61,63,65].includes(code)) return 'cloud-rain';          // Rain
        if([66,67].includes(code)) return 'cloud-rain-wind';        // Freezing rain
        if([71,73,75,77].includes(code)) return 'cloud-snow';       // Snow
        if([80,81,82].includes(code)) return 'cloud-rain-wind';     // Showers
        if([85,86].includes(code)) return 'cloud-snow';             // Snow showers
        if([95,96,99].includes(code)) return 'cloud-lightning';     // Thunderstorm
        return 'cloud';                                            // Default
    }

    function fetchWeather(lat, lon, label){
        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=3&timezone=auto`)
            .then(r => r.json())
            .then(data => {
                if(!data.current || !data.daily){
                    throw new Error('Incomplete weather data');
                }
                const cur = data.current;
                const daily = data.daily;
                const nowTime = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
                const iconName = mapWeatherCode(cur.weather_code);

                const daysHtml = daily.time.slice(0,3).map((dateStr, i) => {
                    const d = new Date(dateStr + 'T00:00:00');
                    const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
                    const hi = Math.round(daily.temperature_2m_max[i]);
                    const lo = Math.round(daily.temperature_2m_min[i]);
                    const dIcon = mapWeatherCode(daily.weather_code[i]);
                    return `
                        <div class="forecast-day">
                            <div class="forecast-name">${dayName}</div>
                            <i data-lucide="${dIcon}" class="forecast-icon"></i>
                            <div class="forecast-range">${lo}° / ${hi}°</div>
                        </div>
                    `;
                }).join('');

                el.innerHTML = `
                    <div class="weather-header">
                        <div class="weather-location">${label || (usedFallback ? 'Tel Aviv' : 'Local')}</div>
                        <div class="weather-update">${nowTime}</div>
                    </div>
                    <div class="weather-main">
                        <i data-lucide="${iconName}" class="weather-icon"></i>
                        <div class="weather-temp-large">${Math.round(cur.temperature_2m)}°C</div>
                        <div class="weather-wind">Wind ${Math.round(cur.wind_speed_10m)} km/h</div>
                    </div>
                    <div class="weather-forecast">
                        ${daysHtml}
                    </div>
                `;

                refreshIcons();
            })
            .catch(err => {
                console.error('Weather error:', err);
                el.innerHTML = '<div style="text-align:center;font-size:0.75rem;opacity:0.7;">Weather unavailable</div>';
            });
    }

    function geoSuccess(pos){
        const { latitude, longitude } = pos.coords;
        fetchWeather(latitude, longitude, 'Local');
    }

    function geoError(){
        usedFallback = true;
        fetchWeather(32.0853, 34.7818, 'Tel Aviv'); // Tel Aviv fallback
    }

    if(navigator.geolocation){
        let resolved = false;
        const failTimer = setTimeout(()=>{
            if(!resolved){
                resolved = true;
                geoError();
            }
        }, 8000);

        navigator.geolocation.getCurrentPosition(
            pos => { if(!resolved){ resolved = true; clearTimeout(failTimer); geoSuccess(pos);} },
            () => { if(!resolved){ resolved = true; clearTimeout(failTimer); geoError(); } },
            { enableHighAccuracy:false, timeout:7000, maximumAge: 600000 }
        );
    } else {
        geoError();
    }
})();