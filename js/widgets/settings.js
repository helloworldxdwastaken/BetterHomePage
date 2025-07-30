import { loadSettings, saveSettings, applySettings, STORAGE_KEYS, refreshIcons } from '../core/storage.js';

// Import/Export functionality
function initImportExport() {
    const exportBtn = document.getElementById('exportDataBtn');
    const importInput = document.getElementById('importFileInput');

    exportBtn.addEventListener('click', () => {
        const data = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            settings: loadSettings(),
            bookmarks: JSON.parse(localStorage.getItem(STORAGE_KEYS.bookmarks) || '[]'),
            username: localStorage.getItem(STORAGE_KEYS.username),
            searchHistory: localStorage.getItem(STORAGE_KEYS.searchHistory)
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `betterhome-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);

        // Show success message
        const originalText = exportBtn.innerHTML;
        exportBtn.innerHTML = '<i data-lucide="check"></i> Exported!';
        exportBtn.style.background = 'rgba(16, 185, 129, 0.2)';
        exportBtn.style.borderColor = 'rgba(16, 185, 129, 0.3)';
        
        setTimeout(() => {
            exportBtn.innerHTML = originalText;
            exportBtn.style.background = '';
            exportBtn.style.borderColor = '';
            refreshIcons();
        }, 2000);
    });

    importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                if (confirm('This will overwrite your current settings. Continue?')) {
                    // Import settings
                    if (data.settings) {
                        saveSettings(data.settings);
                        applySettings(data.settings);
                        
                        // Update settings UI
                        const fontSelect = document.getElementById('fontSelect');
                        const weatherToggle = document.getElementById('weatherToggle');
                        const quoteToggle = document.getElementById('quoteToggle');

                        if (fontSelect) fontSelect.value = data.settings.fontFamily || 'Inter';
                        if (weatherToggle) weatherToggle.checked = data.settings.weatherEnabled !== false;
                        if (quoteToggle) quoteToggle.checked = data.settings.quoteEnabled !== false;
                    }

                    // Import other data
                    if (data.bookmarks) {
                        localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(data.bookmarks));
                        // Trigger bookmarks re-render
                        if (window.renderBookmarks) window.renderBookmarks();
                    }
                    if (data.username) {
                        localStorage.setItem(STORAGE_KEYS.username, data.username);
                        // Trigger greeting update
                        if (window.updateGreeting) window.updateGreeting();
                    }
                    if (data.searchHistory) {
                        localStorage.setItem(STORAGE_KEYS.searchHistory, data.searchHistory);
                    }

                    alert('Settings imported successfully!');
                }
            } catch (error) {
                alert('Error importing settings: ' + error.message);
            }
        };
        reader.readAsText(file);
    });
}

// Initialize settings panel
export function initSettings() {
    const settings = loadSettings();
    applySettings(settings);
    
    const settingsBtn = document.getElementById('settingsBtn');
    const settingsOverlay = document.getElementById('settingsOverlay');
    const settingsClose = document.getElementById('settingsClose');
    const fontSelect = document.getElementById('fontSelect');
    const weatherToggle = document.getElementById('weatherToggle');
    const quoteToggle = document.getElementById('quoteToggle');
    const tempUnitSelect = document.getElementById('tempUnitSelect');
    const timeFormatSelect = document.getElementById('timeFormatSelect');
    const clearDataBtn = document.getElementById('clearDataBtn');
    const showOnboardingBtn = document.getElementById('showOnboardingBtn');

    // Set current values
    if (fontSelect) fontSelect.value = settings.fontFamily;
    if (weatherToggle) weatherToggle.checked = settings.weatherEnabled;
    if (quoteToggle) quoteToggle.checked = settings.quoteEnabled;
    if (tempUnitSelect) tempUnitSelect.value = settings.temperatureUnit || 'C';
    if (timeFormatSelect) timeFormatSelect.value = settings.timeFormat || '12';

    // Initialize tabs
    initSettingsTabs();

    // Open settings with animation
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            settingsOverlay.classList.add('show');
            refreshIcons();
        });
    }

    // Close settings
    function closeSettings() {
        settingsOverlay.classList.remove('show');
    }

    if (settingsClose) settingsClose.addEventListener('click', closeSettings);
    if (settingsOverlay) {
        settingsOverlay.addEventListener('click', (e) => {
            if (e.target === settingsOverlay) closeSettings();
        });
    }

    // Font change with animation
    if (fontSelect) {
        fontSelect.addEventListener('change', () => {
            const newSettings = { ...loadSettings(), fontFamily: fontSelect.value };
            saveSettings(newSettings);
            applySettings(newSettings);
        });
    }

    // Time format change
    if (timeFormatSelect) {
        timeFormatSelect.addEventListener('change', () => {
            const newSettings = { ...loadSettings(), timeFormat: timeFormatSelect.value };
            saveSettings(newSettings);
            // Clock will update on next tick
        });
    }

    // Temperature unit change
    if (tempUnitSelect) {
        tempUnitSelect.addEventListener('change', () => {
            const newSettings = { ...loadSettings(), temperatureUnit: tempUnitSelect.value };
            saveSettings(newSettings);
            // Refresh weather widget to show new units
            if (window.initWeather) {
                window.initWeather();
            }
        });
    }

    // Widget toggles
    function createToggleHandler(toggle, settingKey) {
        if (toggle) {
            toggle.addEventListener('change', () => {
                const newSettings = { ...loadSettings(), [settingKey]: toggle.checked };
                saveSettings(newSettings);
                applySettings(newSettings);
            });
        }
    }

    createToggleHandler(weatherToggle, 'weatherEnabled');
    createToggleHandler(quoteToggle, 'quoteEnabled');

    // Show onboarding button
    if (showOnboardingBtn) {
        showOnboardingBtn.addEventListener('click', () => {
            closeSettings();
            // Show onboarding overlay using the global function
            if (window.showOnboardingOverlay) {
                window.showOnboardingOverlay();
            }
        });
    }
    
    // Clear data
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
                Object.values(STORAGE_KEYS).forEach(key => {
                    localStorage.removeItem(key);
                });
                location.reload();
            }
        });
    }

    // Donation link
    const donateLink = document.querySelector('.setting-btn.donate');
    if (donateLink) {
        donateLink.addEventListener('click', (e) => {
            e.stopPropagation();
            refreshIcons();
        });
    }

    // ESC key to close settings
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && settingsOverlay.classList.contains('show')) {
            closeSettings();
        }
    });

    // Initialize import/export
    initImportExport();
}

// Initialize settings tabs
function initSettingsTabs() {
    const tabs = document.querySelectorAll('.settings-tab');
    const contents = document.querySelectorAll('.settings-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active states
            tabs.forEach(t => t.classList.remove('active'));
            contents.forEach(c => c.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });
}
