/* ==========================================================================
   SHITAL GURAV MAKEUP STUDIO — booking.js
   Appointment form: validation, prefill, success state.
   Frontend-only for now — integration hooks prepared below.
   ========================================================================== */
(function () {
  'use strict';

  var form = document.getElementById('appointmentForm');
  if (!form) return;
  var panel = form.closest('.form-panel');
  var submitBtn = document.getElementById('formSubmit');

  /* ------------------------------------------------------------------
     INTEGRATION CONFIG (placeholders)
     To connect this form later, fill in the relevant value below:

     1. WhatsApp  -> set whatsappNumber, e.g. '9198XXXXXXXX'
                    (the request is composed as a pre-filled message)
     2. Email     -> set emailEndpoint to your form service
                    (Formspree / EmailJS / your own endpoint)
     3. Sheets    -> set sheetsEndpoint to a Google Apps Script
                    Web App URL that appends rows to a sheet
     4. Backend   -> set apiEndpoint to your API route, e.g.
                    '/api/appointments' (POST JSON)

     Until then, submission shows the success message only.
  ------------------------------------------------------------------ */
  var BOOKING_CONFIG = {
    whatsappNumber: '',      // e.g. '9198XXXXXXXX'
    emailEndpoint: '',       // e.g. 'https://formspree.io/f/XXXX'
    sheetsEndpoint: '',      // e.g. 'https://script.google.com/macros/s/.../exec'
    apiEndpoint: ''          // e.g. '/api/appointments'
  };

  /* ------------------------------------------------------------------
     1. PREFILL FROM URL — booking.html?service=bridal&type=wedding
  ------------------------------------------------------------------ */
  var params = new URLSearchParams(window.location.search);
  ['service', 'type'].forEach(function (key) {
    var value = params.get(key);
    if (!value) return;
    var select = key === 'service' ? form.elements.preferredService : form.elements.eventType;
    if (!select) return;
    Array.prototype.slice.call(select.options).forEach(function (opt) {
      if (opt.value.toLowerCase() === value.toLowerCase().replace(/-/g, ' ')) {
        select.value = opt.value;
      }
    });
  });

  /* Event date cannot be in the past */
  var dateInput = form.elements.eventDate;
  if (dateInput) {
    var today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
  }

  /* ------------------------------------------------------------------
     2. VALIDATION
  ------------------------------------------------------------------ */
  function setError(name, hasError) {
    var field = form.elements[name];
    if (!field) return;
    var wrap = field.closest('.field');
    if (wrap) wrap.classList.toggle('has-error', hasError);
    field.setAttribute('aria-invalid', hasError ? 'true' : 'false');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var required = ['fullName', 'phone', 'eventDate', 'eventType'];
    var valid = true;

    required.forEach(function (name) {
      var field = form.elements[name];
      var empty = !field || !field.value.trim();
      setError(name, empty);
      if (empty) valid = false;
    });

    /* Phone: digits, spaces, +, - — at least 8 digits */
    var phone = form.elements.phone;
    if (phone && phone.value.trim()) {
      var digits = phone.value.replace(/\D/g, '');
      var phoneOk = digits.length >= 8 && digits.length <= 15;
      setError('phone', !phoneOk);
      if (!phoneOk) valid = false;
    }

    /* Email: only when provided */
    var email = form.elements.email;
    if (email && email.value.trim()) {
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
      setError('email', !emailOk);
      if (!emailOk) valid = false;
    }

    if (!valid) {
      var firstError = form.querySelector('.has-error input, .has-error select');
      if (firstError) firstError.focus();
      return;
    }

    /* Build the payload used by every integration */
    var payload = {
      fullName: form.elements.fullName.value.trim(),
      phone: form.elements.phone.value.trim(),
      email: form.elements.email.value.trim(),
      eventDate: form.elements.eventDate.value,
      eventType: form.elements.eventType.value,
      venue: form.elements.venue.value.trim(),
      preferredService: form.elements.preferredService.value,
      preferredTime: form.elements.preferredTime.value,
      guests: form.elements.guests.value,
      message: form.elements.message.value.trim(),
      submittedAt: new Date().toISOString()
    };

    submit(payload);
  });

  /* ------------------------------------------------------------------
     3. SUBMIT — currently a frontend-only simulation
  ------------------------------------------------------------------ */
  function submit(payload) {
    var label = submitBtn.querySelector('span');
    var original = label.textContent;
    submitBtn.disabled = true;
    label.textContent = 'Sending';

    window.setTimeout(function () {
      /* ---- Integration hooks (fill BOOKING_CONFIG to activate) ----
         if (BOOKING_CONFIG.apiEndpoint)     { fetch(BOOKING_CONFIG.apiEndpoint, { method:'POST', ... }) }
         if (BOOKING_CONFIG.sheetsEndpoint)  { fetch(BOOKING_CONFIG.sheetsEndpoint, { method:'POST', ... }) }
         if (BOOKING_CONFIG.emailEndpoint)   { ... }
         if (BOOKING_CONFIG.whatsappNumber)  { window.open('https://wa.me/' + BOOKING_CONFIG.whatsappNumber + '?text=' + encodeURIComponent(summary), '_blank') }
      ---------------------------------------------------------------- */

      submitBtn.disabled = false;
      label.textContent = original;
      if (panel) {
        panel.classList.add('is-success');
        panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 900);
  }

  /* "Send another request" */
  var again = document.getElementById('formAgain');
  if (again) {
    again.addEventListener('click', function () {
      if (!panel) return;
      panel.classList.remove('is-success');
      form.reset();
      form.elements.fullName.focus();
    });
  }
})();
