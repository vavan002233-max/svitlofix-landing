const fs=require('fs');fs.appendFileSync('public/assets/styles.css', `
/* Equipment chooser carousel and result flow */
.equipment-tabs { display:flex; gap:10px; margin:28px 0 18px; padding:6px; width:max-content; max-width:100%; border:1px solid var(--line-2); border-radius:999px; background:rgba(8,11,16,.55); overflow-x:auto; }
.equipment-tab { border:0; border-radius:999px; padding:12px 20px; background:transparent; color:var(--text-2); font:500 14px var(--f-body); white-space:nowrap; cursor:pointer; transition:background .2s,color .2s; }
.equipment-tab.is-active { background:var(--gold); color:#17130a; }
.equipment-carousel { display:grid; grid-template-columns:46px minmax(0,1fr) 46px; gap:12px; align-items:center; }
.carousel-arrow { display:grid; place-items:center; width:44px; height:44px; border:1px solid var(--line-2); border-radius:50%; background:var(--panel); color:var(--gold); font-size:30px; line-height:1; cursor:pointer; transition:border-color .2s,background .2s; }
.carousel-arrow:hover { border-color:var(--gold); background:var(--gold-soft); }
.equipment-track { display:flex; gap:16px; min-width:0; overflow-x:auto; padding:10px 2px 14px; scroll-snap-type:x mandatory; scroll-behavior:smooth; overscroll-behavior-x:contain; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
.equipment-track::-webkit-scrollbar { display:none; }
.equipment-card { flex:0 0 clamp(180px,22vw,245px); min-width:0; padding:10px; border:1px solid var(--line); border-radius:var(--r-lg); background:linear-gradient(180deg,var(--panel),var(--graphite)); color:var(--text); text-align:left; cursor:pointer; scroll-snap-align:start; transition:border-color .2s,transform .2s,box-shadow .2s; }
.equipment-card:hover,.equipment-card.is-selected { border-color:var(--gold); transform:translateY(-2px); box-shadow:0 14px 34px #0004; }
.equipment-card img { display:block; width:100%; aspect-ratio:1.6; object-fit:cover; border-radius:11px; background:#111a27; }
.equipment-card span { display:block; padding:12px 5px 5px; font:500 16px/1.3 var(--f-display); }
.carousel-progress { height:3px; margin:2px 58px 28px; border-radius:4px; background:var(--line-2); overflow:hidden; }
.carousel-progress span { display:block; height:100%; width:0; border-radius:inherit; background:var(--gold); transition:width .15s linear; }
.equipment-flow { margin:12px 0 42px; padding:clamp(20px,4vw,36px); border:1px solid var(--line-2); border-radius:var(--r-lg); background:linear-gradient(135deg,rgba(226,180,75,.055),transparent 45%),var(--graphite); }
.equipment-flow[hidden],.flow-phase[hidden],.flow-result[hidden] { display:none; }
.flow-back { margin:0 0 20px; padding:8px 0; border:0; background:transparent; color:var(--gold); font:500 14px var(--f-body); cursor:pointer; }
.flow-phase h3 { margin:8px 0 18px; font:500 clamp(21px,3vw,28px)/1.25 var(--f-display); }
.phase-options { display:flex; flex-wrap:wrap; gap:12px; }
.phase-option { min-width:150px; padding:16px 24px; border:1px solid var(--line-2); border-radius:12px; background:var(--panel); color:var(--text); font:600 14px var(--f-mono); cursor:pointer; }
.phase-option:hover,.phase-option.is-selected { border-color:var(--gold); background:var(--gold-soft); color:var(--gold); }
.flow-result { display:grid; grid-template-columns:minmax(180px, .8fr) minmax(0,1.2fr); align-items:center; gap:clamp(20px,5vw,48px); }
.flow-result img { display:block; width:100%; aspect-ratio:1.6; object-fit:cover; border:1px solid var(--line); border-radius:14px; background:#111a27; }
.flow-result h3 { margin:8px 0 8px; font:500 clamp(20px,3vw,28px)/1.3 var(--f-display); }
.flow-price { display:block; margin:16px 0 20px; color:var(--gold); font:600 clamp(24px,3vw,32px)/1.2 var(--f-display); }
.privacy-dialog { width:min(680px,calc(100vw - 28px)); max-height:min(82vh,760px); padding:clamp(24px,5vw,40px); border:1px solid var(--line-2); border-radius:var(--r-lg); background:var(--graphite); color:var(--text); }
.privacy-dialog::backdrop { background:#020406d9; backdrop-filter:blur(4px); }
.privacy-dialog h2 { margin:0 0 20px; font:500 25px/1.25 var(--f-display); }
.privacy-dialog h3 { margin:20px 0 7px; font:500 17px var(--f-display); }
.privacy-dialog__body { color:var(--text-2); }
.privacy-dialog__body p+p { margin-top:12px; }
.privacy-dialog__body a,.form__note a { color:var(--gold); }
.privacy-dialog__close { position:absolute; top:12px; right:12px; width:36px; height:36px; border:1px solid var(--line-2); border-radius:50%; background:var(--panel); color:var(--text); font-size:24px; cursor:pointer; }
.contacts__actions svg { flex:0 0 auto; width:20px; height:20px; }
@media(max-width:700px) { .equipment-carousel { grid-template-columns:36px minmax(0,1fr) 36px; gap:8px; } .carousel-arrow { width:36px; height:36px; font-size:26px; } .equipment-card { flex-basis:68vw; max-width:250px; } .carousel-progress { margin-left:44px; margin-right:44px; } .flow-result { grid-template-columns:1fr; } .flow-result img { max-width:420px; } }
@media(max-width:520px) { .equipment-tabs { width:100%; border-radius:14px; display:grid; grid-template-columns:1fr; } .equipment-tab { white-space:normal; text-align:left; } .equipment-card { flex-basis:78vw; } .phase-option { flex:1; min-width:120px; } }
`);
