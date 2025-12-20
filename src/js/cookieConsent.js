export function initCookieConsent() {
  const COOKIE_CONSENT_KEY = 'nelson_cookie_consent';
  const cookieBanner = document.getElementById('cookie-banner');
  const cookieModal = document.getElementById('cookie-settings-modal');
  const analyticsToggle = document.getElementById('analytics-cookie-toggle');
  const openCookieSettingsBtn = document.getElementById('open-cookie-settings');
  const acceptBtn = document.getElementById('cookie-accept');
  const rejectBtn = document.getElementById('cookie-reject');
  const settingsBtn = document.getElementById('cookie-settings-open');
  const saveSettingsBtn = document.getElementById('cookie-settings-save');

  const getConsent = () => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    return consent ? JSON.parse(consent) : null;
  };

  const setConsent = (consent) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
  };

  const enableGoogleAnalytics = () => {
    if (typeof gtag === 'function') {
      gtag('config', 'G-124QEKRXHD');
      // console.log('Google Analytics activado.');
    }
  };

  const handleInitialConsent = () => {
    const consent = getConsent();
    if (consent) {
      if (consent.analytics) {
        enableGoogleAnalytics();
      }
      if (cookieBanner) {
        cookieBanner.classList.add('hidden');
      }
    } else {
      if (cookieBanner) {
        cookieBanner.classList.remove('hidden');
      }
    }
  };

  const toggleModal = (show) => {
    if (!cookieModal) return;
    if (show) {
      const consent = getConsent() || { analytics: false };
      if (analyticsToggle) {
        analyticsToggle.checked = consent.analytics;
      }
      cookieModal.classList.remove('hidden');
    } else {
      cookieModal.classList.add('hidden');
    }
  };

  if (openCookieSettingsBtn) {
    openCookieSettingsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      toggleModal(true);
    });
  }

  if (acceptBtn) {
    acceptBtn.addEventListener('click', () => {
      const consent = { necessary: true, analytics: true };
      setConsent(consent);
      enableGoogleAnalytics();
      if (cookieBanner) {
        cookieBanner.classList.add('hidden');
      }
    });
  }

  if (rejectBtn) {
    rejectBtn.addEventListener('click', () => {
      const consent = { necessary: true, analytics: false };
      setConsent(consent);
      if (cookieBanner) {
        cookieBanner.classList.add('hidden');
      }
    });
  }

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      toggleModal(true);
    });
  }

  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      const consent = {
        necessary: true,
        analytics: analyticsToggle ? analyticsToggle.checked : false,
      };
      setConsent(consent);
      if (consent.analytics) {
        enableGoogleAnalytics();
      }
      toggleModal(false);
      if (cookieBanner) {
        cookieBanner.classList.add('hidden');
      }
    });
  }

  if (cookieModal) {
    cookieModal.addEventListener('click', (e) => {
      if (e.target === cookieModal) {
        toggleModal(false);
      }
    });
  }

  handleInitialConsent();
}
