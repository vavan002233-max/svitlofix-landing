const fs=require('fs');let p='public/assets/app.js',s=fs.readFileSync(p,'utf8');
const start=s.indexOf('  const serviceData = {'), end=s.indexOf('\n\n  const lightbox',start);if(start<0||end<0)throw new Error('Old equipment chooser not found');
const logic=`  // Edit product names, image paths and installation prices in this single config object.
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
    activeCategory=tab.dataset.equipmentTab; selectedItem=null; selectedPhase=''; flow.hidden=true;
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
    flow.hidden=true;selectedItem=null;selectedPhase='';
    $$('.equipment-card',trackEl).forEach(item=>{item.classList.remove('is-selected');item.setAttribute('aria-pressed','false');});
    $('#equipment').scrollIntoView({behavior:'smooth',block:'start'});
  });
  $('#flow-apply').addEventListener('click',()=>{
    if(!selectedItem)return;
    const category=equipmentConfig.categories[activeCategory];
    serviceInput.value=(category.kind==='inverter'?'Монтаж інвертора ':'Підключення ')+selectedItem.name+(selectedPhase?' · '+selectedPhase:'');
  });`;
s=s.slice(0,start)+logic+s.slice(end);
// Optional description client validation and event/reporting.
s=s.replace("    message: (v) => (v.trim().length >= 5 ? '' : 'Опишіть задачу кількома словами'),\n",'');
s=s.replace("        note.innerHTML = note.dataset.base + ' Частину фото не вдалося передати — надішліть їх, будь ласка, у Telegram.';", "        note.innerHTML = note.dataset.base + ' Фото краще надіслати нам у месенджер або додати під час розмови.';");
s=s.replace('      success.hidden = false;',"      track('lead_submit_success',{photos_count:files.length-skipped,photos_delivered:data.photosDelivered!==false});\n      success.hidden = false;");
fs.writeFileSync(p,s);
// Match the server validator to the optional description and set its Telegram fallback.
p='functions/api/lead.js';s=fs.readFileSync(p,'utf8').replace("  const message = clean(form.get('message'), 3000);","  const message = clean(form.get('message'), 3000) || 'Запит на консультацію / попередній прорахунок';").replace("  if (message.length < 5) errors.message = 'Опишіть задачу кількома словами';\n",'');fs.writeFileSync(p,s);
