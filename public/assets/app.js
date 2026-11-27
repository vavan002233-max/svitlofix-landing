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

  // Analytics events are forwarded to GA4 (if configured) and GTM via dataLayer.
  const track = (name, params = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({event:name,...params}); if (typeof window.gtag === 'function') window.gtag('event',name,params); };
  document.addEventListener('click', (event) => {
    const contact = event.target.closest('[data-contact], a[href^="tel:"]');
    if (contact) track('contact_click',{contact_method:contact.dataset.contact || 'phone'});
    const privacyLink = event.target.closest('[data-open-privacy]');
    if (privacyLink) { event.preventDefault(); $('#privacy')?.showModal(); }
  });
  const privacy = $('#privacy');
  privacy?.addEventListener('click',(event)=>{if(event.target===privacy||event.target.closest('.privacy-dialog__close'))privacy.close();});

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- Lead form ---------- */
  const form = $('#lead-form');
  if (!form) return;

  // Edit model prices and copy in this catalog. Prices are indicative installation starting prices.
  const catalog = {
    'Інвертор': [
      {id:'deye',name:'Deye',caption:'Гібридний одно- та трифазний',price:'від 12 000 грн',desc:'Монтаж гібридного інвертора Deye, підключення АКБ, захисту й налаштування системи.',art:'hybrid'},
      {id:'solis',name:'Solis',caption:'Гібридні рішення для дому',price:'від 12 000 грн',desc:'Встановлення інвертора Solis, підключення резервних ліній і перевірка роботи.',art:'inverter'},
      {id:'victron',name:'Victron Energy',caption:'Модульні системи живлення',price:'від 14 000 грн',desc:'Монтаж і налаштування системи Victron з урахуванням потужності та потрібної автономності.',art:'inverter'},
      {id:'hyxipower',name:'HYXiPOWER',caption:'Гібридні одно- та трифазні',price:'від 12 000 грн',desc:'Монтаж гібридного рішення HYXiPOWER, підключення обладнання та налаштування застосунку.',art:'hybrid'},
      {id:'must',name:'MUST',caption:'Резервне живлення будинку',price:'від 10 000 грн',desc:'Встановлення інвертора MUST, комутація резервних груп і перевірка перемикання.',art:'inverter'},
      {id:'felicity-inverter',name:'Felicity Solar',caption:'Інверторні системи',price:'від 11 000 грн',desc:'Монтаж і налаштування системи Felicity Solar із сумісними акумуляторами.',art:'hybrid'},
      {id:'three-phase',name:'Трифазне рішення',caption:'Для трифазної мережі',price:'від 16 000 грн',desc:'Підключення трифазного інвертора, узгодження резервних ліній і перевірка фаз.',art:'hybrid'},
    ],
    'Система накопичення енергії': [
      {id:'marstek-venus',name:'Marstek Venus-E V3',caption:'5.12 kWh · накопичення енергії',price:'від 6 000 грн',desc:'Підключення Marstek Venus-E V3 до домашньої мережі та налаштування системи.',art:'battery'},
      {id:'rack-lv',name:'Стійкова LiFePO4',caption:'Низьковольтна система 48 V',price:'від 6 000 грн',desc:'Монтаж стійкових низьковольтних батарей, DC-захисту та зв’язку BMS.',art:'rack'},
      {id:'felicity-battery',name:'Felicity Solar',caption:'Модульна LiFePO4 батарея',price:'від 6 000 грн',desc:'Встановлення та підключення батареї Felicity Solar із перевіркою сумісності.',art:'battery'},
      {id:'pylontech',name:'Pylontech',caption:'Стійкові модулі з BMS',price:'від 6 000 грн',desc:'Збирання системи Pylontech, підключення до інвертора та перевірка обміну даними.',art:'rack'},
      {id:'deye-battery',name:'Deye BOS',caption:'Високовольтна LiFePO4 система',price:'від 8 000 грн',desc:'Монтаж високовольтної батарейної системи Deye, комунікацій і системного захисту.',art:'battery'},
      {id:'hv-stack',name:'Високовольтна система',caption:'Модульна батарейна вежа',price:'від 8 000 грн',desc:'Підключення сумісної високовольтної батареї та налаштування з інвертором.',art:'rack'},
    ],
    'EcoFlow': [
      {id:'river',name:'EcoFlow RIVER',caption:'Компактна портативна станція',price:'від 6 000 грн',desc:'Підключення EcoFlow RIVER до вибраних домашніх ліній через окремий ввід.',art:'station'},
      {id:'delta',name:'EcoFlow DELTA',caption:'Домашній резерв під ключ',price:'від 6 000 грн',desc:'Інтеграція EcoFlow DELTA у домашню мережу з перемикачем і резервними лініями.',art:'station'},
      {id:'delta-extra',name:'DELTA + додаткова батарея',caption:'Збільшений запас енергії',price:'від 7 000 грн',desc:'Підключення станції EcoFlow DELTA з додатковою батареєю та налаштування резерву.',art:'station'},
    ],
  };
  const serviceInput = $('#f-service');
  const modelOptions = $('#model-options');
  const modelHint = $('#model-picker-hint');
  const serviceApply = $('#service-apply');
  let selectedCategory = '';
  let selectedModel = null;
  const showModelPrice = () => {
    const ready = Boolean(selectedCategory && selectedModel);
    $('#service-title').textContent = ready ? selectedModel.name : 'Вартість монтажу';
    $('#service-description').textContent = ready ? selectedModel.desc : 'Оберіть модель або варіант вище, щоб побачити вартість монтажу.';
    $('#service-price').textContent = ready ? selectedModel.price : '';
    $('#service-price').hidden = !ready;
    serviceApply.setAttribute('aria-disabled', String(!ready));
    if (ready) serviceInput.value = selectedCategory + ' — ' + selectedModel.name + ' (' + selectedModel.caption + ')';
    else serviceInput.value = '';
  };
  const chooseCategory = (category) => {
    selectedCategory = category;
    selectedModel = null;
    $$('.service-card').forEach((card) => {
      const active = card.dataset.service === category;
      card.classList.toggle('is-selected', active);
      card.setAttribute('aria-pressed', String(active));
    });
    modelHint.textContent = 'Оберіть конкретну модель або тип рішення. Вартість монтажу з’явиться після вибору.';
    modelOptions.innerHTML = catalog[category].map((model) => '<button class="model-card" type="button" data-model="' + model.id + '" aria-pressed="false"><img src="/img/models/' + model.id + '.svg" width="480" height="320" alt="Ілюстрація: ' + model.name + '"><span class="model-card__name">' + model.name + '</span><span class="model-card__caption">' + model.caption + '</span></button>').join('');
    modelOptions.hidden = false;
    showModelPrice();
  };
  $$('.service-card').forEach((card) => card.addEventListener('click', () => chooseCategory(card.dataset.service)));
  modelOptions.addEventListener('click', (event) => {
    const card = event.target.closest('[data-model]');
    if (!card) return;
    selectedModel = catalog[selectedCategory].find((model) => model.id === card.dataset.model);
    $$('.model-card', modelOptions).forEach((item) => { const active = item === card; item.classList.toggle('is-selected', active); item.setAttribute('aria-pressed', String(active)); });
    showModelPrice();
  });
  serviceApply.addEventListener('click', (event) => {
    if (!selectedModel) { event.preventDefault(); $('#model-picker-title').scrollIntoView({behavior:'smooth',block:'center'}); return; }
    serviceInput.value = selectedCategory + ' — ' + selectedModel.name + ' (' + selectedModel.caption + ')';
  });

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
        note.innerHTML = note.dataset.base + ' Фото краще надіслати нам у месенджер або додати під час розмови.';
      } else if (note.dataset.base) {
        note.innerHTML = note.dataset.base;
      }
      track('lead_submit_success',{photos_count:files.length-skipped,photos_delivered:data.photosDelivered!==false});
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


