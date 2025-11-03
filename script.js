// Ruang Dokter v1.4.4 - all-in-one script
// by Agung Satria
// Features: profile overlay, konsul (S/O/P), GCS/TTV/SpO2, MAP/qSOFA/EWS, templates, history, calculators,
// autosave draft, copy (incl. copy without identity), export/import, feedback WA, theme toggle, footer,
// diagnosis multiline, populate form from history, template management, reset/profile edit.

// ---------- Helpers ----------
function qs(id){ return document.getElementById(id); }
function hasEl(id){ return !!qs(id); }
function getVal(id){ const e=qs(id); return e? (e.value||'') : ''; }
function setVal(id,v){ const e=qs(id); if(!e) return; if('value' in e) e.value = v; else e.textContent = v; }
function saveLocal(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} }
function loadLocal(k,d){ try{ const s = localStorage.getItem(k); return s? JSON.parse(s): d; }catch(e){ return d; } }
function el(tag, attrs={}){ const d=document.createElement(tag); for(const k in attrs) d.setAttribute(k, attrs[k]); return d; }

// ---------- Storage keys ----------
const STORAGE = {
  history: 'rd_history_v1',
  templates: 'rd_templates_v1',
  draft: 'rd_draft_v1',
  settings: 'rd_settings_v1',
  profile: 'rd_profile_v1'
};

let historyData = loadLocal(STORAGE.history, []);
let templates = loadLocal(STORAGE.templates, []);
let draft = loadLocal(STORAGE.draft, {});
let settings = loadLocal(STORAGE.settings, { theme: 'light' });

