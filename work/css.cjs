const fs=require('fs');
fs.appendFileSync('public/assets/styles.css', `
/* Two-step equipment picker */
.equipment__brands { margin: -4px 0 24px; font-size: 14px; }
.model-picker { margin: 28px 0 20px; }
.model-picker__title { margin: 0 0 8px; font: 500 clamp(18px,2vw,22px)/1.3 var(--f-display); }
.model-picker__hint { margin: 0 0 16px; }
.model-options { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:14px; }
.model-options[hidden] { display:none; }
.model-card { min-width:0; padding:10px; border:1px solid var(--line); border-radius:var(--r-lg); background:var(--panel); color:var(--text); text-align:left; cursor:pointer; display:flex; flex-direction:column; gap:5px; transition:border-color .2s,transform .2s,box-shadow .2s; }
.model-card:hover,.model-card.is-selected { border-color:var(--gold); transform:translateY(-2px); box-shadow:0 12px 28px #0003; }
.model-card img { display:block; width:100%; aspect-ratio:3/2; object-fit:cover; border-radius:11px; background:#101720; }
.model-card__name { margin-top:5px; font:500 16px/1.3 var(--f-display); }
.model-card__caption { color:var(--text-2); font-size:13px; line-height:1.4; }
.price-panel #service-apply[aria-disabled="true"] { opacity:.55; }
.price-panel #service-price[hidden] { display:none; }
.form__note a { color:var(--gold); text-decoration:underline; text-underline-offset:3px; }
.contacts__actions svg { width:20px; height:20px; flex:0 0 auto; }
.privacy-dialog { width:min(680px,calc(100vw - 28px)); max-height:min(82vh,760px); padding:clamp(24px,5vw,40px); border:1px solid var(--line-2); border-radius:var(--r-lg); background:var(--graphite); color:var(--text); box-shadow:0 30px 90px #000b; }
.privacy-dialog::backdrop { background:#020406d9; backdrop-filter:blur(4px); }
.privacy-dialog h2 { max-width:90%; margin-bottom:22px; font:500 clamp(21px,4vw,28px)/1.25 var(--f-display); }
.privacy-dialog h3 { margin:22px 0 7px; font:500 17px/1.3 var(--f-display); }
.privacy-dialog__body { color:var(--text-2); }
.privacy-dialog__body p+p { margin-top:12px; }
.privacy-dialog__body a { color:var(--gold); }
.privacy-dialog__close { position:absolute; top:12px; right:12px; width:38px; height:38px; border:1px solid var(--line-2); border-radius:50%; background:var(--panel); color:var(--text); font-size:25px; cursor:pointer; }
@media(max-width:900px) { .model-options { grid-template-columns:repeat(3,minmax(0,1fr)); } }
@media(max-width:640px) { .model-options { grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; } .model-card { padding:8px; } .model-card__name { font-size:14px; } .model-card__caption { font-size:12px; } }
`);
