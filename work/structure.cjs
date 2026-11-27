const fs=require('fs');
const file='public/index.html'; let s=fs.readFileSync(file,'utf8');
// Swap whole marked section blocks while retaining their unique section IDs.
const servicesStart=s.indexOf('    <!-- 2. SERVICES -->');
const equipmentStart=s.indexOf('    <!-- 3. EQUIPMENT -->');
const processStart=s.indexOf('    <!-- 4. PROCESS -->');
if(servicesStart<0||equipmentStart<0||processStart<0)throw new Error('Section markers are missing');
const services=s.slice(servicesStart,equipmentStart), equipment=s.slice(equipmentStart,processStart);
s=s.slice(0,servicesStart)+equipment+services+s.slice(processStart);
s=s.replace('<!-- 3. EQUIPMENT -->','<!-- 1. EQUIPMENT -->').replace('<!-- 2. SERVICES -->','<!-- 2. SERVICES -->');
s=s.replace('<a href="#services">Послуги</a>\n        <a href="#equipment">Обладнання</a>','<a href="#equipment">Підбір обладнання</a>\n        <a href="#services">Послуги</a>');
s=s.replace('<span class="mono">/ 02</span> Обладнання та бренди','<span class="mono">/ 01</span> Підбір обладнання та вартість');
s=s.replace('<span class="mono">/ 01</span> Послуги','<span class="mono">/ 02</span> Послуги');
s=s.replace('<span class="mono">/ 04</span> Як ми працюємо','<span class="mono">/ 03</span> Як ми працюємо');
s=s.replace('<span class="mono">/ 05</span> Переваги','<span class="mono">/ 04</span> Переваги');
s=s.replace('<span class="mono">/ 06</span> Наші роботи','<span class="mono">/ 05</span> Наші роботи');
s=s.replace('<span class="mono">/ 07</span> Питання','<span class="mono">/ 06</span> Питання');
s=s.replace('<span class="mono">/ 08</span> Контакти','<span class="mono">/ 07</span> Контакти');
// Replace old single-level chooser and price block before the request form.
const equipmentBodyStart=s.indexOf('        <div class="service-options"');
const requestStart=s.indexOf('        <div class="equipment-request"',equipmentBodyStart);
if(equipmentBodyStart<0||requestStart<0)throw new Error('Equipment block is missing');
const newPicker=`        <div class="equipment-tabs" role="tablist" aria-label="Категорія обладнання">
          <button class="equipment-tab is-active" id="tab-inverters" type="button" role="tab" aria-selected="true" aria-controls="equipment-carousel" data-equipment-tab="inverters">Інвертори та системи накопичення</button>
          <button class="equipment-tab" id="tab-stations" type="button" role="tab" aria-selected="false" aria-controls="equipment-carousel" data-equipment-tab="stations">Портативні зарядні станції</button>
        </div>
        <div class="equipment-carousel" aria-label="Оберіть обладнання">
          <button class="carousel-arrow" id="equipment-prev" type="button" aria-label="Прокрутити вліво">‹</button>
          <div class="equipment-track" id="equipment-track" role="tabpanel" aria-labelledby="tab-inverters" tabindex="0"></div>
          <button class="carousel-arrow" id="equipment-next" type="button" aria-label="Прокрутити вправо">›</button>
        </div>
        <div class="carousel-progress" role="progressbar" aria-label="Прокрутка каруселі" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><span id="carousel-progress-fill"></span></div>
        <section class="equipment-flow" id="equipment-flow" aria-live="polite" hidden>
          <button class="flow-back" id="flow-back" type="button" aria-label="Повернутися до вибору обладнання">← Назад до обладнання</button>
          <div class="flow-phase" id="flow-phase" hidden><p class="kicker">КРОК 1 · ІНВЕРТОР</p><h3>Оберіть фазність</h3><div class="phase-options"><button type="button" class="phase-option" data-phase="1 фаза">1 ФАЗА</button><button type="button" class="phase-option" data-phase="3 фази">3 ФАЗИ</button></div></div>
          <div class="flow-result" id="flow-result" hidden><img id="flow-image" src="" alt="Обране обладнання"><div><p class="kicker">ВАШ ВИБІР</p><h3 id="flow-summary"></h3><p class="muted" id="flow-detail"></p><strong class="flow-price" id="flow-price"></strong><a class="btn btn--gold btn--lg" id="flow-apply" href="#lead-form">Оформити заявку →</a></div></div>
        </section>
`;
s=s.slice(0,equipmentBodyStart)+newPicker+s.slice(requestStart);
// The service field carries the whole selected configuration to the existing API / Telegram message.
s=s.replace('<input type="hidden" name="service" id="f-service" value="Інвертор">','<input type="hidden" name="service" id="f-service" value="">');
s=s.replace('<label for="f-message">Опис задачі *</label><textarea id="f-message" name="message" rows="3" required maxlength="3000"','<label for="f-message">Опис задачі <span class="muted">(необов’язково)</span></label><textarea id="f-message" name="message" rows="3" maxlength="3000"');
s=s.replace('<span class="mono">/ 03</span> Прорахунок і заявка','<span class="mono">/ 01</span> Заявка');
s=s.replace('Натискаючи кнопку, ви погоджуєтеся на обробку контактних даних.','Натискаючи кнопку, ви погоджуєтеся на обробку даних за <a href="#privacy" data-open-privacy>Політикою конфіденційності</a>.');
// Add Google tag setup location and privacy modal.
s=s.replace('  <script>document.documentElement.classList.add("js")</script>','  <script>document.documentElement.classList.add("js")</script>\n  <!-- Google tag / GTM: insert the chosen provider snippet and replace its measurement/container ID. -->');
s=s.replace('            <a class="btn btn--ghost btn--lg" href="#equipment">Залишити заявку</a>',`            <!-- Viber uses the same business number already shown on this page; change its international number here if needed. -->
            <a class="btn btn--ghost btn--lg" href="viber://chat?number=%2B380730732072" data-contact="viber"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5c3.2-1.6 7.8-1.4 10.2.8 2.7 2.4 2.7 7.2 1 10.2l.7 3.5-3.6-1.1c-3.5 1.1-7.7.1-9.7-2.5C3.5 12.7 4 7 7 4.5Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M8.2 7.5c.3 4.1 2.5 6.5 6.5 7.1m-5.4-7c.2.8.6 1.4 1.1 1.8m2.1 2.3c.5.4 1.2.7 2 .8" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>Написати у Viber</a>
            <a class="btn btn--ghost btn--lg" href="#equipment">Залишити заявку</a>`);
