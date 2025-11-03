// Ruang Dokter v1.3 - full implementation
// Ruang Dokter - script.js (consolidated, careful & defensive)
// Version: v1.4.3 patched
// by Agung Satria
//
// Copy-paste seluruh file ini menggantikan script.js yang sekarang.
// Hard-refresh (Ctrl+F5) setelah mengganti file.

// --- Helpers -----------------------------------------------------------------
function qs(id){ return document.getElementById(id); }
function addEvent(id, evt, fn){
  const el = qs(id);
  if(el) el.addEventListener(evt, fn);
}
function getVal(id){
  const el = qs(id);
  if(!el) return '';
  return (typeof el.value === 'string') ? el.value : (el.textContent || '');
}
function setVal(id, v){
  const el = qs(id);
  if(!el) return;
  if('value' in el) el.value = v;
  else el.textContent = v;
}
function show(id){ const el = qs(id); if(el) el.style.display = ''; }
function hide(id){ const el = qs(id); if(el) el.style.display = 'none'; }
function hasEl(id){ return !!qs(id); }

// --- Storage keys -----------------------------------------------------------
const STORAGE_KEYS = {
  history: 'rd_history_v1',
  templates: 'rd_templates_v1',
  draft: 'rd_draft_v1',
  settings: 'rd_settings_v1'
};
function load(key, def){ try{ const s = localStorage.getItem(key); return s? JSON.parse(s): def; } catch(e){ return def; } }
function save(key, val){ try{ localStorage.setItem(key, JSON.stringify(val)); } catch(e){ /* ignore */ } }

let historyData = load(STORAGE_KEYS.history, []);
let templates = load(STORAGE_KEYS.templates, []);
let draft = load(STORAGE_KEYS.draft, {});
let settings = load(STORAGE_KEYS.settings, { theme: 'light' });

