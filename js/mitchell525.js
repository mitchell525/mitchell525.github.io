
// Fade-in functionality removed - content now shows immediately

// Cookie Consent Management
(function() {
    'use strict';
    
    // Cookie utility functions
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
    }
    
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    function deleteCookie(name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
    
    // Cookie consent state
    const COOKIE_CONSENT_KEY = 'cookie_consent';
    const COOKIE_ANALYTICS_KEY = 'cookie_analytics';
    const COOKIE_FUNCTIONAL_KEY = 'cookie_functional';
    
    // Check if user has already given consent
    function hasConsent() {
        return getCookie(COOKIE_CONSENT_KEY) !== null;
    }
    
    // Show cookie banner
    function showCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.style.display = 'block';
            // Trigger animation after a brief delay
            setTimeout(() => {
                banner.classList.add('show');
            }, 100);
        }
    }
    
    // Hide cookie banner
    function hideCookieBanner() {
        const banner = document.getElementById('cookie-banner');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(() => {
                banner.style.display = 'none';
            }, 300);
        }
    }
    
    // Update Google Analytics consent
    function updateAnalyticsConsent(analyticsAllowed) {
        if (typeof gtag !== 'undefined') {
            gtag('consent', 'update', {
                'analytics_storage': analyticsAllowed ? 'granted' : 'denied',
                'ad_storage': 'denied', // We don't use ads
                'functionality_storage': analyticsAllowed ? 'granted' : 'denied'
            });
            
            // If consent is granted, send a page view event
            // This ensures page views are tracked even if the initial page load was blocked
            if (analyticsAllowed) {
                gtag('event', 'page_view', {
                    'page_title': document.title,
                    'page_location': window.location.href,
                    'page_path': window.location.pathname
                });
            }
        }
    }
    
    // Accept all cookies
    function acceptAllCookies() {
        setCookie(COOKIE_CONSENT_KEY, 'accepted', 365);
        setCookie(COOKIE_ANALYTICS_KEY, 'true', 365);
        setCookie(COOKIE_FUNCTIONAL_KEY, 'true', 365);
        
        updateAnalyticsConsent(true);
        hideCookieBanner();
        
        // Track consent given
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cookie_consent', {
                'event_category': 'privacy',
                'event_label': 'accepted_all'
            });
        }
    }
    
    // Decline all cookies
    function declineAllCookies() {
        setCookie(COOKIE_CONSENT_KEY, 'declined', 365);
        setCookie(COOKIE_ANALYTICS_KEY, 'false', 365);
        setCookie(COOKIE_FUNCTIONAL_KEY, 'false', 365);
        
        updateAnalyticsConsent(false);
        hideCookieBanner();
        
        // Track consent declined (if analytics was previously allowed)
        if (typeof gtag !== 'undefined' && getCookie(COOKIE_ANALYTICS_KEY) === 'true') {
            gtag('event', 'cookie_consent', {
                'event_category': 'privacy',
                'event_label': 'declined_all'
            });
        }
    }
    
    // Save custom preferences
    function saveCookiePreferences() {
        const analyticsAllowed = document.getElementById('analytics-cookies').checked;
        const functionalAllowed = document.getElementById('functional-cookies').checked;
        
        setCookie(COOKIE_CONSENT_KEY, 'custom', 365);
        setCookie(COOKIE_ANALYTICS_KEY, analyticsAllowed ? 'true' : 'false', 365);
        setCookie(COOKIE_FUNCTIONAL_KEY, functionalAllowed ? 'true' : 'false', 365);
        
        updateAnalyticsConsent(analyticsAllowed);
        hideCookieBanner();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('cookieSettingsModal'));
        if (modal) {
            modal.hide();
        }
        
        // Track preferences saved
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cookie_consent', {
                'event_category': 'privacy',
                'event_label': 'custom_preferences'
            });
        }
    }
    
    // Initialize cookie consent
    function initCookieConsent() {
        // Set up event listeners
        const acceptBtn = document.getElementById('cookie-accept');
        const declineBtn = document.getElementById('cookie-decline');
        const settingsBtn = document.getElementById('cookie-settings');
        const saveBtn = document.getElementById('save-cookie-preferences');
        
        if (acceptBtn) {
            acceptBtn.addEventListener('click', acceptAllCookies);
        }
        
        if (declineBtn) {
            declineBtn.addEventListener('click', declineAllCookies);
        }
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', function() {
                const modal = new bootstrap.Modal(document.getElementById('cookieSettingsModal'));
                modal.show();
            });
        }
        
        if (saveBtn) {
            saveBtn.addEventListener('click', saveCookiePreferences);
        }
        
        // Check if we need to show the banner
        if (!hasConsent()) {
            showCookieBanner();
        } else {
            // User has already given consent, update analytics accordingly
            const analyticsAllowed = getCookie(COOKIE_ANALYTICS_KEY) === 'true';
            // Wait a bit to ensure gtag is fully loaded before updating consent
            if (typeof gtag === 'undefined') {
                // If gtag isn't loaded yet, wait for it
                const checkGtag = setInterval(() => {
                    if (typeof gtag !== 'undefined') {
                        clearInterval(checkGtag);
                        updateAnalyticsConsent(analyticsAllowed);
                    }
                }, 100);
                // Timeout after 5 seconds
                setTimeout(() => clearInterval(checkGtag), 5000);
            } else {
                updateAnalyticsConsent(analyticsAllowed);
            }
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCookieConsent);
    } else {
        initCookieConsent();
    }
    
    // Expose functions globally for debugging
    window.cookieConsent = {
        acceptAll: acceptAllCookies,
        declineAll: declineAllCookies,
        showBanner: showCookieBanner,
        hasConsent: hasConsent
    };
})();

// Screenshot Lightbox Functionality
(function() {
    'use strict';
    
    // Initialize lightbox functionality
    function initLightbox() {
        const modal = document.getElementById('screenshotModal');
        const lightboxImage = document.getElementById('lightboxImage');
        const closeBtn = document.querySelector('.lightbox-close');
        
        if (!modal || !lightboxImage) return;
        
        // Get all screenshot items (containers)
        const screenshotItems = document.querySelectorAll('.screenshot-item');
        
        // Add click event to each screenshot item
        screenshotItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                const image = item.querySelector('.screenshot-image');
                if (image) {
                    openLightbox(image.src);
                }
            });
            
            // Add keyboard support for accessibility
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            item.setAttribute('aria-label', 'Click to enlarge screenshot');
            
            item.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const image = item.querySelector('.screenshot-image');
                    if (image) {
                        openLightbox(image.src);
                    }
                }
            });
        });
        
        // Close lightbox when clicking close button
        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }
        
        // Close lightbox when clicking overlay
        modal.addEventListener('click', function(e) {
            if (e.target === modal || e.target.classList.contains('lightbox-overlay')) {
                closeLightbox();
            }
        });
        
        // Close lightbox with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display !== 'none') {
                closeLightbox();
            }
        });
    }
    
    function openLightbox(imageSrc) {
        const modal = document.getElementById('screenshotModal');
        const lightboxImage = document.getElementById('lightboxImage');
        
        if (!modal || !lightboxImage) return;
        
        lightboxImage.src = imageSrc;
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    }
    
    function closeLightbox() {
        const modal = document.getElementById('screenshotModal');
        
        if (!modal) return;
        
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore body scroll
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initLightbox);
    } else {
        initLightbox();
    }
})();