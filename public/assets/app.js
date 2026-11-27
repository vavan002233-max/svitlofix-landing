(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* ---------- Header: scrolled state ---------- */
  const header = $('.header');
  const dock = $('.dock');
  const hero = $('.hero');
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 12);
    if (dock && hero) dock.classList.toggle('is-visible', y > hero.offsetHeight * 0.6 && !formInView);
  };
  let formInView = false;
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = $('.burger');
  const nav = $('#nav');
  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрити меню' : 'Відкрити меню');
    nav.classList.toggle('is-open', open);
    header.classList.toggle('menu-open', open);
  };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

  /* ---------- Reveal on scroll + active nav ---------- */
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const reveals = $$('.reveal');
  // stagger siblings slightly
  reveals.forEach((el) => {
    const sibs = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const i = sibs.indexOf(el);
    if (i > 0) el.style.setProperty('--d', `${Math.min(i, 6) * 0.06}s`);
  });
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach((el) => io.observe(el));

    const links = $$('.nav a[href^="#"]');
    const map = new Map(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const so = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const a = map.get(en.target.id);
        if (a && en.isIntersecting) { links.forEach((l) => l.classList.remove('is-active')); a.classList.add('is-active'); }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('section[id]').forEach((s) => so.observe(s));

    const fo = new IntersectionObserver(([en]) => { formInView = en.isIntersecting; onScroll(); }, { threshold: 0.15 });
    fo.observe($('#request'));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }
  onScroll();

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Lead form ---------- */
  const form = $('#lead-form');
  if (!form) return;

  const serviceInput = $('#f-service');
  const equipmentConfig = {
    prices: { inverter: 'від 10 000 грн', station: { single: 'від 6 000 грн', three: 'від 8 000 грн' } },
    categories: {
      inverters: { label: 'Інвертори та системи накопичення', type: 'Монтаж інвертора', items: [
        ['Deye','deye'],['Solis','solis'],['Must','must'],['Growatt','growatt'],['Victron','victron'],['LuxPower','luxpower'],['HYXiPOWER','hyxipower'],['Felicity','felicity'],['Інші','inverter-other']
      ]},
      stations: { label: 'Портативні зарядні станції', type: 'Підключення портативної зарядної станції', items: [
        ['DELTA','delta'],['Könner & Söhnen','konner-sohnen'],['RIVER 2 Pro','river-2-pro'],['Bluetti','bluetti'],['Anker Solix','anker-solix'],['Інші','station-other']
      ]}
    }
  };
  const track = $('#equipment-track'), progress = $('#carousel-progress'), wizard = $('#equipment-wizard'), wizardContent = $('#wizard-content');
  let categoryKey = 'inverters', selectedItem = null, selectedPhase = '';
  const renderCards = () => {
    track.replaceChildren();
    equipmentConfig.categories[categoryKey].items.forEach(([name, image]) => {
      const card = document.createElement('button'); card.type = 'button'; card.className = 'equipment-card'; card.dataset.name = name;
      card.innerHTML = `<img src="/img/equipment/${image}.svg?v=20261127-7" alt="" loading="lazy"><span>${name}</span>`;
      card.addEventListener('click', () => { selectedItem = { name, image }; selectedPhase = ''; $('#request').hidden = true; wizard.hidden = false; renderWizard(); wizard.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' }); });
      track.append(card);
    }); updateProgress();
  };
  const updateProgress = () => { const max = track.scrollWidth - track.clientWidth; progress.style.width = `${max > 0 ? Math.max(8, track.clientWidth / track.scrollWidth * 100) : 100}%`; progress.style.transform = `translateX(${max > 0 ? track.scrollLeft / max * (100 - parseFloat(progress.style.width)) : 0}%)`; };
  track.addEventListener('scroll', updateProgress, { passive: true });
  $$('.carousel__arrow').forEach((button) => button.addEventListener('click', () => track.scrollBy({ left: Number(button.dataset.direction) * Math.max(220, track.clientWidth * .72), behavior: reduce ? 'auto' : 'smooth' })));
  $$('.equipment-tab').forEach((tab) => tab.addEventListener('click', () => { categoryKey = tab.dataset.category; $$('.equipment-tab').forEach((item) => { const active = item === tab; item.classList.toggle('is-active', active); item.setAttribute('aria-selected', String(active)); }); selectedItem = null; selectedPhase = ''; $('#request').hidden = true; wizard.hidden = true; track.scrollLeft = 0; renderCards(); }));
  const renderWizard = () => {
    const station = categoryKey === 'stations';
    if (!selectedPhase) {
      wizardContent.innerHTML = `<p class="kicker">КРОК 1 · ФАЗНІСТЬ</p><h3>Оберіть фазність</h3><div class="wizard__choices"><button type="button" data-phase="single">1 ФАЗА</button><button type="button" data-phase="three">3 ФАЗИ</button></div>`;
      $$('[data-phase]', wizardContent).forEach((button) => button.addEventListener('click', () => { selectedPhase = button.dataset.phase; renderWizard(); })); return;
    }
    const phaseLabel = selectedPhase === 'single' ? '1 фаза' : selectedPhase === 'three' ? '3 фази' : '';
    const title = station ? `Підключення ${selectedItem.name}` : `Монтаж інвертора ${selectedItem.name} · ${phaseLabel}`;
    const price = station ? equipmentConfig.prices.station[selectedPhase] : equipmentConfig.prices.inverter;
    wizardContent.innerHTML = `<div class="wizard__result"><div><p class="kicker">${station ? 'РЕЗУЛЬТАТ' : 'КРОК 2 · РЕЗУЛЬТАТ'}</p><h3>${title}</h3><p class="muted">Вартість монтажу</p><strong class="wizard__price">${price}</strong><button type="button" class="btn btn--gold btn--lg" id="wizard-request">Оформити заявку →</button></div><img src="/img/equipment/${selectedItem.image}.svg?v=20261127-7" alt="${selectedItem.name}"></div>`;
    $('#wizard-request', wizardContent).addEventListener('click', () => {
      serviceInput.value = `${equipmentConfig.categories[categoryKey].label} · ${selectedItem.name}${phaseLabel ? ` · ${phaseLabel}` : ''}`;
      $('#f-message').value = `Прошу прорахувати ${title}. Орієнтовна вартість монтажу: ${price}.`;
      $('#request').hidden = false;
      $('#request').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => $('#f-name').focus({ preventScroll: true }), reduce ? 0 : 500);
    });
  };
  $('#wizard-back').addEventListener('click', () => { if (selectedPhase) { selectedPhase = ''; $('#request').hidden = true; renderWizard(); } else { wizard.hidden = true; selectedItem = null; } });
  $('#request-back').addEventListener('click', () => { $('#request').hidden = true; wizard.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }); });
  renderCards();
  window.addEventListener('resize', updateProgress, { passive: true });

  const lightbox = document.createElement('dialog');
  lightbox.className = 'gallery-lightbox';
  lightbox.innerHTML = '<button class="gallery-lightbox__close" type="button" aria-label="Закрити перегляд">×</button><img alt="Фото роботи у повному розмірі">';
  document.body.append(lightbox);
  const lightboxImage = $('img', lightbox);
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[data-lightbox]');
    if (!link) return;
    event.preventDefault();
    lightboxImage.src = link.href;
    lightboxImage.alt = link.querySelector('img')?.alt || 'Фото виконаної роботи';
    lightbox.showModal();
  });
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox || event.target.closest('.gallery-lightbox__close')) lightbox.close();
  });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && lightbox.open) lightbox.close(); });

  const MAX_FILES = 6;
  const MAX_SIDE = 1920;
  const QUALITY = 0.82;
  const MAX_TOTAL = 5.5 * 1024 * 1024; // stay within serverless request limits

  const input = $('#f-photos');
  const drop = $('#drop');
  const thumbs = $('#thumbs');
  const statusEl = $('#form-status');
  const submitBtn = $('#submit');
  const success = $('#form-success');
  /** @type {{id:number, file:File|null, ready:Promise<File|null>, url:string}[]} */
  let photos = [];
  let uid = 0;

  const setStatus = (msg, isError = false) => {
    statusEl.textContent = msg || '';
    statusEl.classList.toggle('is-error', Boolean(msg) && isError);
  };

  async function compress(file) {
    if (!file.type.startsWith('image/') && !/\.(heic|heif)$/i.test(file.name)) return null;
    try {
      const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
      const scale = Math.min(1, MAX_SIDE / Math.max(bmp.width, bmp.height));
      const w = Math.round(bmp.width * scale), h = Math.round(bmp.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      canvas.getContext('2d').drawImage(bmp, 0, 0, w, h);
      bmp.close?.();
      const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', QUALITY));
      if (!blob) throw new Error('encode');
      const name = file.name.replace(/\.[^.]+$/, '') + '.jpg';
      return new File([blob], name, { type: 'image/jpeg' });
    } catch {
      // Browser can't decode (e.g. HEIC outside Safari): send original if reasonably small.
      return file.size <= 4 * 1024 * 1024 ? file : null;
    }
  }

  function addFiles(list) {
    const files = [...list].filter((f) => f.type.startsWith('image/') || /\.(heic|heif)$/i.test(f.name));
    const room = MAX_FILES - photos.length;
    if (files.length > room) setStatus(`Можна додати не більше ${MAX_FILES} фото.`, true);
    else setStatus('');
    files.slice(0, Math.max(0, room)).forEach((file) => {
      const id = ++uid;
      const url = URL.createObjectURL(file);
      const li = document.createElement('li');
      li.className = 'thumb is-processing';
      li.dataset.id = String(id);
      li.innerHTML = `<img alt="" src="${url}"><button type="button" aria-label="Видалити фото">×</button>`;
      li.querySelector('img').alt = `Фото: ${file.name}`;
      li.querySelector('img').addEventListener('error', () => { li.querySelector('img').style.opacity = '0'; }, { once: true });
      thumbs.append(li);
      const entry = { id, file: null, url, ready: null };
      entry.ready = compress(file).then((f) => {
        entry.file = f;
        li.classList.remove('is-processing');
        if (!f) { li.remove(); photos = photos.filter((p) => p.id !== id); setStatus('Один із файлів не вдалося обробити — спробуйте JPG або PNG.', true); }
        return f;
      });
      photos.push(entry);
    });
  }

  thumbs.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const li = btn.closest('.thumb');
    const id = Number(li.dataset.id);
    const p = photos.find((x) => x.id === id);
    if (p) URL.revokeObjectURL(p.url);
    photos = photos.filter((x) => x.id !== id);
    li.remove();
  });

  input.addEventListener('change', () => { addFiles(input.files); input.value = ''; });
  ['dragenter', 'dragover'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('is-over'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('is-over'); }));
  drop.addEventListener('drop', (e) => { if (e.dataTransfer?.files) addFiles(e.dataTransfer.files); });

  // Validation
  const rules = {
    name: (v) => (v.trim().length >= 2 ? '' : 'Вкажіть ваше ім’я'),
    phone: (v) => (v.replace(/\D/g, '').length >= 9 ? '' : 'Вкажіть номер телефону, наприклад 073 073 20 72'),
    message: (v) => (v.trim().length >= 5 ? '' : 'Опишіть задачу кількома словами'),
  };
  const showError = (name, msg) => {
    const el = form.elements[name];
    const field = el.closest('.field');
    field.classList.toggle('has-error', Boolean(msg));
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    const err = $(`#err-${name}`);
    if (err) err.textContent = msg || '';
    if (err) el.setAttribute('aria-describedby', err.id);
  };
  Object.keys(rules).forEach((name) => {
    const el = form.elements[name];
    el.addEventListener('blur', () => { if (el.value) showError(name, rules[name](el.value)); });
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('has-error')) showError(name, rules[name](el.value)); });
  });
  // Light phone input hygiene
  form.elements.phone.addEventListener('input', (e) => {
    const t = e.target;
    const cleaned = t.value.replace(/[^\d+()\-\s]/g, '');
    if (cleaned !== t.value) t.value = cleaned;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setStatus('');
    let firstInvalid = null;
    for (const [name, rule] of Object.entries(rules)) {
      const msg = rule(form.elements[name].value);
      showError(name, msg);
      if (msg && !firstInvalid) firstInvalid = form.elements[name];
    }
    if (firstInvalid) { firstInvalid.focus(); return; }

    submitBtn.classList.add('is-loading');
    submitBtn.querySelector('.btn__text').textContent = photos.length ? 'Обробляємо фото…' : 'Надсилаємо…';

    try {
      const files = (await Promise.all(photos.map((p) => p.ready))).filter(Boolean);
      const fd = new FormData();
      ['name', 'phone', 'city', 'message', 'company', 'service'].forEach((k) => fd.append(k, form.elements[k].value));
      let total = 0, skipped = 0;
      for (const f of files) {
        if (total + f.size > MAX_TOTAL) { skipped++; continue; }
        total += f.size;
        fd.append('photos', f, f.name);
      }
      submitBtn.querySelector('.btn__text').textContent = 'Надсилаємо…';

      const res = await fetch('/api/lead', { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));

      if (res.status === 422 && data.errors) {
        Object.entries(data.errors).forEach(([k, v]) => showError(k, v));
        throw new Error('Перевірте правильність заповнення полів.');
      }
      if (!res.ok || !data.ok) throw new Error(data.error || 'Не вдалося надіслати заявку. Спробуйте ще раз або зателефонуйте нам.');

      form.reset();
      photos.forEach((p) => URL.revokeObjectURL(p.url));
      photos = [];
      thumbs.innerHTML = '';
      const note = success.querySelector('p');
      if (skipped || data.photosDelivered === false) {
        note.dataset.base = note.dataset.base || note.innerHTML;
        note.innerHTML = note.dataset.base + ' Частину фото не вдалося передати — надішліть їх, будь ласка, у Telegram.';
      } else if (note.dataset.base) {
        note.innerHTML = note.dataset.base;
      }
      success.hidden = false;
      success.querySelector('h3').setAttribute('tabindex', '-1');
      success.querySelector('h3').focus();
    } catch (err) {
      setStatus(err.message || 'Помилка мережі. Спробуйте ще раз.', true);
    } finally {
      submitBtn.classList.remove('is-loading');
      submitBtn.querySelector('.btn__text').textContent = 'Надіслати заявку';
    }
  });

  $('#form-again').addEventListener('click', () => {
    success.hidden = true;
    form.elements.name.focus();
  });
})();


