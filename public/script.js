// Prevent duplicate Zappy injection
if (window.zappyContactFormLoaded) {
    console.log('⚠️ Zappy: Contact form handler already loaded, skipping duplicate injection');
} else {
    window.zappyContactFormLoaded = true;
}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking nav links
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideMenu = navMenu.contains(event.target);
            const isClickOnToggle = mobileToggle.contains(event.target);
            
            if (!isClickInsideMenu && !isClickOnToggle && navMenu.classList.contains('active')) {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('menu-open');
            }
        });
    }
    
    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Basic validation
            if (!data.fullName || !data.email || !data.phone) {
                alert('אנא מלא את כל השדות החובה');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                alert('אנא הזן כתובת דואר אלקטרוני תקינה');
                return;
            }
            
            // Phone validation (Israeli format)
            const phoneRegex = /^0[0-9]{1,2}-?[0-9]{7}$/;
            if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
                alert('אנא הזן מספר טלפון תקין');
                return;
            }
            
            // Terms checkbox validation
            if (!data.terms) {
                alert('יש להסכים לתנאי השימוש');
                return;
            }
            
            // Send to Zappy backend API
            try {
                console.log('📧 Zappy: Sending contact form to backend...');
                const response = await fetch('https://api.zappy5.com/api/email/contact-form', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        websiteId: '951b7004-1aae-46d5-9b67-b4d6c3c18d7c',
                        name: data.fullName,
                        email: data.email,
                        subject: data.subject || 'Contact Form Submission',
                        message: data.message || '',
                        phone: data.phone || null
                    })
                });
                
                const result = await response.json();
                
                if (response.ok) {
                    console.log('✅ Zappy: Email sent successfully', result);
                } else {
                    console.error('❌ Zappy: API returned error status', response.status, result);
                }
            } catch (error) {
                console.error('❌ Zappy: Failed to send email', error);
                // Don't break existing functionality - continue with success message
            }
            
            // Success message (existing functionality)
            alert('תודה על פניתך! ניצור איתך קשר בהקדם.');
            contactForm.reset();
        });
    }
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href !== '') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
        }
        
        lastScroll = currentScroll;
    });
});

// Accessibility enhancements
window.addEventListener('keydown', function(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape') {
        const mobileToggle = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navMenu && navMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
});

/* Cookie Consent */

// Helper function to check cookie consent
function hasConsentFor(category) {
  if (typeof window.CookieConsent === 'undefined') {
    return false; // Default to no consent if cookie consent not loaded
  }
  
  return window.CookieConsent.validConsent(category);
}

// Helper function to execute code only with consent
function withConsent(category, callback) {
  if (hasConsentFor(category)) {
    callback();
  } else {
    console.log(`[WARNING] Skipping ${category} code - no user consent`);
  }
}

// Cookie Consent Initialization
console.log('[Cookie] Cookie consent script loaded - starting initialization...');