// ---------- Safer DOM ready ----------
document.addEventListener('DOMContentLoaded', ()=>{

  // ---------- footer ----------
  (function initFooter(){
    const footerEl = document.querySelector('footer.footer');
    if(footerEl) footerEl.innerHTML = `<div>© Ruang Dokter v1.4.4 — by Agung Satria</div><div>v1.4.4</div>`;
  })();

  // ---------- theme ----------
  function applyTheme(){
    if(settings.theme === 'dark'){
      document.documentElement.style.setProperty('--bg','#071022');
      document.documentElement.style.setProperty('--card','#0b1220');
      document.documentElement.style.setProperty('--text','#e6eef6');
      document.documentElement.style.setProperty('--muted','#9aa6b2');
      document.querySelectorAll('input,textarea,select').forEach(el=>{ el.style.background='var(--card)'; el.style.color='var(--text)'; el.style.borderColor='#1f2a37'; });
    } else {
      document.documentElement.style.removeProperty('--bg'); document.documentElement.style.removeProperty('--card');
      document.documentElement.style.removeProperty('--text'); document.documentElement.style.removeProperty('--muted');
      document.querySelectorAll('input,textarea,select').forEach(el=>{ el.style.background=''; el.style.color=''; el.style.borderColor=''; });
    }
  }
  applyTheme();
  if(qs('themeToggle')) qs('themeToggle').addEventListener('click', ()=>{
    settings.theme = settings.theme === 'light' ? 'dark' : 'light';
    saveLocal(STORAGE.settings, settings); applyTheme();
  });

 // ---------- Profile Overlay (fixed, safer) ----------
(function profileModuleFixed(){
  const STORAGE_KEY = STORAGE.profile;
  const overlay = qs('setupOverlay');
  const headerName = qs('headerNamaDokter');
  const btnSave = qs('setupSaveBtn');
  const btnSkip = qs('setupSkipBtn');
  const editBtn = qs('editProfileBtn');
  const resetBtn = qs('resetProfile');

  function loadProfile(){ return loadLocal(STORAGE_KEY, null); }
  function saveProfile(p){ saveLocal(STORAGE_KEY, p); }
  function applyProfileToUI(p){
    if(!p) return;
    // IMPORTANT: apply only to doctor/profile fields, NOT patient name
    if(qs('nama_dokter')) setVal('nama_dokter', p.nama_dokter || '');
    if(qs('rs')) setVal('rs', p.rs || '');
    if(qs('unit')) setVal('unit', p.unit || '');
    if(headerName) headerName.textContent = `${p.nama_dokter || ''}${p.rs ? ' — ' + p.rs : ''}${p.unit ? ' ('+p.unit+')':''}`;
  }

  function showOverlay(){ if(overlay){ overlay.classList.add('active'); overlay.style.display = 'flex'; } }
  function hideOverlay(){ if(overlay){ overlay.classList.remove('active'); overlay.style.display = 'none'; } }

  // init
  const existing = loadProfile();
  if(existing && existing.nama_dokter){
    applyProfileToUI(existing);
    hideOverlay();
  } else {
    showOverlay();
  }

  // Save button
  if(btnSave){
    btnSave.addEventListener('click', ()=>{
      const nama = (qs('setup_nama_dokter')?.value || '').trim();
      const rs = (qs('setup_rs')?.value || '').trim();
      const unit = (qs('setup_unit')?.value || '').trim();
      if(!nama || !rs || !unit){
        if(qs('setupErr')) qs('setupErr').style.display = 'block';
        return;
      }
      if(qs('setupErr')) qs('setupErr').style.display = 'none';
      const p = { nama_dokter: nama, rs: rs, unit: unit, saved_at: new Date().toISOString() };
      saveProfile(p);
      applyProfileToUI(p);
      hideOverlay();
    });
  }

  // Skip (if exists)
  if(btnSkip) btnSkip.addEventListener('click', ()=>{ hideOverlay(); });

  // Edit Profile (opens overlay and prefill)
  if(editBtn){
    editBtn.addEventListener('click', ()=>{
      const p = loadProfile() || {nama_dokter:'',rs:'',unit:''};
      if(qs('setup_nama_dokter')) qs('setup_nama_dokter').value = p.nama_dokter || '';
      if(qs('setup_rs')) qs('setup_rs').value = p.rs || '';
      if(qs('setup_unit')) qs('setup_unit').value = p.unit || '';
      showOverlay();
    });
  }

  // Reset profile
  if(resetBtn) resetBtn.addEventListener('click', ()=>{
    if(confirm('Reset profil dokter?')){ localStorage.removeItem(STORAGE_KEY); alert('Profil terhapus. Silakan reload halaman.'); location.reload(); }
  });

  // Ensure overlay click outside closes (but only when active)
  if(overlay){
    overlay.addEventListener('click', (e)=>{
      if(e.target === overlay){
        // do not auto close if no profile exists yet (force setup) — only close if profile exists
        const p = loadProfile();
        if(p && p.nama_dokter) hideOverlay();
      }
    });
  }
})();

  // ---------- Basic field list & autosave ----------
  const FIELDS = ['nama_dokter','rs','unit','nama','usia','jk','bb','dx','s','gcsE','gcsV','gcsM','td','hr','rr','temp','spo2','o2type','o2flow','kepala','thorax','abdomen','ekstremitas','pemeriksaan_lain','p'];

  // restore draft
  (function restoreDraft(){
    draft = loadLocal(STORAGE.draft, {});
    for(const k in draft){ if(qs(k)) qs(k).value = draft[k]; }
    // show bb if usia <18
    onAgeChange();
  })();

  // autosave indicator
  let lastAuto = null;
  function showAutosave(){
    lastAuto = new Date();
    if(qs('autosaveIndicator')) qs('autosaveIndicator').textContent = `Autosaved ${new Date().toLocaleTimeString()}`;
  }

  // attach input listeners for autosave
  FIELDS.forEach(id=>{
    if(!qs(id)) return;
    qs(id).addEventListener('input', ()=>{
      draft[id] = getVal(id);
      saveLocal(STORAGE.draft, draft);
      showAutosave();
      if(['gcsE','gcsV','gcsM','td','hr','rr','temp','spo2'].includes(id)) computeVitals();
      if(id === 'usia') onAgeChange();
    });
  });

  // ---------- Age -> BB row ----------
  function onAgeChange(){
    const us = parseFloat(String(getVal('usia')).replace(',','.')) || 0;
    if(hasEl('bbRow')) { if(us && us < 18) qs('bbRow').classList.remove('hidden-row'); else qs('bbRow').classList.add('hidden-row'); }
  }
  onAgeChange();

  // ---------- Vitals & scores ----------
  function safeNum(v){ const n = parseFloat(String(v||'').replace(',','.')); return isNaN(n)? null : n; }
  function computeMapFromTd(td){
    if(!td || !td.includes('/')) return null;
    const parts = td.split('/').map(x=>safeNum(x));
    if(parts.length<2 || parts.some(x=>x===null)) return null;
    return Math.round((parts[0] + 2*parts[1])/3);
  }
  function parseGcsTotal(){ const e = safeNum(getVal('gcsE'))||0; const v = safeNum(getVal('gcsV'))||0; const m = safeNum(getVal('gcsM'))||0; const sum = e+v+m; return sum>0? sum : null; }
  function computeQSOFA(rr,gcsTotal,sbp){ let score=0; if(rr!==null && rr>=22) score++; if(gcsTotal!==null && gcsTotal<15) score++; if(sbp!==null && sbp<=100) score++; return score; }
  function calcEwsFromInputs(rr, sp, hr, t, gcs){ let score=0; if(rr!==null){ if(rr>=25) score+=3; else if(rr>=21) score+=2; else if(rr>=12) score+=0; else if(rr>=9) score+=1; else score+=3;} if(sp!==null){ if(sp<=91) score+=3; else if(sp<=93) score+=2; else if(sp<=95) score+=1;} if(hr!==null){ if(hr<=40) score+=3; else if(hr<=50) score+=1; else if(hr<=90) score+=0; else if(hr<=110) score+=1; else if(hr<=130) score+=2; else score+=3;} if(t!==null){ if(t<=35) score+=3; else if(t<=36) score+=1; else if(t<=38) score+=0; else if(t<=39) score+=1; else score+=2;} if(gcs && gcs<15) score+=3; return score; }

  function interpretEws(score){ if(score>=7) return {label:'Kritis', cls:'ews-bad', advice:'Pertimbangkan intervensi segera/rujuk ke ICU'}; if(score>=5) return {label:'Perhatian', cls:'ews-warn', advice:'Monitor ketat, evaluasi ulang terapi'}; return {label:'Normal', cls:'ews-good', advice:'Observasi rutin'}; }

  function computeVitals(){
    const td = getVal('td')||'';
    const hr = safeNum(getVal('hr'));
    const rr = safeNum(getVal('rr'));
    const temp = safeNum(getVal('temp'));
    const spo2 = safeNum(getVal('spo2'));
    const gcsTotal = parseGcsTotal();
    const map = computeMapFromTd(td);
    const sbp = td.includes('/')? safeNum(td.split('/')[0]) : null;
    const qsofa = computeQSOFA(rr, gcsTotal, sbp);
    const ews = calcEwsFromInputs(rr, spo2, hr, temp, gcsTotal||15);
    const interp = interpretEws(ews);
    if(hasEl('map_qsofa')) setVal('map_qsofa', (map?`MAP: ${map}`:'') + (qsofa?` qSOFA: ${qsofa}`:''));
    if(hasEl('ews_box')) qs('ews_box').innerHTML = `<div class="${interp.cls}">EWS: ${ews} — ${interp.label}</div><div class="muted">${interp.advice}</div>`;
    return {map,qsofa,ews,interp};
  }
  ['gcsE','gcsV','gcsM','td','hr','rr','temp','spo2'].forEach(id=>{ if(qs(id)) qs(id).addEventListener('input', computeVitals); });

  // o2flow visibility
  if(qs('o2type')) qs('o2type').addEventListener('change', ()=>{ const v=getVal('o2type'); if(v==='RA' || !v) { if(qs('o2flow')) qs('o2flow').style.display='none'; setVal('o2flow',''); } else if(qs('o2flow')) qs('o2flow').style.display='inline-block'; });
  (function initO2(){ if(qs('o2flow')){ if(getVal('o2type')==='RA') qs('o2flow').style.display='none'; }} )();

  // ---------- Build output (correct order: GCS -> TTV -> SpO2 -> (enter) -> phys -> P) ----------
  function buildOutput(includeIdentity=true){
    // greeting
    const h=new Date().getHours();
    let greeting='Selamat malam dokter.';
    if(h>=4 && h<11) greeting='Selamat pagi dokter.'; else if(h>=11 && h<15) greeting='Selamat siang dokter.'; else if(h>=15 && h<18) greeting='Selamat sore dokter.';

    const namaDok = getVal('nama_dokter');
    const unit = getVal('unit');
    const rs = getVal('rs');
    const nama = getVal('nama');
    const usia = getVal('usia');
    const jk = getVal('jk');
    const bb = getVal('bb');
    const pref = (usia && parseFloat(usia)<18)? 'An.' : (jk==='F'?'Ny.':(jk==='M'?'Tn.':'')); 
    const ident = includeIdentity ? `${pref?pref+' ':''}${nama}\n${usia?usia+' tahun':''}${(bb && pref==='An.')? ', BB '+bb+' kg' : ''}` : '';

    const dx = getVal('dx')||'-';
    const s = getVal('s')||'-';
    const gcs = `GCS: E${getVal('gcsE')||'-'}V${getVal('gcsV')||'-'}M${getVal('gcsM')||'-'}`;
    let o = `${gcs}\n`;
    if(getVal('td')) o += `TD: ${getVal('td')}\n`;
    if(getVal('hr')) o += `HR: ${getVal('hr')}\n`;
    if(getVal('rr')) o += `RR: ${getVal('rr')}\n`;
    if(getVal('temp')) o += `T: ${getVal('temp')}\n`;
    if(getVal('spo2')){
      const o2t = getVal('o2type')||'RA';
      const o2f = getVal('o2flow')||'';
      const lpm = (o2t==='RA' || !o2t) ? 'room air' : (o2f? `${o2f} LPM` : o2t);
      o += `SpO₂: ${getVal('spo2')}% ${lpm}\n`;
    }
    o += `\n`; // blank line before phys

    const kepala = getVal('kepala') || 'Kepala: CA -/-, SI -/-';
    const thorax = getVal('thorax') || 'Thorax: ves +/+, rh -/-, wh -/-. BJ reg, m -, g -.';
    const abdomen = getVal('abdomen') || 'Abdomen: supel, BU +';
    const ekstremitas = getVal('ekstremitas') || 'Ekstremitas: akral hangat, CRT <2s';
    let pemeriksaan = `${kepala}\n${thorax}\n${abdomen}\n${ekstremitas}\n`;
    const tambahan = getVal('pemeriksaan_lain');
    if(tambahan) pemeriksaan += `${tambahan}\n`;

    const plan = getVal('p') || '-';

    const headerLine = includeIdentity ? `${greeting}\nIzin dok dengan ${namaDok}, dokter jaga ${unit} ${rs}.\nIzin konsul pasien dokter.\n\n${ident}\n\n` : `${greeting}\nIzin konsul pasien dokter.\n\n`;

    const output = `${headerLine}Dx: ${dx}\n\nS: ${s}\n\nO:\n${o}${pemeriksaan}\nP:\n${plan}\n\nMohon advice selanjutnya.\nTerima kasih dokter.`;
    return output;
  }

  // ---------- Buttons: buat/copy/save/reset ----------
  if(qs('buatBtn')) qs('buatBtn').addEventListener('click', ()=>{ if(hasEl('hasil')) setVal('hasil', buildOutput(true)); computeVitals(); });
  if(qs('copyBtn')) qs('copyBtn').addEventListener('click', ()=> navigator.clipboard.writeText(buildOutput(true)).then(()=> alert('Teks konsul tersalin.')));
  if(qs('copyNoIdBtn')) qs('copyNoIdBtn').addEventListener('click', ()=> navigator.clipboard.writeText(buildOutput(false)).then(()=> alert('Teks konsul (tanpa identitas) tersalin.')));
  if(qs('resetBtn')) qs('resetBtn').addEventListener('click', ()=>{
    const defaults = {kepala:'',thorax:'',abdomen:'',ekstremitas:''};
    FIELDS.forEach(id=>{ if(qs(id)) setVal(id,''); });
    // restore default phys text if desired
    setVal('kepala', defaults.kepala);
    setVal('thorax', defaults.thorax);
    setVal('abdomen', defaults.abdomen);
    setVal('ekstremitas', defaults.ekstremitas);
    draft = {}; saveLocal(STORAGE.draft, draft);
    if(hasEl('hasil')) setVal('hasil','');
    computeVitals();
    onAgeChange();
  });

  if(qs('saveBtn')) qs('saveBtn').addEventListener('click', ()=>{
    const snapshot = {}; FIELDS.forEach(k=> snapshot[k] = getVal(k));
    const profileSnap = loadLocal(STORAGE.profile, null);
    const item = { id: 'h_'+Date.now(), created_at: new Date().toISOString(), name: snapshot['nama']||'(no name)', age: snapshot['usia']||'', dx: snapshot['dx']||'', text: buildOutput(true), snapshot, profile_snapshot: profileSnap, done:false, note:'' };
    historyData.unshift(item); saveLocal(STORAGE.history, historyData);
    // reset after save
    if(hasEl('resetBtn')) qs('resetBtn').click();
    renderHistory();
    alert('Tersimpan ke history.');
  });

  // ---------- History rendering ----------
  function renderHistory(){
    const c = qs('historyList'); if(!c) return;
    const filter = getVal('historyFilter') || 'all'; const q = getVal('historySearch') || '';
    c.innerHTML = '';
    let list = historyData.slice();
    if(filter==='done') list = list.filter(h=>h.done); else if(filter==='undone') list = list.filter(h=>!h.done);
    if(q) list = list.filter(h => (h.name||'').toLowerCase().includes(q.toLowerCase()) || (h.dx||'').toLowerCase().includes(q.toLowerCase()));
    if(list.length===0){ c.innerHTML = '<div class="muted">Belum ada history.</div>'; return; }
    list.forEach(h=>{
      const item = document.createElement('div'); item.className = 'history-item';
      const left = document.createElement('div'); left.style.flex='1';
      left.innerHTML = `<strong>${h.name||'-'} — ${h.age||'-'} th</strong><div class="muted">${h.dx||''}</div><div class="muted">${new Date(h.created_at).toLocaleString()}</div>${h.done?'<div style="color:#10b981;font-size:12px">✅ Selesai</div>':''}`;
      const right = document.createElement('div'); right.style.display='flex'; right.style.flexDirection='column'; right.style.gap='6px';
      const top = document.createElement('div'); top.style.display='flex'; top.style.gap='6px';

      const btnView = document.createElement('button'); btnView.className='btn small outline'; btnView.textContent='View';
      btnView.addEventListener('click', ()=>{ if(h.snapshot){ Object.keys(h.snapshot).forEach(k=>{ if(qs(k)) setVal(k, h.snapshot[k]); } ); if(qs('o2type')) qs('o2type').dispatchEvent(new Event('change')); if(hasEl('hasil')) setVal('hasil', h.text); } else if(h.text) populateFormFromText(h.text); document.querySelector('[data-tab="konsul"]').click(); window.scrollTo({top:0,behavior:'smooth'}); });

      const btnCopy = document.createElement('button'); btnCopy.className='btn small'; btnCopy.textContent='Copy'; btnCopy.addEventListener('click', ()=> navigator.clipboard.writeText(h.text).then(()=> alert('Teks konsul tersalin dari history.')));
      const btnDone = document.createElement('button'); btnDone.className='btn small'; btnDone.textContent = h.done? 'Selesai':'Mark Selesai'; if(h.done) btnDone.style.background='#10b981';
      btnDone.addEventListener('click', ()=>{ h.done=!h.done; saveLocal(STORAGE.history, historyData); renderHistory(); });
      const btnDel = document.createElement('button'); btnDel.className='btn small secondary'; btnDel.textContent='Hapus'; btnDel.addEventListener('click', ()=>{ if(confirm('Hapus entry ini?')){ historyData = historyData.filter(x=>x.id!==h.id); saveLocal(STORAGE.history, historyData); renderHistory(); }});

      top.appendChild(btnView); top.appendChild(btnCopy); top.appendChild(btnDone); top.appendChild(btnDel);
      const note = document.createElement('input'); note.placeholder='Keterangan tambahan...'; note.value = h.note || ''; note.addEventListener('change', ()=>{ h.note = note.value; saveLocal(STORAGE.history, historyData); });
      right.appendChild(top); right.appendChild(note);
      item.appendChild(left); item.appendChild(right);
      c.appendChild(item);
    });
  }
  // filters/search events
  if(qs('historyFilter')) qs('historyFilter').addEventListener('change', renderHistory);
  if(qs('historySearch')) qs('historySearch').addEventListener('input', renderHistory);

  renderHistory();

  // ---------- Templates ----------
  function renderTemplates(){ const c = qs('templateList'); if(!c) return; c.innerHTML = ''; if(!templates.length) { c.innerHTML = '<div class="muted">Belum ada template.</div>'; return; } templates.forEach((t,i)=>{ const div = document.createElement('div'); div.className='history-item'; div.innerHTML = `<div style="flex:1"><strong>${t.title}</strong><div class="muted">${t.dx||''}</div></div>`; const btnUse = document.createElement('button'); btnUse.className='btn small'; btnUse.textContent='Gunakan'; btnUse.addEventListener('click', ()=>{ if(qs('dx')) setVal('dx', t.dx||t.title||''); if(qs('kepala')) setVal('kepala', t.phys||''); if(qs('thorax')) setVal('thorax',''); if(qs('abdomen')) setVal('abdomen',''); if(qs('ekstremitas')) setVal('ekstremitas',''); if(qs('p')) setVal('p', t.plan||''); document.querySelector('[data-tab="konsul"]').click(); }); const btnEdit = document.createElement('button'); btnEdit.className='btn small outline'; btnEdit.textContent='Edit'; btnEdit.addEventListener('click', ()=>{ if(qs('templateTitle')) setVal('templateTitle', t.title); if(qs('templateDx')) setVal('templateDx', t.dx); if(qs('templatePhys')) setVal('templatePhys', t.phys); if(qs('templatePlan')) setVal('templatePlan', t.plan); templates.splice(i,1); saveLocal(STORAGE.templates, templates); renderTemplates(); }); const btnDel = document.createElement('button'); btnDel.className='btn small secondary'; btnDel.textContent='Hapus'; btnDel.addEventListener('click', ()=>{ if(confirm('Hapus template ini?')){ templates.splice(i,1); saveLocal(STORAGE.templates, templates); renderTemplates(); } }); div.appendChild(btnUse); div.appendChild(btnEdit); div.appendChild(btnDel); c.appendChild(div); }); }
  if(qs('addTemplate')) qs('addTemplate').addEventListener('click', ()=>{ const title = (getVal('templateTitle')||'').trim(); const dx = (getVal('templateDx')||'').trim(); const phys = (getVal('templatePhys')||'').trim(); const plan = (getVal('templatePlan')||'').trim(); if(!title){ alert('Isi judul template.'); return; } templates.unshift({id:'t_'+Date.now(), title, dx, phys, plan}); saveLocal(STORAGE.templates, templates); ['templateTitle','templateDx','templatePhys','templatePlan'].forEach(id=> setVal(id,'')); renderTemplates(); });
  if(qs('clearTemplates')) qs('clearTemplates').addEventListener('click', ()=>{ if(confirm('Hapus semua template?')){ templates=[]; saveLocal(STORAGE.templates, templates); renderTemplates(); } });
  renderTemplates();

  // ---------- Calculators ----------
  if(qs('calc_bmi')) qs('calc_bmi').addEventListener('click', ()=>{ const bb=safeNum(getVal('calc_bb')), tb=safeNum(getVal('calc_tb')); if(!bb||!tb){ if(hasEl('bmi_res')) setVal('bmi_res','Masukkan BB & TB'); return; } const m=tb/100; const bmi=bb/(m*m); let cat='Normal'; if(bmi<18.5) cat='Underweight'; else if(bmi<25) cat='Normal'; else if(bmi<30) cat='Overweight'; else cat='Obese'; if(hasEl('bmi_res')) setVal('bmi_res', `BMI: ${bmi.toFixed(1)} (${cat})`); });
  if(qs('calc_map')) qs('calc_map').addEventListener('click', ()=>{ const s=safeNum(getVal('map_sys')), d=safeNum(getVal('map_dia')); if(s===null||d===null){ if(hasEl('map_res')) setVal('map_res','Masukkan TD'); return; } const map=(s+2*d)/3; if(hasEl('map_res')) setVal('map_res',`MAP: ${map.toFixed(1)} mmHg`); });
  if(qs('calc_ews')) qs('calc_ews').addEventListener('click', ()=>{ const rr=safeNum(getVal('ews_rr'))||0, sp=safeNum(getVal('ews_spo2'))||0, hr=safeNum(getVal('ews_hr'))||0, t=safeNum(getVal('ews_temp'))||0, gcs=parseInt(getVal('ews_gcs'))||15; const score = calcEwsFromInputs(rr,sp,hr,t,gcs); const interp = interpretEws(score); if(hasEl('ews_res')) setVal('ews_res', `EWS: ${score} — ${interp.label}\n${interp.advice}`); });
  if(qs('calc_bsa')) qs('calc_bsa').addEventListener('click', ()=>{ const bb=safeNum(getVal('bsa_bb')), tb=safeNum(getVal('bsa_tb')); if(!bb||!tb){ if(hasEl('bsa_res')) setVal('bsa_res','Masukkan BB & TB'); return; } const bsa = Math.sqrt((bb*tb)/3600); if(hasEl('bsa_res')) setVal('bsa_res', `BSA: ${bsa.toFixed(2)} m²`); });
  if(qs('calc_ag')) qs('calc_ag').addEventListener('click', ()=>{ const na=safeNum(getVal('ag_na')), cl=safeNum(getVal('ag_cl')), hco3=safeNum(getVal('ag_hco3')); if(na===null||cl===null||hco3===null){ if(hasEl('ag_res')) setVal('ag_res','Masukkan Na/Cl/HCO3'); return; } if(hasEl('ag_res')) setVal('ag_res', `Anion gap: ${(na-(cl+hco3)).toFixed(1)}`); });
  if(qs('calc_gfr')) qs('calc_gfr').addEventListener('click', ()=>{ const age=safeNum(getVal('gfr_age')), sex=getVal('gfr_sex'), scr=safeNum(getVal('gfr_scr')); if(!age||!scr){ if(hasEl('gfr_res')) setVal('gfr_res','Masukkan umur & kreatinin'); return; } const k = sex==='F'?0.7:0.9; const a = sex==='F'?-0.329:-0.411; const minScr_k = Math.min(scr/k,1); const maxScr_k = Math.max(scr/k,1); const egfr = 141*Math.pow(minScr_k,a)*Math.pow(maxScr_k,-1.209)*Math.pow(0.993,age)*(sex==='F'?1.018:1); if(hasEl('gfr_res')) setVal('gfr_res', `eGFR (estimasi): ${Math.round(egfr)} mL/min/1.73m²`); });

  // ---------- Import/Export ----------
  if(qs('exportJson')) qs('exportJson').addEventListener('click', ()=>{ try{ const blob = new Blob([JSON.stringify(historyData,null,2)],{type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='ruangdokter_history.json'; a.click(); }catch(e){ alert('Gagal export'); } });
  if(qs('importBtn')) qs('importBtn').addEventListener('click', ()=>{ if(qs('importFile')) qs('importFile').click(); });
  if(hasEl('importFile')) qs('importFile').addEventListener('change', (ev)=>{ const f = ev.target.files && ev.target.files[0]; if(!f) return; const fr = new FileReader(); fr.onload = (e)=>{ try{ const parsed = JSON.parse(e.target.result); if(Array.isArray(parsed)){ historyData = parsed.concat(historyData); saveLocal(STORAGE.history, historyData); renderHistory(); alert('Restore selesai.'); } else alert('File JSON tidak valid.'); } catch(err){ alert('File JSON tidak valid.'); } }; fr.readAsText(f); });

  // ---------- Populate from text (fallback) ----------
  function populateFormFromText(text){
    if(!text) return;
    try{
      const lines = text.split('\n').map(l=>l.trim());
      // simple parsing to extract GCS, TD, HR, RR, T, SpO2, kepala/thorax/abdomen/ekstremitas, P block
      const gcsLine = lines.find(l=>/GCS:\s*E\d+V\d+M\d+/i.test(l));
      if(gcsLine){ const m=gcsLine.match(/E(\d+)V(\d+)M(\d+)/i); if(m){ if(qs('gcsE')) setVal('gcsE', m[1]); if(qs('gcsV')) setVal('gcsV', m[2]); if(qs('gcsM')) setVal('gcsM', m[3]); } }
      const tdLine = lines.find(l=>/^TD:/i.test(l)); if(tdLine && qs('td')) setVal('td', tdLine.replace(/^TD:\s*/i,''));
      const hrLine = lines.find(l=>/^HR:/i.test(l)); if(hrLine && qs('hr')) setVal('hr', hrLine.replace(/^HR:\s*/i,''));
      const rrLine = lines.find(l=>/^RR:/i.test(l)); if(rrLine && qs('rr')) setVal('rr', rrLine.replace(/^RR:\s*/i,''));
      const tLine = lines.find(l=>/^T:/i.test(l)); if(tLine && qs('temp')) setVal('temp', tLine.replace(/^T:\s*/i,''));
      const spoLine = lines.find(l=>/SpO/i); if(spoLine && qs('spo2')){ const m = spoLine.match(/(\d+)%/); if(m) setVal('spo2', m[1]); const o2m = spoLine.match(/(NC|NRM|VENT|room air|RA)/i); if(o2m && qs('o2type')) setVal('o2type', o2m[1]); const lpm = spoLine.match(/(\d+)\s*LPM/i); if(lpm && qs('o2flow')) setVal('o2flow', lpm[1]); }
      // physical blocks
      const kepalaLine = lines.find(l=>/^Kepala:/i.test(l)); if(kepalaLine && qs('kepala')) setVal('kepala', kepalaLine.replace(/^Kepala:\s*/i,''));
      const thoraxLine = lines.find(l=>/^Thorax:/i.test(l)); if(thoraxLine && qs('thorax')) setVal('thorax', thoraxLine.replace(/^Thorax:\s*/i,''));
      const abdLine = lines.find(l=>/Abdomen:|Abd:/i); if(abdLine && qs('abdomen')) setVal('abdomen', abdLine.replace(/^Abd(enom)?:\s*/i,''));
      const ekstLine = lines.find(l=>/^Ekst(remitas)?:/i); if(ekstLine && qs('ekstremitas')) setVal('ekstremitas', ekstLine.replace(/^Ekst(remitas)?:\s*/i,''));
      computeVitals(); onAgeChange();
    } catch(e){ console.warn('parse error', e); }
  }

  // ---------- Feedback WA ----------
  const feedbackBtn = qs('feedbackBtn'); const feedbackModal = qs('feedbackModal'); const waLink = qs('waLink'); const fbClose = qs('fbClose');
  if(feedbackBtn && feedbackModal && waLink){ feedbackBtn.addEventListener('click', ()=>{ feedbackModal.style.display='flex'; waLink.href = `https://wa.me/6281717427171?text=${encodeURIComponent('Halo Ruang Dokter! Saya ingin memberikan saran/masukan: ')}`; }); }
  if(fbClose && feedbackModal) fbClose.addEventListener('click', ()=> feedbackModal.style.display='none');
  if(feedbackModal) feedbackModal.addEventListener('click', e=>{ if(e.target===feedbackModal) feedbackModal.style.display='none'; });

  // ---------- Export / Reset data ----------
  if(qs('clearAllData')) qs('clearAllData').addEventListener('click', ()=>{ if(confirm('Hapus semua history & template?')){ historyData=[]; templates=[]; saveLocal(STORAGE.history, historyData); saveLocal(STORAGE.templates, templates); renderHistory(); renderTemplates(); alert('Data dihapus.'); } });

  // ---------- small utilities ----------
  computeVitals();

  // initial render
  renderHistory();
  renderTemplates();

}); // end DOMContentLoaded
