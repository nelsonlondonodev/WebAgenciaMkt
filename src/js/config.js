// src/js/config.js

export const CONFIG = {
  // Configuración del Chatbot (n8n Webhook)
  CHATBOT: {
    WEBHOOK_URL: 'https://n8n.srv1033442.hstgr.cloud/webhook/34b5ab96-ecf0-4195-93de-e3923c2062e5',
    SESSION_ID_KEY: 'nelson_chat_session_id',
  },

  // Configuración de Analytics y Cookies
  ANALYTICS: {
    GA_MEASUREMENT_ID: 'G-124QEKRXHD',
    COOKIE_CONSENT_KEY: 'nelson_cookie_consent',
  },

  // Configuración de contacto
  CONTACT: {
    EMAIL: 'contacto@nelsonlondono.es',
    PHONE: '+34663975428',
    PHONE_DISPLAY: '+34 663 97 54 28',
  },

  // Configuración de Precios (Centralizada)
  PRICING: {
    SEO_LOCAL: {
      MIN_PRICE: 230,
      CURRENCY: '€',
      SUFFIX: '/mes',
      NOTE: 'Estrategia de crecimiento continuo.'
    },
    SEO_LOCAL_EXPRESS: {
      MIN_PRICE: 97,
      CURRENCY: '€',
      SUFFIX: '',
      NOTE: 'Pago único. Impuso inicial para tu negocio.'
    },
    SEO_GENERAL: {
      MIN_PRICE: 275,
      CURRENCY: '€',
      SUFFIX: '/mes',
    }
  },

  // Configuración general de UI
  UI: {
    THEME_KEY: 'theme',
  },
};
