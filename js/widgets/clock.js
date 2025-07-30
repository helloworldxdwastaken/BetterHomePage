// Enhanced clock with ticker animations
import { loadSettings } from '../core/storage.js';

let previousTime = '';

export function updateClock() {
    const now = new Date();
    const settings = loadSettings();
    let hours = now.getHours();
    let timeString;
    
    if (settings.timeFormat === '24') {
        // 24-hour format
        timeString = `${hours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    } else {
        // 12-hour format
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        timeString = `${hours}:${now.getMinutes().toString().padStart(2, '0')} ${ampm}`;
    }

    const clockElement = document.getElementById('clock');

    if (clockElement.textContent !== timeString && previousTime !== '') {
        // Create ticker effect for changing digits
        const newTimeArray = timeString.split('');
        const oldTimeArray = previousTime.split('');
        
        clockElement.innerHTML = newTimeArray.map((char, index) => {
            const isDigit = /\d/.test(char);
            const hasChanged = char !== oldTimeArray[index];
            const isColon = char === ':';
            
            let className = isDigit ? 'digit' : (isColon ? 'colon' : '');
            
            if (isDigit && hasChanged) {
                className += ' flip-animation';
                // Add random tick direction for visual interest
                if (Math.random() > 0.5) {
                    className += ' tick-up';
                } else {
                    className += ' tick-down';
                }
            }
            
            return `<span class="${className}">${char}</span>`;
        }).join('');
        
        clockElement.classList.remove('loading');
    } else if (previousTime === '') {
        // Initial load
        clockElement.innerHTML = timeString.split('').map(char => {
            const isDigit = /\d/.test(char);
            const isColon = char === ':';
            const className = isDigit ? 'digit' : (isColon ? 'colon' : '');
            return `<span class="${className}">${char}</span>`;
        }).join('');
        clockElement.classList.remove('loading');
    }

    previousTime = timeString;

    // Clean up animation classes after animation completes
    setTimeout(() => {
        clockElement.querySelectorAll('.digit').forEach(digit => {
            digit.classList.remove('flip-animation', 'tick-up', 'tick-down');
        });
    }, 800);
}

export function initClock() {
    updateClock();
    setInterval(updateClock, 1000);
}