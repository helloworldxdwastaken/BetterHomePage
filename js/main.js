// Import core modules
import { isOnline } from './core/storage.js';
import { BackgroundPreloader } from './core/background.js';

// Import widget modules
import { updateGreeting, displayQuote } from './widgets/greeting.js';
import { initClock } from './widgets/clock.js';
import { initWeather } from './widgets/weather.js';
import { initializeSearchEngine } from './widgets/search.js';
import { renderBookmarks } from './widgets/bookmarks.js';
import { pickLocalWallpaper, pickUnsplashWallpaper } from './widgets/wallpaper.js';
import { initSettings } from './widgets/settings.js';
import { initOnboarding } from './widgets/onboarding.js';

// Initialize background preloader
const bgPreloader = new BackgroundPreloader();

// Keyboard shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Focus search with '/' or 'Ctrl+K'
        if ((e.key === '/' || (e.ctrlKey && e.key === 'k')) && 
            !e.target.matches('input, textarea')) {
            e.preventDefault();
            document.getElementById('searchInput').focus();
        }
        
        // Add bookmark with 'Ctrl+B'
        if (e.ctrlKey && e.key === 'b' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            if (window.addBookmarkPrompt) window.addBookmarkPrompt();
        }
        
        // Open settings with 'Ctrl+,'
        if (e.ctrlKey && e.key === ',' && !e.target.matches('input, textarea')) {
            e.preventDefault();
            document.getElementById('settingsOverlay').classList.add('show');
            if (window.lucide) lucide.createIcons();
        }
    });
}

// Page transition
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Initialize wallpaper lock button
function initWallpaperLock() {
    const lockBtn = document.getElementById('wallpaperLockBtn');
    const lockIcon = document.getElementById('lockIcon');
    const unlockIcon = document.getElementById('unlockIcon');
    
    if (!lockBtn) return;
    
    // Set initial state
    updateLockButton();
    
    // Handle click
    lockBtn.addEventListener('click', () => {
        const isLocked = bgPreloader.toggleLock();
        updateLockButton();
        
        // Show visual feedback
        lockBtn.style.transform = 'scale(1.2) rotate(180deg)';
        setTimeout(() => {
            lockBtn.style.transform = '';
        }, 300);
    });
    
    function updateLockButton() {
        const isLocked = bgPreloader.isWallpaperLocked();
        if (isLocked) {
            lockBtn.classList.add('locked');
            lockIcon.style.display = 'block';
            unlockIcon.style.display = 'none';
            lockBtn.title = 'Unlock Wallpaper';
        } else {
            lockBtn.classList.remove('locked');
            lockIcon.style.display = 'none';
            unlockIcon.style.display = 'block';
            lockBtn.title = 'Lock Current Wallpaper';
        }
        if (window.lucide) lucide.createIcons();
    }
}

// Initialize everything
async function init() {
    // Start background preloading immediately
    bgPreloader.preloadNextWallpapers();
    
    // Initialize settings first
    initSettings();
    
    // Initialize UI components
    updateGreeting();
    displayQuote();
    initClock();
    initializeSearchEngine();
    renderBookmarks();
    initWeather();
    initKeyboardShortcuts();
    initOnboarding();
    initWallpaperLock();
    
    // Choose and set wallpaper with preloading
    if (isOnline) {
        await pickUnsplashWallpaper(bgPreloader);
    } else {
        await pickLocalWallpaper(bgPreloader);
    }
    
    // Update greeting every minute
    setInterval(updateGreeting, 60000);
    
    // Make functions available globally for inline events
    window.updateGreeting = updateGreeting;
    window.renderBookmarks = renderBookmarks;
}

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
