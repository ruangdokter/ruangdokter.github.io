// Ruang Dokter v1.1 - features: vitals->Objective auto, settings (localStorage), theme, history localStorage, AI dummy
document.addEventListener('DOMContentLoaded', ()=>{
  // Elements
  const namaDokter = document.getElementById('namaDokter');
  const namaRS = document.getElementById('namaRS');
  const subjektif = document.getElementById('subjektif');
  const objektif = document.getElementById('objektif');
  const td = document.getElementById('td');
  const hr = document.getElementById('hr');
  const rr = document.getElementById('rr');
  const temp = document.getElementById('temp');
  const spo2 = document.getElementById('spo2');
  const gcsE = document.getElementById('gcsE');
  const gcsV = document.getElementById('gcsV');
  const gcsM = document.getElementById('gcsM');
  const diagnosis = document.getElementById('diagnosis');
  const terapi = document.getElementById('terapi');
  const generateBtn = document.getElementById('generateBtn');
  const copyBtn = document.getElementById('copyBtn');
  const hasilKonsul = document.getElementById('hasilKonsul');
  const aiBtn = document.getElementById('aiBtn');
  const aiResult = document.getElementById('aiResult');
  const saveHistory = document.getElementById('saveHistory');
  const historyList = document.getElementById('historyList');

  // settings modal
  const settingsBtn = document.getElementById('settingsBtn');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettings = document.getElementById('closeSettings');
  const saveSettings = document.getElementById('saveSettings');
  const modalNama = document.getElementById('modalNama');
  const modalRS = document.getElementById('modalRS');
  const modalShifts = document.getElementById('modalShifts');

  const themeToggle = document.getElementById('themeToggle');

  // load settings if exist
  function loadSettings(){
    const s = JSON.parse(localStorage.getItem('rd_settings') || '{}');
    if(s.nama) namaDokter.value = s.nama;
    if(s.rs) namaRS.value = s.rs;
    if(s.theme==='dark') document.documentElement.classList.add('dark');
    if(s.shifts) modalShifts.value = s.shifts;
    // fill modal
    modalNama.value = s.nama || '';
    modalRS.value = s.rs || '';
  }
  loadSettings();

  // theme toggle
  themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    const s = JSON.parse(localStorage.getItem('rd_settings')||'{}');
    s.theme = isDark? 'dark':'light';
    localStorage.setItem('rd_settings', JSON.stringify(s));
    themeToggle.textContent = isDark? '☀️':'🌙';
  });

  // open settings
  settingsBtn.addEventListener('click', ()=>{
    settingsModal.style.display = 'flex';
  });
  closeSettings.addEventListener('click', ()=>{ settingsModal.style.display='none'; });
  saveSettings.addEventListener('click', ()=>{
    const s = { nama: modalNama.value.trim(), rs: modalRS.value.trim(), shifts: modalShifts.value };
    localStorage.setItem('rd_settings', JSON.stringify(s));
    // apply immediately
    if(s.nama) namaDokter.value = s.nama;
    if(s.rs) namaRS.value = s.rs;
    settingsModal.style.display='none';
    alert('Pengaturan disimpan.');
  });

  // auto-generate objektif from vitals
  function buildObjective(){
    const parts = [];
    if(td.value) parts.push('TD: '+td.value);
    if(hr.value) parts.push('HR: '+hr.value+' x/m');
    if(rr.value) parts.push('RR: '+rr.value+' x/m');
    if(temp.value) parts.push('T: '+temp.value+' °C');
    if(spo2.value) parts.push('SpO2: '+spo2.value+'% RA');
    const ge = (gcsE.value||'').trim();
    const gv = (gcsV.value||'').trim();
    const gm = (gcsM.value||'').trim();
    if(ge||gv||gm) parts.push('GCS: E'+(ge||'-')+'V'+(gv||'-')+'M'+(gm||'-'));
    objektif.value = parts.join(', ');
  }

  [td,hr,rr,temp,spo2,gcsE,gcsV,gcsM].forEach(el=> el.addEventListener('input', buildObjective));

  // greeting function based on local time
  function greetingText(){
    const hour = new Date().getHours();
    if(hour>=5 && hour<11) return 'Selamat pagi';
    if(hour>=11 && hour<15) return 'Selamat siang';
    if(hour>=15 && hour<18) return 'Selamat sore';
    return 'Selamat malam';
  }

  // generate template
  function generateTemplate(){
    const dokter = namaDokter.value.trim() || 'dr. [nama]';
    const rs = namaRS.value.trim() || '[Nama RS]';
    const sText = subjektif.value.trim() || '-';
    const oText = objektif.value.trim() || '-';
    const aText = diagnosis.value.trim() || '-';
    const pText = terapi.value.trim() || '-';
    const head = `${greetingText()} dokter. Izin dengan ${dokter}, dokter jaga IGD ${rs}.\nIzin konsul pasien IGD ${rs}.\n\n`;
    const body = `S: ${sText}\nO: ${oText}\nA: ${aText}\nP: ${pText}\n`;
    return head + body + '\nMohon advice selanjutnya. Terima kasih dokter.';
  }

  generateBtn.addEventListener('click', ()=>{
    const txt = generateTemplate();
    hasilKonsul.textContent = txt;
    copyBtn.disabled = false;
    aiResult.hidden = true;
  });

  copyBtn.addEventListener('click', async ()=>{
    const txt = hasilKonsul.textContent;
    if(!txt) return alert('Belum ada teks untuk disalin.');
    await navigator.clipboard.writeText(txt);
    alert('Konsul tersalin ke clipboard.');
  });

  // simple history functions
  function loadHistory(){
    const hist = JSON.parse(localStorage.getItem('rd_history')||'[]');
    historyList.innerHTML = '';
    hist.slice().reverse().forEach((item, idx)=>{
      const id = hist.length-1-idx;
      const div = document.createElement('div');
      div.className = 'history-item';
      div.innerHTML = `<div class="meta">${new Date(item.t).toLocaleString()} — ${item.dok}</div>
        <div style="margin-top:6px;font-weight:600">${item.dx}</div>
        <div style="margin-top:6px">${item.snippet}</div>
        <div style="margin-top:8px;display:flex;gap:8px">
          <button class="btn small" data-load="${id}">Load</button>
          <button class="btn small secondary" data-del="${id}">Hapus</button>
        </div>`;
      historyList.appendChild(div);
    });
  }
  loadHistory();

  // save to history
  saveHistory.addEventListener('click', ()=>{
    const hist = JSON.parse(localStorage.getItem('rd_history')||'[]');
    const item = {
      t: Date.now(),
      dok: namaDokter.value.trim() || 'dr. [nama]',
      rs: namaRS.value.trim() || '[RS]',
      s: subjektif.value.trim(),
      o: objektif.value.trim(),
      dx: diagnosis.value.trim(),
      tx: terapi.value.trim(),
      snippet: (subjektif.value.trim()||'').slice(0,120) || (diagnosis.value.trim()||'').slice(0,120)
    };
    hist.push(item);
    localStorage.setItem('rd_history', JSON.stringify(hist));
    loadHistory();
    alert('Tersimpan ke history.');
  });

  // history click handlers (load or delete)
  historyList.addEventListener('click', (e)=>{
    const loadId = e.target.getAttribute('data-load');
    const delId = e.target.getAttribute('data-del');
    const hist = JSON.parse(localStorage.getItem('rd_history')||'[]');
    if(loadId){
      const item = hist[loadId];
      if(!item) return;
      namaDokter.value = item.dok; namaRS.value = item.rs;
      subjektif.value = item.s; objektif.value = item.o; diagnosis.value = item.dx; terapi.value = item.tx;
      hasilKonsul.textContent = generateTemplate();
      copyBtn.disabled = false;
    } else if(delId){
      if(!confirm('Hapus entry ini?')) return;
      hist.splice(delId,1);
      localStorage.setItem('rd_history', JSON.stringify(hist));
      loadHistory();
    }
  });

  // AI dummy (placeholder for integration)
  aiBtn.addEventListener('click', ()=>{
    const txt = hasilKonsul.textContent || generateTemplate();
    aiResult.hidden = false;
    aiResult.innerHTML = '<strong>Analisis AI (contoh):</strong><br>1. Diagnosis sesuai dengan keluhan dan temuan awal. 2. Pastikan antibiotik empiris pada kecurigaan sepsis. 3. Monitor GCS dan pertimbangkan airway protection jika GCS ≤ 8.';
    // In production: call remote AI API here
  });

  // load settings on start
  loadSettings();
});