// --- Init on DOM ready ------------------------------------------------------
document.addEventListener('DOMContentLoaded', ()=>{
  const namaDokter = document.getElementById('namaDokter');
  const lokasi = document.getElementById('lokasi');
  const namaRS = document.getElementById('namaRS');
  const namaPasien = document.getElementById('namaPasien');
  const usia = document.getElementById('usia');
  const bbRow = document.getElementById('bbRow');
  const bb = document.getElementById('bb');
  const jk = document.getElementById('jk');
  const dx = document.getElementById('dx');
  const s = document.getElementById('s');
  const gcsE = document.getElementById('gcsE');
  const gcsV = document.getElementById('gcsV');
  const gcsM = document.getElementById('gcsM');
  const td = document.getElementById('td');
  const hr = document.getElementById('hr');
  const rr = document.getElementById('rr');
  const temp = document.getElementById('temp');
  const spo2 = document.getElementById('spo2');
  const o2type = document.getElementById('o2type');
  const o2flow = document.getElementById('o2flow');
  const kepala = document.getElementById('kepala');
  const thorax = document.getElementById('thorax');
  const abdomen = document.getElementById('abdomen');
  const ekstremitas = document.getElementById('ekstremitas');
  const lain = document.getElementById('lain');
  const oField = document.getElementById('o');
  const p = document.getElementById('p');
  const hasil = document.getElementById('hasil');
  const buatBtn = document.getElementById('buatBtn');
  const copyBtn = document.getElementById('copyBtn');
  const aiQuickBtn = document.getElementById('aiQuickBtn');
  const saveBtn = document.getElementById('saveBtn');
  const resetBtn = document.getElementById('resetBtn');
  const historyEl = document.getElementById('history');
  const templateSelect = document.getElementById('templateSelect');
  const applyTemplate = document.getElementById('applyTemplate');
  const addTemplate = document.getElementById('addTemplate');
  const manageTemplate = document.getElementById('manageTemplate');
  const manageTemplates = document.getElementById('manageTemplates');
  const templateList = document.getElementById('templateList');
  const warningsEl = document.getElementById('warnings');
  const ewsBadge = document.getElementById('ewsBadge');
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settings');
  const closeSet = document.getElementById('closeSet');
  const saveSet = document.getElementById('saveSet');
  const setNama = document.getElementById('setNama');
  const setRS = document.getElementById('setRS');
  const setPrefix = document.getElementById('setPrefix');
  const setShift = document.getElementById('setShift');
  const logoImg = document.getElementById('logoImg');
  const themeToggle = document.getElementById('themeToggle');

  const STORAGE_KEY = 'rd_v1_3_full';
  const HISTORY_KEY = 'rd_hist_v1_3_full';
  const TEMPLATES_KEY = 'rd_tpl_v1_3_full';
  const SETTINGS_KEY = 'rd_settings_v1_3_full';

  function saveSettingsObj(o){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(o)); }
  function loadSettingsObj(){ return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}'); }

  function loadSettings(){
    const s = loadSettingsObj();
    if(s.nama) namaDokter.value = s.nama;
    if(s.rs) namaRS.value = s.rs;
    if(s.prefix==='off') setPrefix.value = 'off'; else setPrefix.value='on';
    if(s.theme==='dark') document.documentElement.classList.add('dark');
    if(s.theme==='dark') logoImg.src = 'logo_dark.png'; else logoImg.src = 'logo_light.png';
    setNama.value = s.nama || '';
    setRS.value = s.rs || '';
    setShift.value = s.shifts || '3';
  }
  loadSettings();

  function autosave(){
    const data = {
      namaDokter: namaDokter.value, lokasi: lokasi.value, namaRS: namaRS.value,
      namaPasien: namaPasien.value, usia: usia.value, jk: jk.value, bb: bb.value, dx: dx.value, s: s.value,
      gcsE: gcsE.value, gcsV: gcsV.value, gcsM: gcsM.value,
      td: td.value, hr: hr.value, rr: rr.value, temp: temp.value, spo2: spo2.value, o2type: o2type.value, o2flow: o2flow.value,
      kepala: kepala.value, thorax: thorax.value, abdomen: abdomen.value, ekstremitas: ekstremitas.value, lain: lain.value,
      o: oField.value, p: p.value
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function loadDraft(){
    const d = JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
    if(Object.keys(d).length===0) return;
    Object.entries(d).forEach(([k,v])=>{
      if(document.getElementById(k)) document.getElementById(k).value = v;
    });
  // ensure footer text (author)
  const footer = qs('footer');
  if(footer && footer.classList && footer.classList.contains('footer')){
    footer.innerHTML = `<div>© Ruang Dokter v1.4.3 — by Agung Satria</div><div>v1.4.3</div>`;
}
  loadDraft();

  if(!(kepala.value && kepala.value.trim())){
    kepala.value = 'CA -/-, SI -/-';
  }
  if(!(thorax.value && thorax.value.trim())){
    thorax.value = 'ves +/+, rh -/-, wh -/-. BJ reg, m -, g -';
  }
  if(!(abdomen.value && abdomen.value.trim())){
    abdomen.value = 'supel, BU +';
  }
  if(!(ekstremitas.value && ekstremitas.value.trim())){
    ekstremitas.value = 'akral hangat, CRT <2s';
  // theme toggle
  function applyTheme(){
    if(settings.theme === 'dark'){
      document.documentElement.style.setProperty('--bg','#071022');
      document.documentElement.style.setProperty('--card','#0b1220');
      document.documentElement.style.setProperty('--text','#e6eef6');
      document.documentElement.style.setProperty('--muted','#9aa6b2');
      // ensure inputs readable
      document.querySelectorAll('input, textarea, select').forEach(el=>{
        el.style.background = 'var(--card)';
        el.style.color = 'var(--text)';
        el.style.borderColor = '#1f2a37';
      });
    } else {
      document.documentElement.style.removeProperty('--bg');
      document.documentElement.style.removeProperty('--card');
      document.documentElement.style.removeProperty('--text');
      document.documentElement.style.removeProperty('--muted');
      document.querySelectorAll('input, textarea, select').forEach(el=>{
        el.style.background = '';
        el.style.color = '';
        el.style.borderColor = '';
      });
    }
}
  applyTheme();
  addEvent('themeToggle','click', ()=>{
    settings.theme = settings.theme === 'light' ? 'dark' : 'light';
    save(STORAGE_KEYS.settings, settings);
    applyTheme();
  });

  setInterval(autosave, 5000);

  usia.addEventListener('input', ()=>{
    const val = parseFloat(usia.value);
    if(!isNaN(val) && val < 18 && val >= 0) bbRow.style.display = 'block';
    else bbRow.style.display = 'none';
  // Tabs
  document.querySelectorAll('.tabbtn').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      document.querySelectorAll('.tab').forEach(t=> t.style.display = 'none');
      document.querySelectorAll('.tabbtn').forEach(b=> b.classList.remove('active'));
      const tab = btn.getAttribute('data-tab');
      const el = qs(tab);
      if(el) el.style.display = 'block';
      btn.classList.add('active');
    });
});

  function parseSystolic(tdStr){
    if(!tdStr) return null;
    const m = tdStr.toString().match(/(\d+)\s*\/?\s*(\d+)?/);
    if(m){
      return parseInt(m[1],10);
  // Field list (consistent with HTML)
  const FIELDS = [
    'nama_dokter','rs','unit','nama','usia','jk','bb',
    'dx','s',
    'gcsE','gcsV','gcsM','td','hr','rr','temp',
    'spo2','o2type','o2flow',
    'kepala','thorax','abdomen','ekstremitas','pemeriksaan_lain',
    'p'
  ];

  // restore draft if any
  (function restoreDraft(){
    const keys = Object.keys(draft||{});
    keys.forEach(k=>{ if(qs(k)) setVal(k, draft[k]); });
  })();

  // show/hide BB for pediatrics
  function onAgeChange(){
    const us = getVal('usia');
    const age = parseFloat(String(us).replace(',','.')) || 0;
    if(hasEl('bbRow')){
      if(age && age < 18) show('bbRow'); else hide('bbRow');
}
    const n = parseInt(tdStr,10);
    return isNaN(n)? null : n;
}

  function smartLabel(label, fieldValue){
    const v = (fieldValue||'').trim();
    if(!v) return null;
    const re = new RegExp('^\\s*' + label + '\\s*[:\-]', 'i');
    if(re.test(v)) return v;
    return label + ': ' + v;
  }

  function buildObjective(){
    const parts = [];
    const ge = (gcsE.value||'').trim(), gv = (gcsV.value||'').trim(), gm = (gcsM.value||'').trim();
    if(ge||gv||gm) parts.push('GCS: E'+(ge||'-')+'V'+(gv||'-')+'M'+(gm||'-'));

    if(td.value) parts.push('TD: '+td.value+' mmHg');
    if(hr.value) parts.push('HR: '+hr.value+' x/m');
    if(rr.value) parts.push('RR: '+rr.value+' x/m');
    if(temp.value) parts.push('T: '+temp.value+' °C');

    const sp = (spo2.value||'').toString().trim();
    if(sp){
      const type = o2type.value;
      const flow = (o2flow.value||'').toString().trim();
      if(type==='RA'){
        parts.push('SpO₂: '+sp+'% room air');
      } else if(type==='VENT'){
        let extras = [];
        if(flow) extras.push('FiO₂ '+flow+'%');
        const ex = extras.length? ' ('+extras.join(', ')+')': '';
        parts.push('SpO₂: '+sp+'% on ventilator'+ex);
      } else if(type==='VM' || type==='HFNC'){
        if(flow) parts.push('SpO₂: '+sp+'% O₂ '+(type==='VM'?'Venturi':'HFNC')+' '+flow+ (isNaN(parseFloat(flow))? '' : (type==='VM'?'%':' lpm')) );
        else parts.push('SpO₂: '+sp+'% O₂ '+(type==='VM'?'Venturi':'HFNC'));
      } else {
        if(flow) parts.push('SpO₂: '+sp+'% O₂ '+type+' '+flow+' lpm');
        else parts.push('SpO₂: '+sp+'% O₂ '+type);
  // attach autosave for each field present
  FIELDS.forEach(id=>{
    const el = qs(id);
    if(!el) return;
    el.addEventListener('input', ()=>{
      draft[id] = getVal(id);
      save(STORAGE_KEYS.draft, draft);
      if(['gcsE','gcsV','gcsM','td','hr','rr','temp','spo2'].includes(id)){
        computeVitals(); // keep vitals reactive
}
    }
      if(id === 'usia') onAgeChange();
    });
  });

    if(parts.length) parts.push('');
  onAgeChange();

    const k = smartLabel('Kepala', kepala.value);
    const t = smartLabel('Thorax', thorax.value);
    const a = smartLabel('Abdomen', abdomen.value);
    const e = smartLabel('Ekstremitas', ekstremitas.value);
    if(k) parts.push(k);
    if(t) parts.push(t);
    if(a) parts.push(a);
    if(e) parts.push(e);
    if(lain.value) parts.push(lain.value);
  // --- Vitals / Scores -----------------------------------------------------

    oField.value = parts.join('\n');
  function safeParseFloat(v){
    if(v===null || v===undefined) return NaN;
    const s = String(v).trim().replace(',', '.');
    const n = parseFloat(s);
    return isNaN(n)? NaN : n;
}

  [gcsE,gcsV,gcsM,td,hr,rr,temp,spo2,o2type,o2flow,kepala,thorax,abdomen,ekstremitas,lain].forEach(el=> el.addEventListener('input', buildObjective));
  buildObjective();

  function greeting(){
    const h = new Date().getHours();
    if(h>=5 && h<11) return 'Selamat pagi';
    if(h>=11 && h<15) return 'Selamat siang';
    if(h>=15 && h<18) return 'Selamat sore';
    return 'Selamat malam';
  function computeMapFromTd(tdStr){
    if(!tdStr) return null;
    const parts = tdStr.split('/').map(p=>safeParseFloat(p));
    if(parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return null;
    const s = parts[0], d = parts[1];
    return Math.round((s + 2*d)/3);
}

  function patientPrefix(name){
    const s = loadSettingsObj();
    if(s.prefix==='off') return name;
    const age = parseFloat(usia.value);
    if(!isNaN(age) && age < 18) {
      if(/^\s*An\./i.test(name)) return name;
      return (name? 'An. '+name : 'An. [Nama]');
    }
    const sex = jk.value;
    if(sex==='F'){
      if(/^\s*Ny\./i.test(name)) return name;
      return (name? 'Ny. '+name : 'Ny. [Nama]');
    } else {
      if(/^\s*Tn\./i.test(name)) return name;
      return (name? 'Tn. '+name : 'Tn. [Nama]');
    }
  function parseGcsTotal(){
    const e = parseInt(getVal('gcsE')) || 0;
    const v = parseInt(getVal('gcsV')) || 0;
    const m = parseInt(getVal('gcsM')) || 0;
    const sum = e+v+m;
    return sum>0? sum : null;
}

  function calcEWS(){
  function computeQSOFA(rr, gcsTotal, sbp){
let score = 0;
    const rrVal = parseFloat(rr.value) || null;
    const spVal = parseFloat(spo2.value) || null;
    const hrVal = parseFloat(hr.value) || null;
    const tVal = parseFloat(temp.value) || null;
    const tdSys = parseSystolic(td.value);
    const typeO2 = o2type.value;

    if(rrVal!==null){
      if(rrVal>=25) score += 3;
      else if(rrVal>=21) score += 2;
      else if(rrVal>=12) score += 0;
      else if(rrVal>=9) score += 1;
      else score += 3;
    }

    if(spVal!==null){
      if(spVal<=91) score += 3;
      else if(spVal<=93) score += 2;
      else if(spVal<=95) score += 1;
      else score += 0;
    }
    if(rr !== null && rr !== undefined && !isNaN(rr) && rr >= 22) score++;
    if(gcsTotal !== null && gcsTotal < 15) score++;
    if(sbp !== null && !isNaN(sbp) && sbp <= 100) score++;
    return score;
  }

    if(typeO2 && typeO2!=='RA'){
      score += 2;
  function calcEwsFromInputs(rr, sp, hr, t, gcs){
    // simplified early warning score (local thresholds used previously)
    let score = 0;
    if(!isNaN(rr)){
      if(rr >= 25) score += 3;
      else if(rr >= 21) score += 2;
      else if(rr >= 12) score += 0;
      else if(rr >= 9) score += 1;
      else score += 3; // very low rr
}

    if(tVal!==null){
      if(tVal<=35.0) score += 3;
      else if(tVal<=36.0) score += 1;
      else if(tVal<=38.0) score += 0;
      else if(tVal<=39.0) score += 1;
      else score += 2;
    if(!isNaN(sp)){
      if(sp <= 91) score += 3;
      else if(sp <= 93) score += 2;
      else if(sp <= 95) score += 1;
}

    if(tdSys!==null){
      if(tdSys<=90) score += 3;
      else if(tdSys<=100) score += 2;
      else if(tdSys<=110) score += 1;
      else if(tdSys<=219) score += 0;
    if(!isNaN(hr)){
      if(hr <= 40) score += 3;
      else if(hr <= 50) score += 1;
      else if(hr <= 90) score += 0;
      else if(hr <= 110) score += 1;
      else if(hr <= 130) score += 2;
else score += 3;
}

    if(hrVal!==null){
      if(hrVal<=40) score += 3;
      else if(hrVal<=50) score += 1;
      else if(hrVal<=90) score += 0;
      else if(hrVal<=110) score += 1;
      else if(hrVal<=130) score += 2;
      else score += 3;
    if(!isNaN(t)){
      if(t <= 35) score += 3;
      else if(t <= 36) score += 1;
      else if(t <= 38) score += 0;
      else if(t <= 39) score += 1;
      else score += 2;
}

    const ge = parseInt(gcsE.value)||0, gv = parseInt(gcsV.value)||0, gm = parseInt(gcsM.value)||0;
    const gcsTotal = (ge||0)+(gv||0)+(gm||0);
    if(gcsTotal && gcsTotal < 15) score += 3;

    if(gcs && gcs < 15) score += 3;
return score;
}

  function ewsLabel(score){
    if(score>=7) return {txt:'EWS: '+score+' (High)', color:'var(--danger)', note:'EWS ≥7 — pertimbangkan eskalasi/ICU.'};
    if(score>=5) return {txt:'EWS: '+score+' (Moderate)', color:'var(--warning)', note:'EWS 5–6 — pemantauan ketat dan penilaian cepat.'};
    return {txt:'EWS: '+score+' (Low)', color:'var(--success)', note:'EWS 0–4 — observasi rutin.'};
  function interpretEws(score){
    if(score >= 7) return { label: 'Kritis', cls: 'ews-bad', advice: 'Pertimbangkan intervensi segera/rujuk ke ICU' };
    if(score >= 5) return { label: 'Perhatian', cls: 'ews-warn', advice: 'Monitor ketat, evaluasi ulang terapi' };
    return { label: 'Normal', cls: 'ews-good', advice: 'Observasi rutin' };
}

  function validateAll(){
    warningsEl.innerHTML = '';
    const warns = [];
    const spVal = parseFloat(spo2.value);
    const tdSys = parseSystolic(td.value);
    const hrVal = parseFloat(hr.value);
    const rrVal = parseFloat(rr.value);
    const ge = parseInt(gcsE.value)||0, gv = parseInt(gcsV.value)||0, gm = parseInt(gcsM.value)||0;
    const gcsTotal = (ge||0)+(gv||0)+(gm||0);
    if(!isNaN(spVal) && spVal < 90) warns.push('SpO₂ < 90% — segera tinjau kebutuhan oksigen/ventilasi.');
    if(tdSys!==null && (tdSys < 90 || tdSys > 220)) warns.push('TD sistolik abnormal (<90 atau >220).');
    if(!isNaN(hrVal) && (hrVal < 40 || hrVal > 130)) warns.push('HR ekstrem (<40 atau >130).');
    if(!isNaN(rrVal) && (rrVal < 8 || rrVal > 25)) warns.push('RR abnormal (<8 atau >25).');
    if(gcsTotal && gcsTotal <= 8) warns.push('GCS ≤ 8 — pertimbangkan proteksi jalan napas.');
    if(warns.length){
      warningsEl.innerHTML = warns.map(w=>'<div>'+w+'</div>').join('');
    } else warningsEl.innerHTML = '';
  }
  // computeVitals — update MAP, qSOFA, and EWS boxes
  function computeVitals(){
    const td = getVal('td') || '';
    const hr = safeParseFloat(getVal('hr')) || 0;
    const rr = safeParseFloat(getVal('rr')) || 0;
    const temp = safeParseFloat(getVal('temp')) || 0;
    const spo2Val = safeParseFloat(getVal('spo2')) || 0;
    const gcsTotal = parseGcsTotal();

    const map = computeMapFromTd(td);
    const sbp = td ? parseInt(String(td).split('/')[0]) : null;
    const qsofa = computeQSOFA(rr, gcsTotal, sbp);

    const ews = calcEwsFromInputs(rr, spo2Val, hr, temp, gcsTotal || 15);
    const interp = interpretEws(ews);

    if(hasEl('map_qsofa')){
      const mapText = map ? `MAP: ${map} mmHg.` : '';
      const qText = qsofa ? ` qSOFA: ${qsofa}.` : '';
      setVal('map_qsofa', mapText + qText);
    }

  function generateOutput(){
    const dok = namaDokter.value.trim() || 'dr. [nama]';
    const rs = namaRS.value.trim() || '[Nama RS]';
    const loc = lokasi.value || 'IGD';
    const prefName = patientPrefix(namaPasien.value.trim());
    const ageText = usia.value? (usia.value+' tahun') : '';
    const dxv = dx.value.trim() || '-';
    const sText = s.value.trim() || '-';
    const oText = oField.value.trim() || '-';
    const pText = p.value.trim() || '-';

    let header = `${greeting()} dokter. Izin dok dengan ${dok}, dokter jaga ${loc} ${rs}.\nIzin konsul pasien ${loc} ${rs}.\n\n`;
    let id = `${prefName}\n${ageText}\n\n`;
    let body = `Dx: ${dxv}\n\nS: ${sText}\n\nO:\n${oText}\n\nP:\n${pText}\n\nMohon advice selanjutnya. Terima kasih dokter.`;
    return header + id + body;
    if(hasEl('ews_box')){
      const container = qs('ews_box');
      if(container){
        container.innerHTML = `<div class="${interp.cls}">EWS: ${ews} — ${interp.label}</div><div class="muted">${interp.advice}</div>`;
      }
    }
    return {map, qsofa, ews, interp};
}

  buatBtn.addEventListener('click', ()=>{
    buildObjective();
    validateAll();
    const txt = generateOutput();
    hasil.textContent = txt;
    copyBtn.disabled = false;

    const score = calcEWS();
    const lbl = ewsLabel(score);
    ewsBadge.textContent = lbl.txt + ' — ' + lbl.note;
    ewsBadge.style.color = lbl.color;
  // attach vitals reactive on relevant fields
  ['gcsE','gcsV','gcsM','td','hr','rr','temp','spo2'].forEach(id=>{
    addEvent(id, 'input', computeVitals);
});

  copyBtn.addEventListener('click', async ()=>{
    const txt = hasil.textContent;
    if(!txt) return alert('Belum ada konsul untuk disalin.');
    await navigator.clipboard.writeText(txt);
    alert('Konsul tersalin ke clipboard.');
  // oxygen flow behavior
  addEvent('o2type','change', ()=>{
    const sel = getVal('o2type');
    if(!hasEl('o2flow')) return;
    if(sel === 'RA' || sel === ''){
      hide('o2flow');
      setVal('o2flow','');
    } else {
      show('o2flow');
    }
});

  function resetForm(){
    namaPasien.value = ''; usia.value=''; jk.value='F'; bb.value=''; dx.value=''; s.value='';
    gcsE.value=''; gcsV.value=''; gcsM.value='';
    td.value=''; hr.value=''; rr.value=''; temp.value=''; spo2.value=''; o2type.value='RA'; o2flow.value='';
    kepala.value = 'CA -/-, SI -/-';
    thorax.value = 'ves +/+, rh -/-, wh -/-. BJ reg, m -, g -';
    abdomen.value = 'supel, BU +';
    ekstremitas.value = 'akral hangat, CRT <2s';
    lain.value=''; oField.value=''; p.value='';
    hasil.textContent=''; copyBtn.disabled=true; warningsEl.innerHTML=''; ewsBadge.textContent='';
    localStorage.removeItem(STORAGE_KEY);
  // initial toggle visibility for o2flow
  (function initO2Flow(){
    const sel = getVal('o2type');
    if(hasEl('o2flow')){
      if(sel === 'RA' || sel === '') hide('o2flow'); else show('o2flow');
    }
  })();

  // --- Output builder -------------------------------------------------------
  // REPLACE existing buildOutput() with this corrected version
function buildOutput(){
  // greeting based on time
  let h = new Date().getHours();
  let greeting = 'Selamat malam dokter.';
  if(h >= 4 && h < 11) greeting = 'Selamat pagi dokter.';
  else if(h >= 11 && h < 15) greeting = 'Selamat siang dokter.';
  else if(h >= 15 && h < 18) greeting = 'Selamat sore dokter.';

  const namaDok = getVal('nama_dokter');
  const unit = getVal('unit');
  const rs = getVal('rs');

  // identity
  const nama = getVal('nama');
  const usia = getVal('usia');
  const jk = getVal('jk');
  const bb = getVal('bb');
  const pref = (usia && parseFloat(usia) < 18) ? 'An.' : (jk === 'F' ? 'Ny.' : (jk === 'M' ? 'Tn.' : ''));

  const ident = `${pref? pref + ' ' : ''}${nama}\n${usia? usia + ' tahun' : ''}${(bb && pref==='An.') ? ', BB '+bb+' kg' : ''}`;

  // Dx, S
  const dx = getVal('dx') || '-';
  const s = getVal('s') || '-';

  // O section: GCS first, then TTV (TD/HR/RR/T), then SpO2 (with O2 type/flow)
  const gcs = `GCS: E${getVal('gcsE')||'-'}V${getVal('gcsV')||'-'}M${getVal('gcsM')||'-'}`;
  let o = `${gcs}\n`;
  if(getVal('td')) o += `TD: ${getVal('td')}\n`;
  if(getVal('hr')) o += `HR: ${getVal('hr')}\n`;
  if(getVal('rr')) o += `RR: ${getVal('rr')}\n`;
  if(getVal('temp')) o += `T: ${getVal('temp')}\n`;

  if(getVal('spo2')){
    const o2type = getVal('o2type') || 'RA';
    const o2flow = getVal('o2flow') || '';
    const lpm = (o2type === 'RA' || o2type === '') ? 'room air' : (o2flow ? `${o2flow} LPM` : o2type);
    o += `SpO₂: ${getVal('spo2')}% ${lpm}\n`;
}

  resetBtn.addEventListener('click', ()=>{
    if(confirm('Reset form? Semua perubahan akan hilang.')) resetForm();
  // blank line between vitals and physical exam (as requested)
  o += `\n`;

  // physical exam - kepala, thorax, abdomen, ekstremitas, then pemeriksaan_lain if present
  const kepala = getVal('kepala') || 'Kepala: CA -/-, SI -/-';
  const thorax = getVal('thorax') || 'Thorax: ves +/+, rh -/-, wh -/-. BJ reg, m -, g -.';
  const abdomen = getVal('abdomen') || 'Abdomen: supel, BU +';
  const ekstremitas = getVal('ekstremitas') || 'Ekstremitas: akral hangat, CRT <2s';
  let pemeriksaan = `${kepala}\n${thorax}\n${abdomen}\n${ekstremitas}\n`;
  const pemeriksaan_lain = getVal('pemeriksaan_lain');
  if(pemeriksaan_lain) pemeriksaan += `${pemeriksaan_lain}\n`;

  const plan = getVal('p') || '-';

  const output = `${greeting}\nIzin dok dengan ${namaDok}, dokter jaga ${unit} ${rs}.\nIzin konsul pasien dokter.\n\n${ident}\n\nDx: ${dx}\n\nS: ${s}\n\nO:\n${o}${pemeriksaan}P:\n${plan}\n\nMohon advice selanjutnya.\nTerima kasih dokter.`;
  return output;
}

  // --- Buttons: buat, copy, reset, save ------------------------------------
  addEvent('buatBtn','click', ()=>{
    const out = buildOutput();
    if(hasEl('hasil')) setVal('hasil', out);
    computeVitals();
  });

  addEvent('copyBtn','click', ()=>{
    try{
      const out = buildOutput();
      navigator.clipboard.writeText(out).then(()=> { alert('Teks konsul tersalin.'); }, ()=> { alert('Tidak dapat menyalin ke clipboard.'); });
    }catch(e){ console.error(e); alert('Gagal copy.'); }
});

  function loadHistory(){
    const hist = JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');
    historyEl.innerHTML = '';
    hist.slice().reverse().forEach((h, idx)=>{
      const id = hist.length-1-idx;
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `<div class="meta">${new Date(h.t).toLocaleString()}</div>
        <div style="margin-top:6px;font-weight:700">${h.nama} — ${h.dx}</div>
        <div style="margin-top:6px">${(h.s||'').slice(0,120)}</div>
        <div style="margin-top:8px;display:flex;gap:8px">
          <button class="btn small" data-load="${id}">Load</button>
          <button class="btn small secondary" data-del="${id}">Hapus</button>
        </div>`;
      historyEl.appendChild(div);
  addEvent('resetBtn','click', ()=>{
    // reset form but keep default texts for physical exam fields
    const defaults = {};
    ['kepala','thorax','abdomen','ekstremitas'].forEach(id=>{
      const el = qs(id);
      if(el) defaults[id] = el.defaultValue || '';
});
  }
  loadHistory();
    FIELDS.forEach(id => { if(qs(id)) setVal(id, ''); });
    // restore defaults for physical fields
    Object.keys(defaults).forEach(id=> setVal(id, defaults[id]));
    draft = {}; save(STORAGE_KEYS.draft, draft);
    if(hasEl('hasil')) setVal('hasil', '');
    computeVitals();
    onAgeChange();
  });

  saveBtn.addEventListener('click', ()=>{
    const hist = JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');
  // Save to history (store full snapshot)
  addEvent('saveBtn','click', ()=>{
    // snapshot form
    const snapshot = {};
    FIELDS.forEach(k => snapshot[k] = getVal(k));
const item = {
      t: Date.now(),
      nama: patientPrefix(namaPasien.value.trim()||'[Nama]'),
      dx: dx.value.trim() || '[Dx]',
      s: s.value.trim(),
      o: oField.value.trim(),
      p: p.value.trim(),
      dok: namaDokter.value.trim(),
      rs: namaRS.value.trim()
      id: 'h_' + Date.now(),
      created_at: new Date().toISOString(),
      name: snapshot['nama'] || '(nama kosong)',
      age: snapshot['usia'] || '',
      dx: snapshot['dx'] || '',
      text: buildOutput(),
      snapshot: snapshot,
      done: false,
      note: ''
};
    hist.push(item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    loadHistory();
    alert('Tersimpan ke history lokal. Form akan direset.');
    resetForm();
    historyData.unshift(item);
    save(STORAGE_KEYS.history, historyData);
    // auto reset after save (per earlier agreement)
    const resetBtn = qs('resetBtn');
    if(resetBtn) resetBtn.click();
    renderHistory();
    alert('Tersimpan ke history.');
});

  historyEl.addEventListener('click', (ev)=>{
    const load = ev.target.getAttribute('data-load');
    const del = ev.target.getAttribute('data-del');
    const hist = JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');
    if(load){
      const it = hist[load];
      if(!it) return;
      namaPasien.value = it.nama; dx.value = it.dx; s.value = it.s; oField.value = it.o; p.value = it.p;
      hasil.textContent = generateOutput();
      copyBtn.disabled = false;
    } else if(del){
      if(!confirm('Hapus entry ini?')) return;
      hist.splice(del,1);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
      loadHistory();
  // --- History rendering & actions -----------------------------------------
  function renderHistory(){
    const container = qs('historyList');
    if(!container) return;
    container.innerHTML = '';
    if(!Array.isArray(historyData) || historyData.length === 0){
      container.innerHTML = '<div class="muted">Belum ada history.</div>';
      return;
}
  });

  function loadTemplates(){
    const t = JSON.parse(localStorage.getItem(TEMPLATES_KEY)||'[]');
    if(t.length===0){
      const seed = [
        {name:'Sepsis (awal)', dx:'Sepsis', s:'Demam, lemas, penurunan kesadaran', p:'- Cairan bolus jika hipotensi\n- Ambil kultur darah\n- Mulai antibiotik empiris sesuai protokol'},
        {name:'Stroke (suspect)', dx:'Suspected Stroke', s:'Onset tiba-tiba, kelemahan separuh badan', p:'- CT head segera\n- NIHSS dan rujuk ke stroke unit'},
        {name:'ACS', dx:'Suspected ACS', s:'Nyeri dada tekan, keringat dingin', p:'- Aspirin 300 mg PO\n- O2 jika SpO2 <92%\n- Bawa ke PCI center'},
        {name:'Pneumonia berat', dx:'Pneumonia / Susp sepsis paru', s:'Sesak, demam, batuk', p:'- Oksigen\n- AB empiris sesuai protokol'},
        {name:'Trauma (politrauma)', dx:'Politrauma', s:'Kecelakaan, nyeri banyak area', p:'- Stabilkan airway/breathing/circulation\n- Imaging sesuai kebutuhan'},
        {name:'Pediatrik demam', dx:'Demam (pediatrik)', s:'Demam tinggi', p:'- Evaluasi dehidrasi\n- Paracetamol sesuai berat badan'}
      ];
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(seed));
      return seed;
    }
    return t;
    historyData.forEach(h => {
      const item = document.createElement('div'); item.className = 'history-item';
      const left = document.createElement('div'); left.style.flex = '1';
      left.innerHTML = `<strong>${h.name || '-'} — ${h.age || '-'} th</strong>
                        <div class="muted">${h.dx || ''}</div>
                        <div class="muted">${new Date(h.created_at).toLocaleString()}</div>
                        ${h.done ? '<div style="color:#10b981;font-size:12px">✅ Selesai</div>' : ''}`;

      const right = document.createElement('div'); right.style.display = 'flex'; right.style.flexDirection = 'column'; right.style.gap = '6px';
      const top = document.createElement('div'); top.style.display = 'flex'; top.style.gap = '6px';

      const btnView = document.createElement('button'); btnView.className = 'btn small outline'; btnView.textContent = 'View';
      btnView.addEventListener('click', ()=>{
        if(h.snapshot){
          // populate full form
          Object.keys(h.snapshot).forEach(k => {
            if(qs(k)) setVal(k, h.snapshot[k]);
          });
          // ensure o2flow visibility
          if(hasEl('o2type')) qs('o2type').dispatchEvent(new Event('change'));
          // display output also
          if(hasEl('hasil')) setVal('hasil', h.text || buildOutput());
        } else {
          // fallback parse
          if(h.text) populateFormFromText(h.text);
        }
        // switch to konsul tab
        const tabBtn = document.querySelector('[data-tab="konsul"]');
        if(tabBtn) tabBtn.click();
        window.scrollTo({top:0, behavior:'smooth'});
      });

      const btnCopy = document.createElement('button'); btnCopy.className = 'btn small'; btnCopy.textContent = 'Copy';
      btnCopy.addEventListener('click', ()=> navigator.clipboard.writeText(h.text || '').then(()=> alert('Teks konsul tersalin dari history.')));

      const btnDone = document.createElement('button'); btnDone.className = 'btn small';
      btnDone.textContent = h.done ? 'Selesai' : 'Mark Selesai';
      if(h.done) btnDone.style.background = '#10b981';
      btnDone.addEventListener('click', ()=>{
        h.done = !h.done;
        save(STORAGE_KEYS.history, historyData);
        renderHistory();
      });

      const btnDel = document.createElement('button'); btnDel.className = 'btn small secondary'; btnDel.textContent = 'Hapus';
      btnDel.addEventListener('click', ()=>{
        if(confirm('Hapus entry ini?')){
          historyData = historyData.filter(x => x.id !== h.id);
          save(STORAGE_KEYS.history, historyData);
          renderHistory();
        }
      });

      top.appendChild(btnView); top.appendChild(btnCopy); top.appendChild(btnDone); top.appendChild(btnDel);

      const note = document.createElement('input'); note.placeholder = 'Keterangan tambahan...'; note.value = h.note || '';
      note.addEventListener('change', ()=> { h.note = note.value; save(STORAGE_KEYS.history, historyData); });

      right.appendChild(top); right.appendChild(note);
      item.appendChild(left); item.appendChild(right);
      container.appendChild(item);
    });
}

  function populateTemplateSelect(){
    const t = loadTemplates();
    templateSelect.innerHTML = '<option value="">-- Pilih template --</option>';
    t.forEach((tpl, idx)=>{
      const opt = document.createElement('option');
      opt.value = idx; opt.textContent = tpl.name;
      templateSelect.appendChild(opt);
  // initial render
  renderHistory();

  // --- Templates -----------------------------------------------------------
  function renderTemplates(){
    const c = qs('templateList');
    if(!c) return;
    c.innerHTML = '';
    if(!Array.isArray(templates) || templates.length === 0){
      c.innerHTML = '<div class="muted">Belum ada template.</div>';
      return;
    }
    templates.forEach((t, i)=>{
      const div = document.createElement('div'); div.className = 'history-item';
      div.innerHTML = `<div style="flex:1"><strong>${t.title}</strong><div class="muted">${t.dx||''}</div></div>`;
      const btnUse = document.createElement('button'); btnUse.className = 'btn small'; btnUse.textContent = 'Gunakan';
      btnUse.addEventListener('click', ()=>{
        // fill Dx, Kepala, P; clear thorax/abdomen/ekstremitas
        if(qs('dx')) setVal('dx', t.dx || t.title || '');
        if(qs('kepala')) setVal('kepala', t.phys || '');
        if(qs('thorax')) setVal('thorax', '');
        if(qs('abdomen')) setVal('abdomen', '');
        if(qs('ekstremitas')) setVal('ekstremitas', '');
        if(qs('p')) setVal('p', t.plan || '');
        // switch to konsul
        const konsulBtn = document.querySelector('[data-tab="konsul"]');
        if(konsulBtn) konsulBtn.click();
      });
      const btnEdit = document.createElement('button'); btnEdit.className = 'btn small outline'; btnEdit.textContent = 'Edit';
      btnEdit.addEventListener('click', ()=>{
        if(qs('templateTitle')) setVal('templateTitle', t.title || '');
        if(qs('templateDx')) setVal('templateDx', t.dx || '');
        if(qs('templatePhys')) setVal('templatePhys', t.phys || '');
        if(qs('templatePlan')) setVal('templatePlan', t.plan || '');
        templates.splice(i,1);
        save(STORAGE_KEYS.templates, templates);
        renderTemplates();
      });
      const btnDel = document.createElement('button'); btnDel.className = 'btn small secondary'; btnDel.textContent = 'Hapus';
      btnDel.addEventListener('click', ()=> {
        if(confirm('Hapus template ini?')){
          templates.splice(i,1);
          save(STORAGE_KEYS.templates, templates);
          renderTemplates();
        }
      });
      div.appendChild(btnUse); div.appendChild(btnEdit); div.appendChild(btnDel);
      c.appendChild(div);
});
}
  populateTemplateSelect();

  applyTemplate.addEventListener('click', ()=>{
    const idx = templateSelect.value;
    if(idx==='') return alert('Pilih template terlebih dahulu.');
    const t = JSON.parse(localStorage.getItem(TEMPLATES_KEY)||'[]')[idx];
    if(!t) return;
    dx.value = t.dx || dx.value;
    s.value = t.s || s.value;
    p.value = t.p || p.value;
    alert('Template diterapkan. Silakan sesuaikan.');

  addEvent('addTemplate','click', ()=>{
    const title = getVal('templateTitle').trim();
    const dx = getVal('templateDx').trim();
    const phys = getVal('templatePhys').trim();
    const plan = getVal('templatePlan').trim();
    if(!title){ alert('Isi judul template.'); return; }
    templates.unshift({ id: 't_'+Date.now(), title, dx, phys, plan });
    save(STORAGE_KEYS.templates, templates);
    ['templateTitle','templateDx','templatePhys','templatePlan'].forEach(id=> setVal(id,''));
    renderTemplates();
  });
  addEvent('clearTemplates','click', ()=> {
    if(confirm('Hapus semua template?')){
      templates = []; save(STORAGE_KEYS.templates, templates); renderTemplates();
    }
});

  addTemplate.addEventListener('click', ()=>{
    const name = prompt('Nama template baru (cth: Sepsis cepat):');
    if(!name) return;
    const t = JSON.parse(localStorage.getItem(TEMPLATES_KEY)||'[]');
    t.push({name:name, dx:dx.value, s:s.value, p:p.value});
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(t));
    populateTemplateSelect();
    alert('Template baru disimpan.');
  renderTemplates();

  // --- Calculators ---------------------------------------------------------
  // Only attach handlers if elements exist
  addEvent('calc_bmi','click', ()=>{
    const bb = safeParseFloat(getVal('calc_bb'));
    const tb = safeParseFloat(getVal('calc_tb'));
    if(!bb || !tb){ if(hasEl('bmi_res')) setVal('bmi_res', 'Masukkan BB dan TB.'); return; }
    const m = tb/100;
    const bmi = bb / (m*m);
    let cat = 'Normal';
    if(bmi < 18.5) cat = 'Underweight';
    else if(bmi < 25) cat = 'Normal';
    else if(bmi < 30) cat = 'Overweight';
    else cat = 'Obese';
    if(hasEl('bmi_res')) setVal('bmi_res', `BMI: ${bmi.toFixed(1)} (${cat})`);
});

  manageTemplate.addEventListener('click', ()=>{
    const t = JSON.parse(localStorage.getItem(TEMPLATES_KEY)||'[]');
    templateList.innerHTML = '';
    t.forEach((tpl, i)=>{
      const div = document.createElement('div');
      div.style.borderBottom='1px solid #eee'; div.style.padding='8px 0';
      div.innerHTML = `<div style="font-weight:700">${tpl.name}</div><div style="margin-top:6px">${tpl.dx}</div>
        <div style="margin-top:6px;display:flex;gap:8px"><button class="btn small" data-load="${i}">Load</button><button class="btn small secondary" data-del="${i}">Hapus</button></div>`;
      templateList.appendChild(div);
    });
    manageTemplates.style.display='flex';
  addEvent('calc_map','click', ()=>{
    const s = safeParseFloat(getVal('map_sys'));
    const d = safeParseFloat(getVal('map_dia'));
    if(isNaN(s) || isNaN(d)){ if(hasEl('map_res')) setVal('map_res', 'Masukkan TD.'); return; }
    const map = (s + 2*d)/3;
    if(hasEl('map_res')) setVal('map_res', `MAP: ${map.toFixed(1)} mmHg`);
});

  templateList.addEventListener('click', (ev)=>{
    const load = ev.target.getAttribute('data-load');
    const del = ev.target.getAttribute('data-del');
    const t = JSON.parse(localStorage.getItem(TEMPLATES_KEY)||'[]');
    if(load){
      const tpl = t[load];
      dx.value = tpl.dx; s.value = tpl.s; p.value = tpl.p;
      alert('Template dimuat.');
    } else if(del){
      if(!confirm('Hapus template ini?')) return;
      t.splice(del,1);
      localStorage.setItem(TEMPLATES_KEY, JSON.stringify(t));
      populateTemplateSelect();
      manageTemplates.style.display='none';
    }
  addEvent('calc_ews','click', ()=>{
    const rr = safeParseFloat(getVal('ews_rr')) || 0;
    const sp = safeParseFloat(getVal('ews_spo2')) || 0;
    const hr = safeParseFloat(getVal('ews_hr')) || 0;
    const t = safeParseFloat(getVal('ews_temp')) || 0;
    const gcs = parseInt(getVal('ews_gcs')) || 15;
    const score = calcEwsFromInputs(rr, sp, hr, t, gcs);
    const interp = interpretEws(score);
    if(hasEl('ews_res')) setVal('ews_res', `EWS: ${score} — ${interp.label}\n${interp.advice}`);
});

  document.getElementById('closeTpl').addEventListener('click', ()=> manageTemplates.style.display='none');

  aiQuickBtn.addEventListener('click', ()=>{
    buildObjective();
    const age = usia.value? (usia.value+' tahun') : '';
    const promptParts = [];
    promptParts.push(`Age: ${age}`);
    promptParts.push(`Sex: ${jk.value || ''}`);
    promptParts.push(`Subjective: ${s.value || '-'}`);
    promptParts.push(`Objective: ${oField.value || '-'}`);
    promptParts.push(`Diagnosis: ${dx.value || '-'}`);
    promptParts.push(`Current therapy: ${p.value || '-'}`);
    const prompt = `You are a clinical assistant. Please provide a brief clinical assessment and immediate recommendations. Be concise and in Indonesian. Anonymize patient identifiers.\n\n` + promptParts.join('\n');
    navigator.clipboard.writeText(prompt).then(()=>{
      const openUrl = 'https://chat.openai.com/chat';
      window.open(openUrl,'_blank');
      alert('Ringkasan kasus telah disalin. Silakan paste ke ChatGPT dan minta analisis.');
    }).catch(()=> alert('Gagal menyalin ke clipboard. Mohon izinkan clipboard access.'));
  addEvent('calc_bsa','click', ()=>{
    const bb = safeParseFloat(getVal('bsa_bb'));
    const tb = safeParseFloat(getVal('bsa_tb'));
    if(!bb || !tb){ if(hasEl('bsa_res')) setVal('bsa_res','Masukkan BB dan TB'); return; }
    const bsa = Math.sqrt((bb * tb) / 3600);
    if(hasEl('bsa_res')) setVal('bsa_res', `BSA: ${bsa.toFixed(2)} m²`);
});

  settingsBtn.addEventListener('click', ()=> settingsModal.style.display='flex');
  closeSet.addEventListener('click', ()=> settingsModal.style.display='none');
  saveSet.addEventListener('click', ()=>{
    const s = { nama:setNama.value.trim(), rs:setRS.value.trim(), prefix:setPrefix.value, shifts:setShift.value, theme: document.documentElement.classList.contains('dark')? 'dark':'light' };
    saveSettingsObj(s);
    if(s.nama) namaDokter.value = s.nama;
    if(s.rs) namaRS.value = s.rs;
    settingsModal.style.display = 'none';
    alert('Pengaturan disimpan.');
    loadSettings();
  addEvent('calc_ag','click', ()=>{
    const na = safeParseFloat(getVal('ag_na'));
    const cl = safeParseFloat(getVal('ag_cl'));
    const hco3 = safeParseFloat(getVal('ag_hco3'));
    if(isNaN(na) || isNaN(cl) || isNaN(hco3)){ if(hasEl('ag_res')) setVal('ag_res','Masukkan Na, Cl, HCO3'); return; }
    if(hasEl('ag_res')) setVal('ag_res', `Anion gap: ${(na-(cl+hco3)).toFixed(1)}`);
});

  themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    const s = loadSettingsObj();
    s.theme = isDark? 'dark':'light';
    saveSettingsObj(s);
    logoImg.src = isDark? 'logo_dark.png' : 'logo_light.png';
  addEvent('calc_gfr','click', ()=>{
    const age = safeParseFloat(getVal('gfr_age'));
    const sex = getVal('gfr_sex');
    const scr = safeParseFloat(getVal('gfr_scr'));
    if(!age || !scr){ if(hasEl('gfr_res')) setVal('gfr_res','Masukkan umur & kreatinin'); return; }
    const k = sex === 'F' ? 0.7 : 0.9;
    const a = sex === 'F' ? -0.329 : -0.411;
    const minScr_k = Math.min(scr / k, 1);
    const maxScr_k = Math.max(scr / k, 1);
    const egfr = 141 * Math.pow(minScr_k, a) * Math.pow(maxScr_k, -1.209) * Math.pow(0.993, age) * (sex === 'F' ? 1.018 : 1);
    if(hasEl('gfr_res')) setVal('gfr_res', `eGFR (estimasi): ${Math.round(egfr)} mL/min/1.73m²`);
});

  populateTemplateSelect();
  loadHistory();
  // --- Text parser fallback (if needed) ------------------------------------
  function populateFormFromText(text){
    if(!text || typeof text !== 'string') return;
    const lines = text.split('\n').map(l => l.trim());
    // try to parse header lines
    try{
      const izinLine = lines.find(l => l.toLowerCase().startsWith('izin dok dengan')) || '';
      const izinMatch = izinLine.match(/Izin dok dengan\s*(.*),\s*dokter jaga\s*(.*)\.?/i);
      if(izinMatch){
        if(qs('nama_dokter')) setVal('nama_dokter', izinMatch[1] || '');
        if(qs('unit') && izinMatch[2]) {
          const rest = izinMatch[2].split(' ');
          setVal('unit', rest[0] || '');
          setVal('rs', rest.slice(1).join(' ') || '');
        }
      }
      // find Dx:
      const dxLine = lines.find(l => l.startsWith('Dx:') || l.startsWith('DX:')) || '';
      if(dxLine && qs('dx')) setVal('dx', dxLine.replace(/^Dx:\s*/i,'').trim());
      // S:
      const sLine = lines.find(l => l.startsWith('S:')) || '';
      if(sLine && qs('s')) setVal('s', sLine.replace(/^S:\s*/i,'').trim());
      // find O: block start
      const oIndex = lines.findIndex(l => l === 'O:' || l === 'O :');
      if(oIndex >= 0){
        for(let i = oIndex + 1; i < lines.length; i++){
          const l = lines[i];
          if(!l) continue;
          if(/E\d+V\d+M\d+/i.test(l) && qs('gcsE')){
            const m = l.match(/E(\d+)V(\d+)M(\d+)/i);
            if(m){ setVal('gcsE', m[1]); setVal('gcsV', m[2]); setVal('gcsM', m[3]); }
          } else if(l.startsWith('TD:') && qs('td')) setVal('td', l.replace('TD:','').trim());
          else if(l.startsWith('HR:') && qs('hr')) setVal('hr', l.replace('HR:','').trim());
          else if(l.startsWith('RR:') && qs('rr')) setVal('rr', l.replace('RR:','').trim());
          else if(l.startsWith('T:') && qs('temp')) setVal('temp', l.replace('T:','').trim());
          else if((l.startsWith('Kepala:') || l.startsWith('KEPALA:')) && qs('kepala')) setVal('kepala', l);
          else if((l.startsWith('Thorax:')||l.startsWith('THORAX:')) && qs('thorax')) setVal('thorax', l);
          else if((l.startsWith('Abd:')||l.startsWith('Abdomen:')) && qs('abdomen')) setVal('abdomen', l);
          else if((l.startsWith('Ekst:')||l.startsWith('Ekstremitas:')) && qs('ekstremitas')) setVal('ekstremitas', l);
          else if(l.startsWith('SpO') && qs('spo2')){
            const spm = l.match(/(\d+)%/);
            if(spm) setVal('spo2', spm[1]);
            const o2m = l.match(/(NC|NRM|VENT|FM|VM|HFNC|room air|RA)/i);
            if(o2m && qs('o2type')) setVal('o2type', o2m[1]);
            const lpm = l.match(/(\d+)\s*LPM/i);
            if(lpm && qs('o2flow')) setVal('o2flow', lpm[1]);
          } else if(l.startsWith('P:') && qs('p')){
            // gather rest lines as plan until find "Mohon" or "Terima kasih"
            let plan = lines.slice(i+1).join('\n').split('Mohon')[0].split('Terima kasih')[0].trim();
            setVal('p', plan);
            break;
          } else {
            // treat as pemeriksaan_lain candidate
            if(qs('pemeriksaan_lain')) setVal('pemeriksaan_lain', getVal('pemeriksaan_lain') ? (getVal('pemeriksaan_lain') + '\n' + l) : l);
          }
        }
      }
      computeVitals(); onAgeChange();
    } catch(e){ console.warn('populate error', e); }
  }

  // --- Export/Import history (optional) ------------------------------------
  addEvent('exportJson','click', ()=>{
    try{
      const blob = new Blob([JSON.stringify(historyData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'ruangdokter_history.json'; a.click();
    } catch(e){ alert('Gagal export.'); }
  });

  addEvent('importBtn','click', ()=> {
    const input = qs('importFile');
    if(input) input.click();
  });
  if(hasEl('importFile')){
    addEvent('importFile','change', (ev)=>{
      const f = ev.target.files && ev.target.files[0];
      if(!f) return;
      const fr = new FileReader();
      fr.onload = (e) => {
        try{
          const parsed = JSON.parse(e.target.result);
          if(Array.isArray(parsed)){
            // merge at top
            historyData = parsed.concat(historyData);
            save(STORAGE_KEYS.history, historyData);
            renderHistory();
            alert('Restore selesai.');
          } else alert('File JSON tidak valid.');
        } catch(err){ alert('File JSON tidak valid.'); }
      };
      fr.readAsText(f);
    });
  }

  // --- Small utilities ------------------------------------------------------
  // Ensure computeVitals runs at least once to populate boxes
  computeVitals();

  // --- Initial render of history and templates ------------------------------
  renderHistory();
  renderTemplates();

});
  // Done DOMContentLoaded
}); // end DOMContentLoaded