s=s.replace('      <p class="muted mono">© <span id="year">2026</span> SvitloFix</p>','      <p class="muted mono">© <span id="year">2026</span> SvitloFix</p>\n      <a href="#privacy" data-open-privacy>Політика конфіденційності</a>');
s=s.replace('  <script src="/assets/app.js" defer></script>',`  <dialog class="privacy-dialog" id="privacy" aria-labelledby="privacy-title"><button class="privacy-dialog__close" type="button" aria-label="Закрити">×</button><h2 id="privacy-title">Політика конфіденційності</h2><div class="privacy-dialog__body"><p>SvitloFix обробляє дані, надані через форму сайту для звернень щодо послуг у Києві та Київській області.</p><h3>Дані та мета</h3><p>Ми отримуємо ім’я, телефон, населений пункт, опис задачі та фото, які ви додаєте. Ім’я й телефон потрібні, щоб відповісти на заявку, уточнити потреби, підготувати консультацію чи попередній прорахунок. Дані заявки передаються до Telegram для опрацювання звернення.</p><h3>Зберігання та звернення</h3><p>Доступ до даних надається лише для опрацювання звернення. Дані зберігаються стільки, скільки потрібно для цієї мети або вимагає законодавство. Щодо доступу, виправлення чи видалення даних звертайтеся за телефоном <a href="tel:+380730732072" data-contact="phone">073 073 20 72</a>.</p><p>Надсилаючи форму, ви підтверджуєте, що ознайомилися з цією політикою.</p></div></dialog>
  <script src="/assets/app.js" defer></script>`);
fs.writeFileSync(file,s);