(function() {
  'use strict';
  
  let initAttempts = 0;
  const maxAttempts = 50; // 5 seconds max wait
  
  // Wait for DOM and vanilla-cookieconsent to be ready
  function initCookieConsent() {
    initAttempts++;
    
    console.log('[Cookie] Cookie consent init attempt', initAttempts, '- CookieConsent available:', typeof window.CookieConsent !== 'undefined');
    console.log('[Cookie] Document ready state:', document.readyState);
    console.log('[Cookie] Window object available:', typeof window !== 'undefined');
    
    if (typeof window.CookieConsent === 'undefined') {
      if (initAttempts < maxAttempts) {
        console.log('[Cookie] CookieConsent not ready, retrying in 100ms...');
        setTimeout(initCookieConsent, 100);
      } else {
        console.error('[Cookie] Cookie consent failed to load after', maxAttempts, 'attempts');
        console.error('[Cookie] Available window properties:', Object.keys(window).filter(k => k.toLowerCase().includes('cookie')));
      }
      return;
    }

    const cc = window.CookieConsent;
    
    console.log('[Cookie] Initializing cookie consent with config:', typeof cc);
    console.log('[Cookie] CookieConsent.run available:', typeof cc.run === 'function');
    
    // Initialize cookie consent
    try {
      cc.run({
  "autoShow": true,
  "mode": "opt-in",
  "revision": 0,
  "categories": {
    "necessary": {
      "enabled": true,
      "readOnly": true
    },
    "analytics": {
      "enabled": false,
      "readOnly": false,
      "autoClear": {
        "cookies": [
          {
            "name": "_ga"
          },
          {
            "name": "_ga_*"
          },
          {
            "name": "_gid"
          },
          {
            "name": "_gat"
          }
        ]
      }
    },
    "marketing": {
      "enabled": false,
      "readOnly": false,
      "autoClear": {
        "cookies": [
          {
            "name": "_fbp"
          },
          {
            "name": "_fbc"
          },
          {
            "name": "fr"
          }
        ]
      }
    }
  },
  "language": {
    "default": "he",
    "translations": {
      "he": {
        "consentModal": {
          "title": "אנחנו משתמשים בעוגיות 🍪",
          "description": "עמותת זיכרון למען החלל איתי פריזט ז\"ל משתמש בעוגיות כדי לשפר את החוויה שלך, לנתח שימוש באתר ולסייע במאמצי השיווק שלנו.",
          "acceptAllBtn": "אשר הכל",
          "acceptNecessaryBtn": "רק הכרחי",
          "showPreferencesBtn": "נהל העדפות",
          "footer": "<a href=\"#privacy-policy\">מדיניות פרטיות</a> | <a href=\"#terms-conditions\">תנאי שימוש</a>"
        },
        "preferencesModal": {
          "title": "העדפות עוגיות",
          "acceptAllBtn": "אשר הכל",
          "acceptNecessaryBtn": "רק הכרחי",
          "savePreferencesBtn": "שמור העדפות",
          "closeIconLabel": "סגור",
          "sections": [
            {
              "title": "עוגיות חיוניות",
              "description": "עוגיות אלה הכרחיות לתפקוד האתר ולא ניתן להשבית אותן.",
              "linkedCategory": "necessary"
            },
            {
              "title": "עוגיות ניתוח",
              "description": "עוגיות אלה עוזרות לנו להבין איך המבקרים מתקשרים עם האתר שלנו.",
              "linkedCategory": "analytics"
            },
            {
              "title": "עוגיות שיווקיות",
              "description": "עוגיות אלה משמשות להצגת פרסומות מותאמות אישית.",
              "linkedCategory": "marketing"
            }
          ]
        }
      }
    }
  },
  "guiOptions": {
    "consentModal": {
      "layout": "box",
      "position": "bottom right",
      "equalWeightButtons": true,
      "flipButtons": false
    },
    "preferencesModal": {
      "layout": "box",
      "equalWeightButtons": true,
      "flipButtons": false
    }
  }
});
      console.log('[Cookie] Cookie consent initialized successfully');
      
      // Optional: Handle consent changes (check if onChange is available)
      if (typeof cc.onChange === 'function') {
        cc.onChange(function(cookie, changed_preferences) {
          console.log('[Cookie] Cookie consent changed:', changed_preferences);
      
      // Enable/disable analytics based on consent
      if (changed_preferences.includes('analytics')) {
        if (cc.validConsent('analytics')) {
          // Enable analytics (e.g., Google Analytics)
          console.log('[Analytics] Analytics enabled');
          // Example: gtag('consent', 'update', { analytics_storage: 'granted' });
        } else {
          console.log('[Analytics] Analytics disabled');
          // Example: gtag('consent', 'update', { analytics_storage: 'denied' });
        }
      }
      
      // Enable/disable marketing based on consent
      if (changed_preferences.includes('marketing')) {
        if (cc.validConsent('marketing')) {
          console.log('[Marketing] Marketing enabled');
          // Example: gtag('consent', 'update', { ad_storage: 'granted' });
        } else {
          console.log('[Marketing] Marketing disabled');
          // Example: gtag('consent', 'update', { ad_storage: 'denied' });
        }
      }
        });
      } else {
        console.log('[Cookie] cc.onChange not available in this version');
      }

      // Note: Cookie Preferences button removed per marketing guidelines
      // Footer should be clean and minimal - users can manage cookies via banner
    } catch (error) {
      console.error('❌ Cookie consent initialization failed:', error);
      console.error('❌ Error details:', error.message, error.stack);
    }
  }

  // Initialize when DOM is ready - multiple approaches for reliability
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieConsent);
    // Backup timeout in case DOMContentLoaded doesn't fire
    setTimeout(initCookieConsent, 1000);
  } else if (document.readyState === 'interactive' || document.readyState === 'complete') {
    initCookieConsent();
  } else {
    // Fallback - try after a short delay
    setTimeout(initCookieConsent, 500);
  }
  
  // Additional fallback - try after page load
  if (typeof window !== 'undefined') {
    if (window.addEventListener) {
      window.addEventListener('load', initCookieConsent, { once: true });
    }
  }
})();

/* Accessibility Features */

/* Mickidum Accessibility Toolbar Initialization */

window.onload = function() {
    console.log('♿ Initializing Mickidum Accessibility Toolbar...');
    console.log('   Language detected: he');
    console.log('   Language code: he-IL');
    
    try {
        window.micAccessTool = new MicAccessTool({
            buttonPosition: 'left', // Position on left side
            forceLang: 'he-IL' // Force language
        });
        
        console.log('✅ Mickidum Accessibility Toolbar initialized successfully');
        console.log('   Final language:', window.micAccessTool ? window.micAccessTool.currentLang || 'unknown' : 'instance not created');
        console.log('📱 Window width:', window.innerWidth);
        console.log('📲 Is Mobile:', window.innerWidth <= 768);
    } catch (error) {
        console.error('❌ Mickidum Accessibility Toolbar initialization failed:', error);
    }
};