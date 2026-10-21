'use strict';
(() => {
  const config = window.SANTOS_CONFIG || {};
  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const storageKey = 'santos_privacy_v1';
  const consentMaxAge = 180 * 24 * 60 * 60 * 1000;
  let consent = null;
  let analyticsLoaded = false;
  let analyticsAcceptsEvents = false;
  try {
    const record = JSON.parse(localStorage.getItem(storageKey) || 'null');
    if (record && Date.now() - record.at < consentMaxAge) consent = record.value;
  } catch { /* Preferências locais indisponíveis: nenhuma coleta por padrão. */ }

  const analyticsEnabled = config.mode === 'production' && config.analytics?.enabled && /^G-[A-Z0-9]+$/.test(config.analytics.measurementId || '');
  function cleanPageUrl() {
    const url = new URL(window.location.href);
    const safeKeys = ['utm_source', 'utm_medium', 'utm_campaign'];
    const safe = new URLSearchParams();
    for (const key of safeKeys) {
      const value = url.searchParams.get(key);
      if (value && /^[a-z0-9_-]{1,60}$/i.test(value)) safe.set(key, value);
    }
    url.search = safe.toString();
    url.hash = '';
    return url.href;
  }
  function initializeAnalytics() {
    if (!analyticsEnabled || consent !== 'granted' || analyticsLoaded) return;
    analyticsLoaded = true;
    analyticsAcceptsEvents = true;
    const id = config.analytics.measurementId;
    window['ga-disable-' + id] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
    window.gtag('js', new Date());
    window.gtag('config', id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: cleanPageUrl(),
      page_referrer: referrerOrigin()
    });
    window.gtag('event', 'page_view', { page_location: cleanPageUrl(), page_title: document.title });
    const script = document.createElement('script');
    script.async = true;
    script.id = 'santos-analytics';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.append(script);
  }
  function referrerOrigin() {
    if (!document.referrer) return '';
    try { return new URL(document.referrer).origin; } catch { return ''; }
  }
  function track(name, fields = {}) {
    if (!analyticsEnabled || !analyticsAcceptsEvents || consent !== 'granted' || !window.gtag) return;
    window.gtag('event', name, { ...fields, page_location: cleanPageUrl() });
  }
  function clearAnalyticsCookies() {
    const hostParts = location.hostname.split('.');
    const domains = ['', location.hostname, ...hostParts.map((_, i) => '.' + hostParts.slice(i).join('.'))];
    for (const cookie of document.cookie.split(';')) {
      const name = cookie.split('=')[0].trim();
      if (!/^_ga(?:_|$)/.test(name)) continue;
      const paths = ['/', location.pathname.replace(/[^/]*$/, '')];
      for (const domain of domains) for (const path of paths) {
        document.cookie = name + '=; Max-Age=0; path=' + path + (domain ? '; domain=' + domain : '') + '; SameSite=Lax';
      }
    }
  }
  function setConsent(value) {
    if (value !== 'granted' && value !== 'denied') return;
    const previouslyLoaded = analyticsLoaded;
    consent = value;
    try { localStorage.setItem(storageKey, JSON.stringify({ value, at: Date.now() })); } catch { /* Não gravar além da escolha. */ }
    $('#cookie-banner').hidden = true;
    if (value === 'granted') initializeAnalytics();
    else {
      analyticsAcceptsEvents = false;
      if (config.analytics?.measurementId) window['ga-disable-' + config.analytics.measurementId] = true;
      clearAnalyticsCookies();
      // Recarregar encerra também scripts do provedor que já estavam carregados.
      if (previouslyLoaded) location.reload();
    }
    $('#live-message').textContent = value === 'granted' && analyticsEnabled ? 'Estatísticas autorizadas.' : 'Preferência salva. Nenhuma estatística opcional será coletada.';
  }
  $$('.cookie-actions button').forEach((button) => button.addEventListener('click', () => setConsent(button.dataset.consent)));
  $('#cookie-settings').addEventListener('click', () => {
    const banner = $('#cookie-banner');
    banner.hidden = false;
    if (!analyticsEnabled) {
      $('#cookie-description').textContent = 'As estatísticas de navegação estão desativadas. Nenhuma informação é enviada para análise. Você pode registrar sua preferência neste navegador.';
    }
    banner.querySelector('button').focus();
  });
  if (analyticsEnabled && !consent) $('#cookie-banner').hidden = false;
  initializeAnalytics();

  const menu = $('#navigation');
  const menuToggle = $('.menu-toggle');
  function closeMenu() { menu.classList.remove('open'); menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Abrir menu'); }
  menuToggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); });

  const serviceCards = $$('.service-card');
  function filterServices(category, announce = true) {
    serviceCards.forEach((card) => { card.hidden = category !== 'todos' && card.dataset.category !== category; });
    $$('.filter').forEach((button) => {
      const active = button.dataset.filter === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (announce) {
      const count = serviceCards.filter((card) => !card.hidden && !card.classList.contains('service-callout')).length;
      $('#filter-status').textContent = count + ' serviços exibidos.';
    }
  }
  $$('.filter').forEach((button) => button.addEventListener('click', () => { filterServices(button.dataset.filter); track('filter_services', { service_group: button.dataset.filter }); }));
  filterServices('lavacao', false);

  $$('[data-comparison]').forEach((module) => {
    const range = module.querySelector('.comparison-range');
    const frame = module.querySelector('.comparison');
    if (!range || !frame) return;
    function setComparison(value) {
      const amount = Math.min(100, Math.max(0, Number(value)));
      range.value = String(amount);
      frame.style.setProperty('--split', amount + '%');
      range.setAttribute('aria-valuetext', amount === 0 ? 'Somente depois' : amount === 100 ? 'Somente antes' : amount + '% antes e ' + (100 - amount) + '% depois');
      module.querySelectorAll('[data-compare]').forEach((button) => {
        const selected = Number(button.dataset.compare) === amount;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    }
    range.addEventListener('input', () => setComparison(range.value));
    range.addEventListener('change', () => track('compare_before_after', { comparison_mode: 'arraste' }));
    module.querySelectorAll('[data-compare]').forEach((button) => button.addEventListener('click', () => {
      setComparison(button.dataset.compare);
      track('compare_before_after', { comparison_mode: button.textContent.trim() });
    }));
  });

  const dialog = $('#pending-dialog');
  $$('[data-pending]').forEach((button) => button.addEventListener('click', () => { dialog.showModal(); }));
  $('.dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });

  function whatsappUrl(service, vehicle = '') {
    const phone = String(config.whatsapp || '');
    if (!/^55\d{10,11}$/.test(phone)) return '';
    const cleanService = String(service || 'orientação').replace(/[\u0000-\u001F\u007F]/g, ' ').slice(0, 120);
    const cleanVehicle = String(vehicle || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, 80);
    const greeting = 'Olá, Santos Lavação!';
    const model = cleanVehicle ? '\nModelo do veículo: ' + cleanVehicle : '\nModelo do veículo: [vou informar]';
    const request = '\nInteresse: ' + cleanService + '.\nPodem me orientar sobre valores, condições e disponibilidade?';
    return 'https://wa.me/' + phone + '?text=' + encodeURIComponent(greeting + model + request);
  }
  $$('a[data-service]').forEach((link) => {
    const href = whatsappUrl(link.dataset.service);
    if (href) link.href = href;
    link.addEventListener('click', () => track('click_whatsapp', { position: 'servico', service_name: link.dataset.service }));
  });
  $$('a[data-event]').forEach((link) => link.addEventListener('click', () => track(link.dataset.event, { position: link.dataset.position || 'site', channel: link.dataset.channel || '' })));
  $('#contact-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const service = $('#service').value;
    const vehicle = $('#vehicle').value.slice(0, 80);
    const href = whatsappUrl(service, vehicle);
    if (!href) {
      $('#live-message').textContent = 'O WhatsApp não está disponível. Use o número publicado no site.';
      return;
    }
    // Não transmitir o modelo ou a mensagem ao Analytics e não registrar um agendamento.
    track('click_whatsapp', { position: 'formulario', service_name: service.slice(0, 120) });
    window.open(href, '_blank', 'noopener,noreferrer');
    $('#live-message').textContent = 'Continue no WhatsApp e confirme a mensagem. Nenhuma reserva foi realizada neste site.';
  });

  const dilution = $('#diluicao');
  if (dilution) {
    const uses = $$('.dilution-use');
    const ratiosBox = $('#dilution-ratios');
    const note = $('#dilution-note');
    const custom = $('#dilution-custom');
    const ratioInput = $('#dilution-ratio');
    const volumeInput = $('#dilution-volume');
    const volumeButtons = $$('[data-volume]');
    let activeUse = uses.find((button) => button.classList.contains('active')) || uses[0];
    let ratio = Number(activeUse.dataset.default) || 10;

    function formatAmount(ml) {
      if (ml >= 1000) {
        return (ml / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) + ' L';
      }
      const rounded = Math.round(ml * 10) / 10;
      const digits = Math.abs(rounded - Math.round(rounded)) < 0.001 ? 0 : 1;
      return rounded.toLocaleString('pt-BR', { minimumFractionDigits: digits, maximumFractionDigits: digits }) + ' ml';
    }
    function showGap(message) {
      $('#dilution-read').textContent = message;
      $('#dilution-product').textContent = '—';
      $('#dilution-water').textContent = '—';
      $('#dilution-exact').textContent = '';
      $('#dilution-bar').style.width = '0%';
    }
    function currentRatio() {
      if (activeUse.dataset.custom !== 'true') return ratio;
      const n = Number(ratioInput.value);
      return Number.isInteger(n) && n >= 1 && n <= 500 ? n : null;
    }
    function calculate() {
      const volume = Number(volumeInput.value);
      const n = currentRatio();
      if (!Number.isInteger(volume) || volume < 1 || volume > 200000) {
        showGap('Informe um volume final entre 1 ml e 200 L.');
        return;
      }
      if (n == null) {
        showGap('Informe uma proporção de 1:1 até 1:500.');
        return;
      }
      const product = volume / (1 + n);
      const productRounded = Math.round(product);
      const waterRounded = volume - productRounded;
      $('#dilution-read').textContent = '1 parte de produto + ' + n + ' de água';
      $('#dilution-bar').style.width = (product / volume) * 100 + '%';
      if (product < 0.5) {
        $('#dilution-product').textContent = formatAmount(product);
        $('#dilution-water').textContent = formatAmount(volume - product);
        $('#dilution-exact').textContent = 'Menos de 1 ml de produto. Aumente o volume para medir com um copo.';
        return;
      }
      $('#dilution-product').textContent = formatAmount(productRounded);
      $('#dilution-water').textContent = formatAmount(waterRounded);
      $('#dilution-exact').textContent = Math.abs(product - productRounded) >= 0.05
        ? 'Exato: ' + formatAmount(product) + ' de produto e ' + formatAmount(volume - product) + ' de água.'
        : '';
    }
    function renderRatios() {
      const isCustom = activeUse.dataset.custom === 'true';
      custom.hidden = !isCustom;
      ratiosBox.hidden = isCustom;
      note.textContent = activeUse.dataset.note || '';
      if (isCustom) return;
      const presets = (activeUse.dataset.ratios || '').split(',').map((item) => {
        const splitAt = item.indexOf(':');
        return { n: Number(item.slice(0, splitAt)), label: item.slice(splitAt + 1) };
      }).filter((item) => item.n >= 1);
      if (!presets.some((item) => item.n === ratio)) ratio = Number(activeUse.dataset.default) || presets[0].n;
      ratiosBox.replaceChildren(...presets.map((item) => {
        const button = document.createElement('button');
        const on = item.n === ratio;
        const name = document.createElement('strong');
        const hint = document.createElement('span');
        button.type = 'button';
        button.className = 'dilution-ratio' + (on ? ' active' : '');
        button.dataset.ratio = String(item.n);
        button.setAttribute('aria-pressed', String(on));
        name.textContent = '1:' + item.n;
        hint.textContent = item.label;
        button.append(name, hint);
        button.addEventListener('click', () => {
          ratio = item.n;
          $$('#dilution-ratios .dilution-ratio').forEach((chip) => {
            const selected = Number(chip.dataset.ratio) === ratio;
            chip.classList.toggle('active', selected);
            chip.setAttribute('aria-pressed', String(selected));
          });
          calculate();
        });
        return button;
      }));
    }
    uses.forEach((button) => button.addEventListener('click', () => {
      uses.forEach((item) => {
        const on = item === button;
        item.classList.toggle('active', on);
        item.setAttribute('aria-pressed', String(on));
      });
      activeUse = button;
      ratio = Number(button.dataset.default) || 10;
      renderRatios();
      if (button.dataset.custom === 'true') ratioInput.focus();
      calculate();
    }));
    volumeButtons.forEach((button) => button.addEventListener('click', () => {
      volumeInput.value = button.dataset.volume;
      volumeInput.dispatchEvent(new Event('input', { bubbles: true }));
    }));
    volumeInput.addEventListener('input', () => {
      const ml = Number(volumeInput.value);
      volumeButtons.forEach((button) => {
        const on = Number(button.dataset.volume) === ml;
        button.classList.toggle('active', on);
        button.setAttribute('aria-pressed', String(on));
      });
      calculate();
    });
    ratioInput.addEventListener('input', calculate);
    renderRatios();
    calculate();
  }
})();
