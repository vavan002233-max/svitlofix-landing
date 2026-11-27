const fs=require('fs'), path=require('path');
const p='public/assets/app.js'; let s=fs.readFileSync(p,'utf8');
const begin=s.indexOf('  const serviceData = {'); const end=s.indexOf('\n\n  const lightbox',begin); if(begin<0||end<0) throw new Error('service block not found');
const data=`  // Edit model prices and copy in this catalog. Prices are indicative installation starting prices.
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
  });`;
s=s.slice(0,begin)+data+s.slice(end);
// Make empty message optional on client; add privacy and click analytics, successful lead event and photo note.
s=s.replace("    message: (v) => (v.trim().length >= 5 ? '' : 'Опишіть задачу кількома словами'),\n",'');
s=s.replace("  const year = $('#year');",`  // Analytics events are forwarded to GA4 (if configured) and GTM via dataLayer.
  const track = (name, params = {}) => { window.dataLayer = window.dataLayer || []; window.dataLayer.push({event:name,...params}); if (typeof window.gtag === 'function') window.gtag('event',name,params); };
  document.addEventListener('click', (event) => {
    const contact = event.target.closest('[data-contact], a[href^="tel:"]');
    if (contact) track('contact_click',{contact_method:contact.dataset.contact || 'phone'});
    const privacyLink = event.target.closest('[data-open-privacy]');
    if (privacyLink) { event.preventDefault(); $('#privacy')?.showModal(); }
  });
  const privacy = $('#privacy');
  privacy?.addEventListener('click',(event)=>{if(event.target===privacy||event.target.closest('.privacy-dialog__close'))privacy.close();});

  const year = $('#year');`);
s=s.replace("note.innerHTML = note.dataset.base + ' Частину фото не вдалося передати — надішліть їх, будь ласка, у Telegram.';", "note.innerHTML = note.dataset.base + ' Фото краще надіслати нам у месенджер або додати під час розмови.';");
s=s.replace("      success.hidden = false;", "      track('lead_submit_success',{photos_count:files.length-skipped,photos_delivered:data.photosDelivered!==false});\n      success.hidden = false;");
fs.writeFileSync(p,s);
// Backend optional message fallback.
p='functions/api/lead.js';s=fs.readFileSync(p,'utf8').replace("  const message = clean(form.get('message'), 3000);","  const message = clean(form.get('message'), 3000) || 'Запит на консультацію / попередній прорахунок';").replace("  if (message.length < 5) errors.message = 'Опишіть задачу кількома словами';\n",'');fs.writeFileSync(p,s);
