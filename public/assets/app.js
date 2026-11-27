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

  // Edit product names, image paths and installation prices in this single config object.
  const equipmentConfig = {
    prices: { inverter: 'від 10 000 грн', station: 'від 6 000 грн' },
    categories: {
      inverters: { label: 'Інвертори та системи накопичення', kind: 'inverter', items: [
        {name:'Deye',image:'deye.svg'},{name:'Solis',image:'solis.svg'},{name:'Must',image:'must.svg'},{name:'Growatt',image:'growatt.svg'},{name:'Victron',image:'victron.svg'},{name:'LuxPower',image:'luxpower.svg'},{name:'HYXiPOWER',image:'hyxipower.svg'},{name:'Felicity',image:'felicity.svg'},{name:'Інші',image:'inverter-other.svg'}
      ]},
      stations: { label: 'Портативні зарядні станції', kind: 'station', items: [
        {name:'EcoFlow Delta 2',image:'ecoflow-delta-2.svg'},{name:'EcoFlow Delta 3',image:'ecoflow-delta-3.svg'},{name:'EcoFlow Delta Pro',image:'ecoflow-delta-pro.svg'},{name:'Marstek Venus',image:'marstek-venus.svg'},{name:'Інші',image:'station-other.svg'}
      ]}
    }
  };
  const track = (name, params = {}) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:name,...params});
    if (typeof window.gtag === 'function') window.gtag('event',name,params);
  };
  document.addEventListener('click',(event)=>{
    const link=event.target.closest('[data-contact],a[href^="tel:"]');
    if(link)track('contact_click',{contact_method:link.dataset.contact||'phone'});
    const privacyLink=event.target.closest('[data-open-privacy]');
    if(privacyLink){event.preventDefault();$('#privacy')?.showModal();}
  });
  const privacyDialog=$('#privacy');
  privacyDialog?.addEventListener('click',(event)=>{if(event.target===privacyDialog||event.target.closest('.privacy-dialog__close'))privacyDialog.close();});

  const trackEl=$('#equipment-track'), progress=$('#carousel-progress-fill'), progressBox=$('.carousel-progress');
  const tabs=$$('.equipment-tab'); const flow=$('#equipment-flow'), phaseScreen=$('#flow-phase'), resultScreen=$('#flow-result');
  const serviceInput=$('#f-service'); let activeCategory='inverters', selectedItem=null, selectedPhase='';
  const renderCarousel=()=>{
    const category=equipmentConfig.categories[activeCategory];
    trackEl.setAttribute('aria-labelledby',activeCategory==='inverters'?'tab-inverters':'tab-stations');
    trackEl.innerHTML=category.items.map((item,index)=>'<button class="equipment-card" type="button" data-equipment-index="'+index+'" aria-pressed="false"><img src="/img/equipment/'+item.image+'" width="480" height="300" alt="Ілюстрація обладнання '+item.name+'" loading="lazy"><span>'+item.name+'</span></button>').join('');
    updateProgress();
  };
  const updateProgress=()=>{
    const max=trackEl.scrollWidth-trackEl.clientWidth;
    const value=max>0?trackEl.scrollLeft/max:1;
    progress.style.width=(value*100)+'%'; progressBox.setAttribute('aria-valuenow',String(Math.round(value*100)));
  };
  renderCarousel();
  trackEl.addEventListener('scroll',updateProgress,{passive:true});
  $('#equipment-prev').addEventListener('click',()=>trackEl.scrollBy({left:-Math.max(220,trackEl.clientWidth*.72),behavior:'smooth'}));
  $('#equipment-next').addEventListener('click',()=>trackEl.scrollBy({left:Math.max(220,trackEl.clientWidth*.72),behavior:'smooth'}));
  tabs.forEach(tab=>tab.addEventListener('click',()=>{
    activeCategory=tab.dataset.equipmentTab; selectedItem=null; selectedPhase=''; serviceInput.value=''; flow.hidden=true;
    tabs.forEach(t=>{const on=t===tab;t.classList.toggle('is-active',on);t.setAttribute('aria-selected',String(on));});
    trackEl.scrollLeft=0; renderCarousel();
  }));
  const showResult=(detail,price)=>{
    const category=equipmentConfig.categories[activeCategory];
    const summary=category.kind==='inverter'?'Монтаж інвертора '+selectedItem.name+' · '+selectedPhase:'Підключення '+selectedItem.name;
    $('#flow-image').src='/img/equipment/'+selectedItem.image;
    $('#flow-image').alt='Обране обладнання: '+selectedItem.name;
    $('#flow-summary').textContent=summary; $('#flow-detail').textContent=detail;
    $('#flow-price').textContent=price; resultScreen.hidden=false; phaseScreen.hidden=true; flow.hidden=false;
    serviceInput.value=summary+(detail?' · '+detail:'');
  };
  trackEl.addEventListener('click',(event)=>{
    const card=event.target.closest('[data-equipment-index]'); if(!card)return;
    selectedItem=equipmentConfig.categories[activeCategory].items[Number(card.dataset.equipmentIndex)]; selectedPhase='';
    $$('.equipment-card',trackEl).forEach(item=>{const on=item===card;item.classList.toggle('is-selected',on);item.setAttribute('aria-pressed',String(on));});
    flow.hidden=false; resultScreen.hidden=true;
    if(equipmentConfig.categories[activeCategory].kind==='inverter'){
      phaseScreen.hidden=false; serviceInput.value='';
      $('#flow-phase').scrollIntoView({behavior:'smooth',block:'center'});
    }else{
      showResult('',equipmentConfig.prices.station);
      flow.scrollIntoView({behavior:'smooth',block:'center'});
    }
  });
  $$('.phase-option').forEach(button=>button.addEventListener('click',()=>{
    selectedPhase=button.dataset.phase; $$('.phase-option').forEach(item=>item.classList.toggle('is-selected',item===button));
    showResult('',equipmentConfig.prices.inverter); flow.scrollIntoView({behavior:'smooth',block:'center'});
  }));
  $('#flow-back').addEventListener('click',()=>{
    const kind=equipmentConfig.categories[activeCategory].kind;
    if(kind==='inverter'&&!resultScreen.hidden){resultScreen.hidden=true;phaseScreen.hidden=false;selectedPhase='';serviceInput.value='';return;}
    flow.hidden=true;selectedItem=null;selectedPhase='';serviceInput.value='';
    $('.equipment-card',trackEl).forEach(item=>{item.classList.remove('is-selected');item.setAttribute('aria-pressed','false');});
    $('#equipment').scrollIntoView({behavior:'smooth',block:'start'});
  });
  $('#flow-apply').addEventListener('click',()=>{
    if(!selectedItem)return;
    const category=equipmentConfig.categories[activeCategory];
    serviceInput.value=(category.kind==='inverter'?'Монтаж інвертора ':'Підключення ')+selectedItem.name+(selectedPhase?' · '+selectedPhase:'');
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


