# BetterHome - Modular Homepage

A beautiful, customizable homepage with a modular architecture that makes it easy to add new widgets and features.

![Preview](preview.png)

## 🎨 Features

- **Beautiful Design**: Glassmorphic UI with smooth animations
- **Dynamic Wallpapers**: Unsplash integration with local fallbacks
- **Weather Widget**: Real-time weather with 3-day forecast
- **Customizable Bookmarks**: Add, edit, delete, and reorder
- **Search Bar**: Multiple search engines (Google, DuckDuckGo, Brave)
- **Settings Panel**: Customize fonts, toggle widgets, import/export data
- **Onboarding**: Easy setup instructions for all major browsers
- **Responsive**: Works on all devices

## 📁 File Structure

```
BetterHomePage-main/
├── index.html              # Main HTML file
├── manifest.json           # PWA manifest
├── css/                    # Modular CSS files
│   ├── main.css           # Core styles and variables
│   ├── clock.css          # Clock and greeting styles
│   ├── search.css         # Search bar styles
│   ├── bookmarks.css      # Bookmarks grid styles
│   ├── weather.css        # Weather widget styles
│   ├── settings.css       # Settings panel styles
│   └── onboarding.css     # Onboarding overlay styles
├── js/                     # Modular JavaScript
│   ├── main.js            # Main initialization
│   ├── core/              # Core functionality
│   │   ├── storage.js     # Storage and settings management
│   │   └── background.js  # Background preloader system
│   └── widgets/           # Widget modules
│       ├── greeting.js    # Greeting and quotes
│       ├── clock.js       # Clock functionality
│       ├── weather.js     # Weather widget
│       ├── search.js      # Search functionality
│       ├── bookmarks.js   # Bookmarks management
│       ├── wallpaper.js   # Wallpaper system
│       ├── settings.js    # Settings panel
│       └── onboarding.js  # Onboarding overlay
├── icons/                  # App icons
├── wallpaper/             # Local wallpaper images
└── backup/                # Old file backups

```

## 🚀 How to Use

1. **Local Usage**: Simply open `index.html` in your browser
2. **GitHub Pages**: Upload to a repository and enable GitHub Pages
3. **Web Server**: Host on any static web server

## 🧩 Adding New Widgets

The modular structure makes it easy to add new widgets:

1. Create a new widget module in `js/widgets/`
2. Create corresponding CSS in `css/`
3. Import and initialize in `js/main.js`
4. Add HTML structure to `index.html`

### Example Widget Module

```javascript
// js/widgets/mywidget.js
export function initMyWidget() {
    const widget = document.getElementById('myWidget');
    if (!widget) return;
    
    // Widget logic here
}
```

## ⚙️ Customization

### Settings Panel
- Change font family
- Toggle weather widget
- Toggle daily quotes
- Import/export all settings
- Clear all data

### Bookmarks
- Right-click to edit/delete
- Drag to reorder
- Click + to add new

### Search Engines
- Click engine icon to switch
- Supports Google, DuckDuckGo, Brave

## 🔧 Development

The code is organized for easy maintenance:

- **CSS Variables**: Customize colors and animations in `css/main.css`
- **Storage Keys**: All localStorage keys in `js/core/storage.js`
- **Widget Toggle**: Easy to add new toggleable widgets
- **Import/Export**: Backup and restore functionality built-in

## 📱 Browser Support

- Chrome/Edge (Chromium)
- Firefox
- Safari
- Brave
- Opera

## 🌟 Tips

- Press `/` or `Ctrl+K` to focus search
- Press `Ctrl+B` to add bookmark
- Press `Ctrl+,` to open settings
- Press `ESC` to close overlays

## 📄 License

MIT License - feel free to customize and share!
