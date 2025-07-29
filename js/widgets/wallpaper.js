import { STORAGE_KEYS } from '../core/storage.js';
import { isOnline } from '../core/storage.js';

// Enhanced wallpaper system with preloading
const localWallpapers = Array.from({ length: 8 }, (_, i) => `wallpaper/bg${i + 1}.webp`);

export async function pickLocalWallpaper(bgPreloader) {
    // If wallpaper is locked, just set it
    if (bgPreloader.isWallpaperLocked()) {
        const locked = localStorage.getItem('lockedWallpaper');
        if (locked) {
            await bgPreloader.setBackground(locked, true);
            return;
        }
    }
    
    let idx = Number(localStorage.getItem(STORAGE_KEYS.wallpaperIndex) || 0);
    const wallpaperUrl = localWallpapers[idx];
    
    const success = await bgPreloader.setBackground(wallpaperUrl);
    if (success) {
        localStorage.setItem(STORAGE_KEYS.wallpaperIndex, (idx + 1) % localWallpapers.length);
    } else {
        // Try fallback gradient
        document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        console.warn(`Failed to load wallpaper: ${wallpaperUrl}, using fallback`);
    }
}

// Enhanced Unsplash wallpaper with preloading
export async function pickUnsplashWallpaper(bgPreloader) {
    // If wallpaper is locked, just set it
    if (bgPreloader.isWallpaperLocked()) {
        const locked = localStorage.getItem('lockedWallpaper');
        if (locked) {
            await bgPreloader.setBackground(locked, true);
            return;
        }
    }
    
    // Try to use a preloaded wallpaper first
    const preloaded = await bgPreloader.getNextWallpaper();
    if (preloaded) {
        const success = await bgPreloader.setBackground(preloaded);
        if (success) return;
    }
    
    // If no preloaded wallpaper, get a fresh one
    const unsplashUrls = [
        // Nature & Landscapes
        'https://source.unsplash.com/1920x1080/?nature,landscape',
        'https://source.unsplash.com/1920x1080/?mountains,nature',
        'https://source.unsplash.com/1920x1080/?forest,trees',
        'https://source.unsplash.com/1920x1080/?ocean,water',
        'https://source.unsplash.com/1920x1080/?sky,clouds',
        'https://source.unsplash.com/1920x1080/?sunset,sunrise',
        'https://source.unsplash.com/1920x1080/?beach,tropical',
        'https://source.unsplash.com/1920x1080/?desert,sand',
        
        // Abstract & Minimal
        'https://source.unsplash.com/1920x1080/?abstract,minimal',
        'https://source.unsplash.com/1920x1080/?gradient,colorful',
        'https://source.unsplash.com/1920x1080/?geometric,pattern',
        'https://source.unsplash.com/1920x1080/?texture,material',
        'https://source.unsplash.com/1920x1080/?dark,minimal',
        'https://source.unsplash.com/1920x1080/?light,bright',
        
        // Urban & Architecture
        'https://source.unsplash.com/1920x1080/?city,urban',
        'https://source.unsplash.com/1920x1080/?architecture,building',
        'https://source.unsplash.com/1920x1080/?street,night',
        'https://source.unsplash.com/1920x1080/?modern,design',
        
        // Space & Science
        'https://source.unsplash.com/1920x1080/?space,galaxy',
        'https://source.unsplash.com/1920x1080/?stars,night',
        'https://source.unsplash.com/1920x1080/?nebula,cosmos',
        
        // Technology
        'https://source.unsplash.com/1920x1080/?technology,digital',
        'https://source.unsplash.com/1920x1080/?computer,tech',
        'https://source.unsplash.com/1920x1080/?code,programming'
    ];
    
    // Add random parameter to avoid caching
    const randomParam = `&t=${Date.now()}`;
    const selectedUrl = unsplashUrls[Math.floor(Math.random() * unsplashUrls.length)] + randomParam;
    
    const success = await bgPreloader.setBackground(selectedUrl);
    if (!success) {
        console.warn('Primary Unsplash failed, trying alternative...');
        await tryAlternativeUnsplash(bgPreloader);
    }
}

async function tryAlternativeUnsplash(bgPreloader) {
    // Large collection of specific high-quality Unsplash photos as backup
    const backupUrls = [
        // Nature & Landscapes
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1418065460487-3956c3043904?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1920&h=1080&fit=crop&auto=format',
        
        // Abstract & Minimal
        'https://images.unsplash.com/photo-1557682224-5b8590cd9ec5?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1552083375-1447ce00c827?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1557682268-e3955ed5d83f?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1557683316-973673baf926?w=1920&h=1080&fit=crop&auto=format',
        
        // Space & Cosmos
        'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920&h=1080&fit=crop&auto=format',
        'https://images.unsplash.com/photo-1484589065579-248aad0d8b13?w=1920&h=1080&fit=crop&auto=format'
    ];
    
    const backupUrl = backupUrls[Math.floor(Math.random() * backupUrls.length)];
    const success = await bgPreloader.setBackground(backupUrl);
    if (!success) {
        console.warn('All Unsplash options failed, falling back to local wallpapers');
        await pickLocalWallpaper(bgPreloader);
    }
}
