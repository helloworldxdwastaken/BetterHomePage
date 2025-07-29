import { refreshIcons } from '../core/storage.js';

// Onboarding functionality
export function initOnboarding() {
    const ONBOARDING_KEY = 'betterHomeOnboardingComplete';
    const overlay = document.getElementById('onboardingOverlay');
    const skipBtn = document.getElementById('onboardingSkip');
    const completeBtn = document.getElementById('onboardingComplete');
    
    // Check if onboarding has been completed
    const isFirstVisit = !localStorage.getItem(ONBOARDING_KEY);
    
    if (isFirstVisit && overlay) {
        // Show onboarding after a short delay
        setTimeout(() => {
            showOnboarding();
        }, 1500);
    }
    
    // Function to show onboarding (can be called from settings)
    function showOnboarding() {
        if (!overlay) return;
        
        // Re-query browser items each time to ensure they're loaded
        const browserItems = overlay.querySelectorAll('.browser-item');
        
        // Re-initialize browser accordion functionality
        browserItems.forEach(item => {
            const header = item.querySelector('.browser-header');
            if (header) {
                // Remove existing listeners to avoid duplicates
                const newHeader = header.cloneNode(true);
                header.parentNode.replaceChild(newHeader, header);
                
                newHeader.addEventListener('click', () => {
                    // Close other items
                    browserItems.forEach(otherItem => {
                        if (otherItem !== item) {
                            otherItem.classList.remove('active');
                        }
                    });
                    
                    // Toggle current item
                    item.classList.toggle('active');
                });
            }
        });
        
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.classList.add('show');
            refreshIcons();
            detectBrowser();
        }, 100);
    }
    
    // Skip button
    if (skipBtn) {
        skipBtn.addEventListener('click', () => {
            closeOnboarding();
        });
    }
    
    // Complete button
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            closeOnboarding();
        });
    }
    
    // Close onboarding function
    function closeOnboarding() {
        overlay.classList.remove('show');
        localStorage.setItem(ONBOARDING_KEY, 'true');
        
        // Remove overlay after animation
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 600);
    }
    
    // Also close with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('show')) {
            closeOnboarding();
        }
    });
    
    // Detect browser and highlight the relevant one
    function detectBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        let detectedBrowser = null;
        
        if (userAgent.includes('brave')) {
            detectedBrowser = 'brave';
        } else if (userAgent.includes('opr') || userAgent.includes('opera')) {
            detectedBrowser = 'opera';
        } else if (userAgent.includes('edg')) {
            detectedBrowser = 'edge';
        } else if (userAgent.includes('firefox')) {
            detectedBrowser = 'firefox';
        } else if (userAgent.includes('safari') && !userAgent.includes('chrome')) {
            detectedBrowser = 'safari';
        } else if (userAgent.includes('chrome')) {
            detectedBrowser = 'chrome';
        }
        
        if (detectedBrowser) {
            const browserItem = document.querySelector(`[data-browser="${detectedBrowser}"]`);
            if (browserItem) {
                // Auto-expand detected browser
                setTimeout(() => {
                    browserItem.classList.add('active');
                    // Move it to the top
                    const parent = browserItem.parentNode;
                    parent.insertBefore(browserItem, parent.firstChild);
                }, 800);
            }
        }
    }
    
    // Make showOnboarding available globally for settings
    window.showOnboardingOverlay = showOnboarding;
}
