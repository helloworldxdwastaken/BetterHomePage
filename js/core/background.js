// Background preloader system
export class BackgroundPreloader {
    constructor() {
        this.loadQueue = [];
        this.preloadedImages = new Map();
        this.currentBackground = null;
        this.isLoading = false;
        this.isLocked = false;
        this.STORAGE_KEY = 'lockedWallpaper';
        this.PRELOAD_COUNT = 5;
        
        // Check if wallpaper is locked
        const locked = localStorage.getItem(this.STORAGE_KEY);
        if (locked) {
            this.isLocked = true;
            this.currentBackground = locked;
        }
    }

    // Lock/unlock current wallpaper
    toggleLock() {
        if (this.isLocked) {
            this.isLocked = false;
            localStorage.removeItem(this.STORAGE_KEY);
            return false;
        } else {
            this.isLocked = true;
            localStorage.setItem(this.STORAGE_KEY, this.currentBackground);
            return true;
        }
    }

    // Check if wallpaper is locked
    isWallpaperLocked() {
        return this.isLocked;
    }

    // Preload image with promise
    preloadImage(url) {
        return new Promise((resolve, reject) => {
            // Check if already preloaded
            if (this.preloadedImages.has(url)) {
                resolve(this.preloadedImages.get(url));
                return;
            }

            const img = new Image();
            img.onload = () => {
                this.preloadedImages.set(url, img);
                resolve(img);
            };
            img.onerror = () => {
                console.warn(`Failed to preload image: ${url}`);
                reject(new Error(`Failed to load ${url}`));
            };
            img.src = url;
        });
    }

    // Preload multiple images
    async preloadImages(urls) {
        const promises = urls.map(url => this.preloadImage(url).catch(() => null));
        return Promise.allSettled(promises);
    }

    // Set background with smooth transition (no loader)
    async setBackground(url, skipLockCheck = false) {
        // If wallpaper is locked and we're not forcing, use locked wallpaper
        if (this.isLocked && !skipLockCheck) {
            url = localStorage.getItem(this.STORAGE_KEY) || url;
        }
        
        if (this.isLoading) return false;
        this.isLoading = true;

        try {
            // Preload the image first
            await this.preloadImage(url);
            
            // Apply background smoothly
            document.body.style.backgroundImage = `url('${url}')`;
            this.currentBackground = url;
            
            // Hide preloader immediately (no fade animation)
            const preloader = document.getElementById('bgPreloader');
            if (preloader) {
                preloader.style.display = 'none';
            }

            // Mark body as loaded
            document.body.classList.add('bg-loaded');
            console.log(`Background loaded successfully: ${url}`);
            return true;
        } catch (error) {
            console.warn(`Background load failed: ${error.message}`);
            return false;
        } finally {
            this.isLoading = false;
        }
    }

    // Preload next wallpapers for faster switching
    async preloadNextWallpapers() {
        const isOnline = navigator.onLine;
        if (isOnline) {
            // Preload multiple Unsplash alternatives
            const unsplashUrls = [];
            for (let i = 0; i < this.PRELOAD_COUNT; i++) {
                unsplashUrls.push(
                    `https://source.unsplash.com/1920x1080/?nature,landscape&t=${Date.now() + i}`,
                    `https://source.unsplash.com/1920x1080/?mountains,nature&t=${Date.now() + i + 1000}`,
                    `https://source.unsplash.com/1920x1080/?abstract,minimal&t=${Date.now() + i + 2000}`,
                    `https://source.unsplash.com/1920x1080/?space,galaxy&t=${Date.now() + i + 3000}`,
                    `https://source.unsplash.com/1920x1080/?ocean,water&t=${Date.now() + i + 4000}`
                );
            }
            
            this.preloadImages(unsplashUrls);
        } else {
            // Preload all local wallpapers
            const localWallpapers = Array.from({ length: 8 }, (_, i) => `wallpaper/bg${i + 1}.webp`);
            this.preloadImages(localWallpapers);
        }
    }

    // Get a preloaded background or fallback
    getPreloadedBackground() {
        if (this.preloadedImages.size > 0) {
            const urls = Array.from(this.preloadedImages.keys());
            return urls[Math.floor(Math.random() * urls.length)];
        }
        return null;
    }

    // Get next preloaded wallpaper
    async getNextWallpaper() {
        const preloaded = this.getPreloadedBackground();
        if (preloaded) {
            // Remove used wallpaper from cache to get fresh ones
            this.preloadedImages.delete(preloaded);
            // Preload more in background
            setTimeout(() => this.preloadNextWallpapers(), 1000);
            return preloaded;
        }
        return null;
    }
}
