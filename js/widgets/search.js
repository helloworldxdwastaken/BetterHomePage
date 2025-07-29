import { STORAGE_KEYS } from '../core/storage.js';

// Enhanced search functionality
const engines = {
    google: { action: 'https://www.google.com/search', icon: 'https://www.google.com/favicon.ico', name: 'Google' },
    duckduckgo: { action: 'https://duckduckgo.com/', icon: 'https://duckduckgo.com/favicon.ico', name: 'DuckDuckGo' },
    brave: { action: 'https://search.brave.com/search', icon: 'https://brave.com/static-assets/images/brave-favicon.png', name: 'Brave' }
};

// Search history management
let searchHistory = JSON.parse(localStorage.getItem(STORAGE_KEYS.searchHistory) || '[]');

function saveToSearchHistory(query) {
    if (!searchHistory.includes(query)) {
        searchHistory.unshift(query);
        searchHistory = searchHistory.slice(0, 10);
        localStorage.setItem(STORAGE_KEYS.searchHistory, JSON.stringify(searchHistory));
    }
}

function showSuggestions(query) {
    const suggestions = [];
    const suggestionsEl = document.getElementById('searchSuggestions');

    // Add relevant search history
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
        { text: 'weather forecast', icon: 'cloud' },
        { text: 'news today', icon: 'newspaper' },
        { text: 'translate', icon: 'languages' },
        { text: 'calculator', icon: 'calculator' },
        { text: 'maps', icon: 'map' }
    ].filter(item => 
        item.text.toLowerCase().includes(query.toLowerCase()) &&
        !suggestions.some(s => s.text === item.text)
    );

    suggestions.push(...commonSearches.slice(0, 3));

    if (suggestions.length > 0) {
        suggestionsEl.innerHTML = suggestions.map(suggestion => `
            <div class="suggestion-item" onclick="selectSuggestion('${suggestion.text.replace(/'/g, "\\'")}')">
                <i data-lucide="${suggestion.icon}" class="icon"></i>
                <div class="text">${suggestion.text}</div>
                <div class="type">${suggestion.type || 'Suggestion'}</div>
            </div>
        `).join('');
        suggestionsEl.classList.add('show');
        if (window.lucide) lucide.createIcons();
    } else {
        hideSuggestions();
    }
}

function hideSuggestions() {
    const suggestionsEl = document.getElementById('searchSuggestions');
    suggestionsEl.classList.remove('show');
    setTimeout(() => {
        suggestionsEl.innerHTML = '';
    }, 300);
}

window.selectSuggestion = function(text) {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = text;
    searchInput.form.submit();
}

export function initializeSearchEngine() {
    const currentIcon = document.getElementById('currentEngineIcon');
    const engineSelect = document.getElementById('engineSelect');
    const form = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');

    // Engine switcher with enhanced animations
    currentIcon.addEventListener('click', (e) => {
        e.stopPropagation();
        engineSelect.classList.toggle('show');
    });

    // Close engine selector when clicking outside
    document.addEventListener('click', () => {
        engineSelect.classList.remove('show');
    });

    engineSelect.addEventListener('click', (e) => {
        e.stopPropagation();
    });

    engineSelect.querySelectorAll('.engine-icon').forEach(icon => {
        icon.addEventListener('click', () => {
            const engineKey = icon.dataset.action;
            const engine = engines[engineKey];
            
            // Add selection animation
            currentIcon.style.transform = 'scale(0.8) rotate(180deg)';
            
            setTimeout(() => {
                form.action = engine.action;
                currentIcon.src = engine.icon;
                searchInput.placeholder = `Search with ${engine.name}`;
                currentIcon.style.transform = 'scale(1) rotate(0deg)';
            }, 200);
            
            engineSelect.classList.remove('show');
        });
    });

    // Set initial placeholder
    searchInput.placeholder = "Search with Google";

    // Search focus effects
    searchInput.addEventListener('focus', () => {
        document.body.classList.add('search-focused');
        document.querySelector('.search-bar').classList.add('focused');
        if (searchInput.value.trim()) {
            showSuggestions(searchInput.value.trim());
        }
    });

    searchInput.addEventListener('blur', (e) => {
        // Delay to allow suggestion clicks
        setTimeout(() => {
            document.body.classList.remove('search-focused');
            document.querySelector('.search-bar').classList.remove('focused');
            hideSuggestions();
        }, 150);
    });

    // Search suggestions
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query.length > 1) {
            showSuggestions(query);
        } else {
            hideSuggestions();
        }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
        const query = searchInput.value.trim();
        if (query) {
            saveToSearchHistory(query);
        }
    });
}