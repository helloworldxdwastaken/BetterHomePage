import { STORAGE_KEYS, refreshIcons } from '../core/storage.js';

const MAX_BOOKMARKS = 12;

// Enhanced bookmark management
function loadBookmarks() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.bookmarks);
        if (!raw) return getDefaultBookmarks();
        const data = JSON.parse(raw);
        return Array.isArray(data) ? data : getDefaultBookmarks();
    } catch (e) {
        console.warn('Bookmark parse failed, using defaults.', e);
        return getDefaultBookmarks();
    }
}

function getDefaultBookmarks() {
    return [
        { name: "YouTube", url: "https://youtube.com", icon: "https://youtube.com/favicon.ico" },
        { name: "GitHub", url: "https://github.com", icon: "https://github.com/favicon.ico" },
        { name: "Reddit", url: "https://reddit.com", icon: "https://reddit.com/favicon.ico" },
        { name: "Twitter", url: "https://twitter.com", icon: "https://twitter.com/favicon.ico" },
        { name: "Gmail", url: "https://mail.google.com", icon: "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico" },
        { name: "Netflix", url: "https://netflix.com", icon: "https://netflix.com/favicon.ico" }
    ];
}

function saveBookmarks(list) {
    try {
        localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(list.slice(0, MAX_BOOKMARKS)));
    } catch (e) {
        console.warn('Bookmark save failed:', e);
    }
}

// Make function available globally for inline onclick
window.addBookmarkPrompt = function() {
    const input = prompt("Enter website URL (e.g., facebook.com):", "");
    if (!input) return;
    
    const url = input.startsWith("http://") || input.startsWith("https://") 
        ? input 
        : `https://${input}`;

    let hostname;
    try {
        hostname = new URL(url).hostname.replace("www.", "");
    } catch {
        alert("Please enter a valid URL");
        return;
    }

    const name = prompt("Enter display name (optional):", "") || 
                   hostname.charAt(0).toUpperCase() + hostname.slice(1);

    const newBookmark = {
        url,
        name,
        icon: `${new URL(url).origin}/favicon.ico`
    };

    const bookmarks = loadBookmarks();
    bookmarks.push(newBookmark);
    if (bookmarks.length > MAX_BOOKMARKS) {
        bookmarks.splice(0, bookmarks.length - MAX_BOOKMARKS);
    }
    
    saveBookmarks(bookmarks);
    renderBookmarks();
}

export async function renderBookmarks() {
    let bookmarks = loadBookmarks();
    const container = document.getElementById('bookmarks');
    container.innerHTML = "";

    // Icon mapping for fallbacks
    const iconMap = {
        'github.com': 'github',
        'mail.google.com': 'mail',
        'youtube.com': 'youtube',
        'reddit.com': 'message-square',
        'twitter.com': 'twitter',
        'facebook.com': 'facebook',
        'instagram.com': 'instagram',
        'linkedin.com': 'linkedin',
        'netflix.com': 'play',
        'spotify.com': 'music',
        'discord.com': 'message-circle',
        'twitch.tv': 'tv',
        'amazon.com': 'shopping-cart',
        'drive.google.com': 'folder'
    };

    for (let i = 0; i < Math.min(bookmarks.length, MAX_BOOKMARKS); i++) {
        const bookmark = bookmarks[i];
        const url = new URL(bookmark.url);
        const hostname = url.hostname.replace('www.', '');
        
        const bookmarkEl = document.createElement('a');
        bookmarkEl.href = bookmark.url;
        bookmarkEl.className = 'bookmark';
        bookmarkEl.target = '_self';
        bookmarkEl.style.opacity = '0';
        bookmarkEl.style.transform = 'translateY(20px)';
        bookmarkEl.style.animation = `fadeInUp 0.5s ease forwards`;
        bookmarkEl.style.animationDelay = `${i * 0.1}s`;
        
        // Create icon element
        const iconEl = document.createElement('img');
        iconEl.className = 'bookmark-icon';
        iconEl.alt = bookmark.name;
        iconEl.src = bookmark.icon;
        
        // Fallback to lucide icon if favicon fails
        iconEl.onerror = function() {
            this.onerror = null;
            const fallbackIcon = iconMap[hostname] || 'globe';
            const iconContainer = document.createElement('div');
            iconContainer.className = 'bookmark-icon';
            iconContainer.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255,255,255,0.1);
            `;
            iconContainer.innerHTML = `<i data-lucide="${fallbackIcon}" style="width: 20px; height: 20px;"></i>`;
            this.parentNode.replaceChild(iconContainer, this);
            refreshIcons();
        };

        const nameEl = document.createElement('span');
        nameEl.className = 'bookmark-name';
        nameEl.textContent = bookmark.name;

        bookmarkEl.appendChild(iconEl);
        bookmarkEl.appendChild(nameEl);

        // Enhanced interactions
        bookmarkEl.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = bookmark.url;
        });

        bookmarkEl.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const action = confirm(`Edit "${bookmark.name}"?\nOK = Edit, Cancel = Delete`);
            
            if (action) {
                // Edit
                const newUrl = prompt("Edit URL:", bookmark.url);
                const newName = prompt("Edit Name:", bookmark.name);
                
                if (newUrl && newName !== null) {
                    try {
                        const updatedUrl = newUrl.startsWith("http") ? newUrl : "https://" + newUrl;
                        bookmarks[i] = {
                            url: updatedUrl,
                            name: newName || new URL(updatedUrl).hostname.replace("www.", ""),
                            icon: `${new URL(updatedUrl).origin}/favicon.ico`
                        };
                        saveBookmarks(bookmarks);
                        renderBookmarks();
                    } catch {
                        alert("Please enter a valid URL");
                    }
                }
            } else {
                // Delete
                if (confirm(`Delete "${bookmark.name}"?`)) {
                    bookmarks.splice(i, 1);
                    saveBookmarks(bookmarks);
                    renderBookmarks();
                }
            }
        });

        // Drag and drop for reordering
        bookmarkEl.draggable = true;
        bookmarkEl.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', i.toString());
            bookmarkEl.style.opacity = '0.5';
        });

        bookmarkEl.addEventListener('dragend', () => {
            bookmarkEl.style.opacity = '1';
        });

        bookmarkEl.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        bookmarkEl.addEventListener('drop', (e) => {
            e.preventDefault();
            const fromIndex = parseInt(e.dataTransfer.getData('text/plain'), 10);
            const toIndex = i;
            
            if (fromIndex !== toIndex) {
                const [movedBookmark] = bookmarks.splice(fromIndex, 1);
                bookmarks.splice(toIndex, 0, movedBookmark);
                saveBookmarks(bookmarks);
                renderBookmarks();
            }
        });

        container.appendChild(bookmarkEl);
    }

    // Add bookmark button
    if (bookmarks.length < MAX_BOOKMARKS) {
        const addButton = document.createElement('div');
        addButton.className = 'bookmark-add';
        addButton.innerHTML = '+';
        addButton.title = 'Add bookmark';
        addButton.style.opacity = '0';
        addButton.style.transform = 'translateY(20px)';
        addButton.style.animation = `fadeInUp 0.5s ease forwards`;
        addButton.style.animationDelay = `${bookmarks.length * 0.1}s`;
        addButton.addEventListener('click', window.addBookmarkPrompt);
        container.appendChild(addButton);
    }

    refreshIcons();
}