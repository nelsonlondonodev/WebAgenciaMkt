// src/js/leadForm.js
import { CONFIG } from './config.js';
import { submitLead } from './leadApi.js';
import {
  VISIBLE_FIELDS,
  buildLeadPayload,
  errorMessage,
  formatPhone,
  normalizePhone,
  validateLead,
} from './leadData.js';

const FAILURES = {
  rate_limited: 'Has enviado varios mensajes seguidos. Espera un poco o escríbeme por WhatsApp.',
  failed: 'No hemos podido enviarlo. Lo que has escrito sigue aquí: inténtalo otra vez o escríbeme por WhatsApp.',
};

/** Solo cuenta la conversión: nada de lo que escribe la persona llega a la analítica. */
function trackLead() {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'generate_lead', { event_category: 'Formulario de contacto' });
}

function readValues(form) {
  const data = new FormData(form);
  const text = (name) => String(data.get(name) ?? '').trim();
  return {
    name: text('name'),
    phone: text('phone'),
    service: text('service'),
    message: text('message'),
    website: String(data.get('website') ?? ''),
    privacyAccepted: data.get('privacy_accepted') !== null,
  };
}

function fieldControls(form, field) {
  return [...form.querySelectorAll(`[name="${field}"]`)];
}

function setFieldError(form, field, code) {
  const box = form.querySelector(`[data-error-for="${field}"]`);
  if (!box) return;

  box.textContent = code ? errorMessage(field, code) : '';
  box.hidden = !code;
  fieldControls(form, field).forEach((control) => {
    if (code) control.setAttribute('aria-invalid', 'true');
    else control.removeAttribute('aria-invalid');
  });
}

function showFieldErrors(form, errors) {
  VISIBLE_FIELDS.forEach((field) => setFieldError(form, field, errors[field]));
  const first = VISIBLE_FIELDS.find((field) => errors[field]);
  if (first) fieldControls(form, first)[0]?.focus();
}

function attachLeadForm(form) {
  const root = form.closest('[data-lead-form]');
  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = form.querySelector('[data-submit-label]');
  const status = form.querySelector('[data-form-status]');
  const statusText = form.querySelector('[data-form-status-text]');
  const phoneInput = form.querySelector('[name="phone"]');
  const phonePreview = form.querySelector('[data-phone-preview]');
  const success = root.querySelector('[data-form-success]');
  const idleLabel = submitLabel.textContent;
  // No se pone a cero al fallar: Waboce descarta en silencio lo enviado en menos de 2 s.
  const loadedAt = performance.now();
  let isSending = false;

  const setStatus = (message) => {
    statusText.textContent = message;
    status.hidden = !message;
  };

  const setSending = (sending) => {
    isSending = sending;
    submitButton.disabled = sending;
    submitLabel.textContent = sending ? 'Enviando…' : idleLabel;
    form.setAttribute('aria-busy', String(sending));
  };

  const updatePhonePreview = () => {
    const phone = normalizePhone(phoneInput.value);
    phonePreview.textContent = phone ? `Se enviará este número: ${formatPhone(phone)}` : '';
  };

  root.querySelectorAll('[data-lead-whatsapp]').forEach((link) => {
    const text = link.dataset.leadWhatsapp === 'sent' ? CONFIG.LEADS.WHATSAPP_TEXT : CONFIG.CONTACT.WHATSAPP_DEFAULT_MESSAGE;
    link.href = `https://wa.me/${CONFIG.CONTACT.WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
  });

  phoneInput.addEventListener('input', updatePhonePreview);
  form.addEventListener('input', (event) => {
    if (event.target.getAttribute('aria-invalid')) setFieldError(form, event.target.name, null);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (isSending) return;
    setStatus('');

    const values = readValues(form);
    const errors = validateLead(values);
    showFieldErrors(form, errors);
    if (Object.keys(errors).length > 0) return;

    updatePhonePreview();
    setSending(true);
    const result = await submitLead(
      buildLeadPayload(values, {
        site: CONFIG.LEADS.SITE,
        privacyVersion: CONFIG.LEADS.PRIVACY_VERSION,
        page: window.location.pathname,
        elapsedMs: performance.now() - loadedAt,
      })
    );
    setSending(false);

    if (result.type === 'success') {
      trackLead();
      form.reset();
      form.hidden = true;
      success.hidden = false;
      success.querySelector('[data-success-title]').focus();
    } else if (result.type === 'fields') {
      showFieldErrors(form, result.fields);
    } else {
      setStatus(FAILURES[result.type]);
      status.focus();
    }
  });

  // El botón nace desactivado: sin JavaScript, un envío nativo llevaría los datos fuera de aquí.
  updatePhonePreview();
  submitButton.disabled = false;
}

export function initLeadForm() {
  const form = document.querySelector('#contact-form');
  if (form) attachLeadForm(form);
}
