import { STORAGE_KEYS } from '../core/storage.js';

// Enhanced greeting with smooth transitions
export function updateGreeting() {
    const userName = localStorage.getItem(STORAGE_KEYS.username) || 'Friend';
    const hour = new Date().getHours();
    let greeting = "Hello";
    let iconHtml = '<i data-lucide="hand-wave" style="display: inline; width: 1.2em; height: 1.2em; margin-left: 0.3em;"></i>';

    if (hour >= 5 && hour < 12) {
        greeting = "Good Morning";
        iconHtml = '<i data-lucide="sunrise" style="display: inline; width: 1.2em; height: 1.2em; margin-left: 0.3em;"></i>';
    } else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
        iconHtml = '<i data-lucide="sun" style="display: inline; width: 1.2em; height: 1.2em; margin-left: 0.3em;"></i>';
    } else if (hour >= 17 && hour < 22) {
        greeting = "Good Evening";
        iconHtml = '<i data-lucide="sunset" style="display: inline; width: 1.2em; height: 1.2em; margin-left: 0.3em;"></i>';
    } else {
        greeting = "Good Night";
        iconHtml = '<i data-lucide="moon" style="display: inline; width: 1.2em; height: 1.2em; margin-left: 0.3em;"></i>';
    }

    const greetingEl = document.getElementById("greeting");
    
    // Add updating animation
    greetingEl.classList.add('updating');
    
    setTimeout(() => {
        // Create the greeting with Lucide icon instead of emoji
        greetingEl.innerHTML = `${greeting}, <span id="username"></span>${iconHtml}`;
        
        // Set the username text separately to avoid any rendering issues
        const usernameEl = greetingEl.querySelector('#username');
        if (usernameEl) {
            usernameEl.textContent = userName;
        }
        
        greetingEl.classList.remove('loading', 'updating');
        
        // Refresh icons to make sure Lucide renders the new icon
        if (window.lucide) lucide.createIcons();
    }, 300);

    // Enhanced username interaction
    setTimeout(() => {
        const nameSpan = document.getElementById("username");
        if (nameSpan) {
            nameSpan.addEventListener("click", () => {
                const newName = prompt("What should I call you?", userName);
                if (newName && newName.trim()) {
                    localStorage.setItem(STORAGE_KEYS.username, newName.trim());
                    updateGreeting();
                }
            });
        }
    }, 400);
}

// Enhanced quotes with categories and animations
const quotes = [
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Your limitation—it's only your imagination.",
    "Push yourself, because no one else is going to do it for you.",
    "Great things never come from comfort zones.",
    "Dream it. Wish it. Do it.",
    "Success doesn't just find you. You have to go out and get it.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Don't stop when you're tired. Stop when you're done.",
    "Wake up with determination. Go to bed with satisfaction.",
    "Do something today that your future self will thank you for.",
    "Little things make big days.",
    "It's going to be hard, but hard does not mean impossible.",
    "Don't wait for opportunity. Create it.",
    "Sometimes we're tested not to show our weaknesses, but to discover our strengths.",
    "The key to success is to focus on goals, not obstacles.",
    "Dream bigger. Do bigger.",
    "Don't be afraid to give up the good to go for the great.",
    "The difference between ordinary and extraordinary is that little extra.",
    "Challenges are what make life interesting and overcoming them is what makes life meaningful.",
    "If you want to achieve excellence, you can get there today. As of this second, quit doing less-than-excellent work."
];

export function displayQuote() {
    const quote = quotes[Math.floor(Math.random() * quotes.length)];
    const quoteEl = document.getElementById('quote');
    
    // Add updating animation
    quoteEl.classList.add('updating');
    
    setTimeout(() => {
        quoteEl.textContent = `"${quote}"`;
        quoteEl.classList.remove('loading', 'updating');
    }, 300);
}
