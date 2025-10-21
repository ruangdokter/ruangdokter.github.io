// Ruang Dokter v1.2.2 - fixed buildObjective, defaults and explicit Add Template UI
document.addEventListener('DOMContentLoaded', ()=>{
  // elements
  const namaDokter = document.getElementById('namaDokter');
  const namaRS = document.getElementById('namaRS');
  const namaPasien = document.getElementById('namaPasien');
  const usia = document.getElementById('usia');
  const bbRow = document.getElementById('bbRow');
  const bb = document.getElementById('bb');
  const jk = document.getElementById('jk');
  const dx = document.getElementById('dx');
  const s = document.getElementById('s');
  const td = document.getElementById('td');
  const hr = document.getElementById('hr');
  const rr = document.getElementById('rr');
  const temp = document.getElementById('temp');
  const spo2 = document.getElementById('spo2');
  const gcsE = document.getElementById('gcsE');
  const gcsV = document.getElementById('gcsV');
  const gcsM = document.getElementById('gcsM');
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
  const historyEl = document.getElementById('history');
  const templateSelect = document.getElementById('templateSelect');
  const applyTemplate = document.getElementById('applyTemplate');
  const addTemplate = document.getElementById('addTemplate');
  const manageTemplate = document.getElementById('manageTemplate');
  const manageTemplates = document.getElementById('manageTemplates');
  const templateList = document.getElementById('templateList');

  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settings');
  const closeSet = document.getElementById('closeSet');
  const saveSet = document.getElementById('saveSet');
  const setNama = document.getElementById('setNama');
  const setRS = document.getElementById('setRS');
  const setShift = document.getElementById('setShift');

  const themeToggle = document.getElementById('themeToggle');
  const logoImg = document.getElementById('logoImg');

  // storage keys
  const STORAGE_KEY = 'rd_v1_2_2';
  const HISTORY_KEY = 'rd_hist_v1_2_2';
  const TEMPLATES_KEY = 'rd_tpl_v1_2_2';
  const SETTINGS_KEY = 'rd_settings_v1_2_2';

  function saveSettingsObj(o){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(o)); }
  function loadSettingsObj(){ return JSON.parse(localStorage.getItem(SETTINGS_KEY)||'{}'); }

  function loadSettings(){
    const s = loadSettingsObj();
    if(s.nama) namaDokter.value = s.nama;
    if(s.rs) namaRS.value = s.rs;
    if(s.theme==='dark') document.documentElement.classList.add('dark');
    if(s.theme==='dark') logoImg.src = 'logo_dark.png'; else logoImg.src = 'logo_light.png';
    setNama.value = s.nama || '';
    setRS.value = s.rs || '';
    setShift.value = s.shifts || '3';
  }
  loadSettings();

  // autosave
  function autosave(){
    const data = {
      namaDokter: namaDokter.value, namaRS: namaRS.value, namaPasien: namaPasien.value,
      usia: usia.value, jk: jk.value, bb: bb.value, dx: dx.value, s: s.value,
      td: td.value, hr: hr.value, rr: rr.value, temp: temp.value, spo2: spo2.value,
      gcsE: gcsE.value, gcsV: gcsV.value, gcsM: gcsM.value,
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
  }
  loadDraft();

  // set default physical exam templates if empty
  if(!(kepala.value && kepala.value.trim())){
    kepala.value = 'CA +/+, SI -/-';
  }
  if(!(thorax.value && thorax.value.trim())){
    thorax.value = 'ves +/+, rh -/-, wh -/-, BJ reg, m -, g -';
  }
  if(!(abdomen.value && abdomen.value.trim())){
    abdomen.value = 'supel, BU +';
  }
  if(!(ekstremitas.value && ekstremitas.value.trim())){
    ekstremitas.value = 'akral hangat, CRT <2s';
  }

  setInterval(autosave, 5000);

  // show bb if child
  usia.addEventListener('input', ()=>{
    const val = parseFloat(usia.value);
    if(!isNaN(val) && val < 18 && val >= 0) bbRow.style.display = 'block';
    else bbRow.style.display = 'none';
  });

  // smart labeling helper to avoid duplicate labels
  function smartLabel(label, fieldValue){
    const v = (fieldValue||'').trim();
    if(!v) return null;
    const re = new RegExp('^\\s*' + label + '\\s*[:\-]', 'i');
    if(re.test(v)) return v;
    return label + ': ' + v;
  }

  // build objective using smart labels and include physical sections
  function buildObjective(){
    const parts = [];
    if(td.value) parts.push('TD: '+td.value);
    if(hr.value) parts.push('HR: '+hr.value+' x/m');
    if(rr.value) parts.push('RR: '+rr.value+' x/m');
    if(temp.value) parts.push('T: '+temp.value+' °C');
    if(spo2.value) parts.push('SpO₂: '+spo2.value+'% RA');
    const ge = (gcsE.value||'').trim(), gv = (gcsV.value||'').trim(), gm = (gcsM.value||'').trim();
    if(ge||gv||gm) parts.push('GCS: E'+(ge||'-')+'V'+(gv||'-')+'M'+(gm||'-'));

    const k = smartLabel('Kepala', kepala.value);
    const t = smartLabel('Thorax', thorax.value);
    const a = smartLabel('Abdomen', abdomen.value);
    const e = smartLabel('Ekstremitas', ekstremitas.value);

    if(k) parts.push(k);
    if(t) parts.push(t);
    if(a) parts.push(a);
    if(e) parts.push(e);
    if(lain.value) parts.push(lain.value);

    oField.value = parts.join('\n');
  }

  [td,hr,rr,temp,spo2,gcsE,gcsV,gcsM,kepala,thorax,abdomen,ekstremitas,lain].forEach(el=> el.addEventListener('input', buildObjective));
  buildObjective();

  // greeting
  function greeting(){
    const h = new Date().getHours();
    if(h>=5 && h<11) return 'Selamat pagi';
    if(h>=11 && h<15) return 'Selamat siang';
    if(h>=15 && h<18) return 'Selamat sore';
    return 'Selamat malam';
  }

  // generate output
  function generateOutput(){
    const dok = namaDokter.value.trim() || 'dr. [nama]';
    const rs = namaRS.value.trim() || '[Nama RS]';
    const np = namaPasien.value.trim() || '';
    const age = usia.value? (usia.value+' tahun') : '';
    const weight = (usia.value && parseFloat(usia.value)<18 && bb.value)? (' BB '+bb.value+' kg') : '';
    const dxv = dx.value.trim() || '-';
    const sText = s.value.trim() || '-';
    const oText = oField.value.trim() || '-';
    const pText = p.value.trim() || '-';
    let header = `${greeting()} dokter. Izin dok dengan ${dok}, dokter jaga IGD ${rs}.\nIzin konsul pasien IGD ${rs}.\n\n`;
    let id = `${np}\n${age}${weight}\n\n`;
    let body = `Dx: ${dxv}\n\nS: ${sText}\n\nO:\n${oText}\n\nTerapi IGD:\n${pText}\n\nMohon advice selanjutnya. Terima kasih dokter.`;
    return header + id + body;
  }

  // actions
  buatBtn.addEventListener('click', ()=>{
    const txt = generateOutput();
    hasil.textContent = txt;
    copyBtn.disabled = false;
  });

  copyBtn.addEventListener('click', async ()=>{
    const txt = hasil.textContent;
    if(!txt) return alert('Belum ada konsul untuk disalin.');
    await navigator.clipboard.writeText(txt);
    alert('Konsul tersalin ke clipboard.');
  });

  // history
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
    });
  }
  loadHistory();

  saveBtn.addEventListener('click', ()=>{
    const hist = JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');
    const item = {
      t: Date.now(),
      nama: namaPasien.value.trim() || '[Nama]',
      dx: dx.value.trim() || '[Dx]',
      s: s.value.trim(),
      o: oField.value.trim(),
      p: p.value.trim(),
      dok: namaDokter.value.trim(),
      rs: namaRS.value.trim()
    };
    hist.push(item);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
    loadHistory();
    alert('Tersimpan ke history lokal.');
  });

  historyEl.addEventListener('click', (ev)=>{
    const load = ev.target.getAttribute('data-load');
    const del = ev.target.getAttribute('data-del');
    const hist = JSON.parse(localStorage.getItem(HISTORY_KEY)||'[]');
    if(load){
      const it = hist[load];
      if(!it) return;
      namaPasien.value = it.nama; dx.value = it.dx; s.value = it.s; oField.value = it.o; p.value = it.p;
      namaDokter.value = it.dok || namaDokter.value; namaRS.value = it.rs || namaRS.value;
      hasil.textContent = generateOutput();
      copyBtn.disabled = false;
    } else if(del){
      if(!confirm('Hapus entry ini?')) return;
      hist.splice(del,1);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(hist));
      loadHistory();
    }
  });

  // templates (load/seed/populate)
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
  }

  function populateTemplateSelect(){
    const t = loadTemplates();
    templateSelect.innerHTML = '<option value="">-- Pilih template --</option>';
    t.forEach((tpl, idx)=>{
      const opt = document.createElement('option');
      opt.value = idx; opt.textContent = tpl.name;
      templateSelect.appendChild(opt);
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
  });

  // add template explicit button
  addTemplate.addEventListener('click', ()=>{
    const name = prompt('Nama template baru (cth: Sepsis cepat):');
    if(!name) return;
    const t = JSON.parse(localStorage.getItem(TEMPLATES_KEY)||'[]');
    t.push({name:name, dx:dx.value, s:s.value, p:p.value});
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(t));
    populateTemplateSelect();
    alert('Template baru disimpan.');
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
  });

  document.getElementById('closeTpl').addEventListener('click', ()=> manageTemplates.style.display='none');

  // AI Quick Copy workflow
  aiQuickBtn.addEventListener('click', ()=>{
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
  });

  // settings modal handlers
  settingsBtn.addEventListener('click', ()=> settingsModal.style.display='flex');
  closeSet.addEventListener('click', ()=> settingsModal.style.display='none');
  saveSet.addEventListener('click', ()=>{
    const s = { nama:setNama.value.trim(), rs:setRS.value.trim(), shifts:setShift.value, theme: document.documentElement.classList.contains('dark')? 'dark':'light' };
    saveSettingsObj(s);
    if(s.nama) namaDokter.value = s.nama;
    if(s.rs) namaRS.value = s.rs;
    settingsModal.style.display = 'none';
    alert('Pengaturan disimpan.');
    loadSettings();
  });

  // theme toggle
  themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    const s = loadSettingsObj();
    s.theme = isDark? 'dark':'light';
    saveSettingsObj(s);
    logoImg.src = isDark? 'logo_dark.png' : 'logo_light.png';
  });

});
