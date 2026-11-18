// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('content');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url || !tab.url.includes('makerworld.com')) {
    content.innerHTML = '<p class="status error">Abrí una página de modelo en MakerWorld primero.</p>';
    return;
  }

  let data;
  try {
    data = await chrome.tabs.sendMessage(tab.id, { action: 'extract' });
  } catch (e) {
    try {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
      data = await chrome.tabs.sendMessage(tab.id, { action: 'extract' });
    } catch (e2) {
      content.innerHTML = '<p class="status error">No se pudo extraer datos. Recargá la página de MakerWorld.</p>';
      return;
    }
  }

  if (!data || !data.name) {
    let html = '<p class="status error">No se encontraron datos del modelo.</p>';
    if (data && data.debug) {
      html += '<details style="margin-top:8px;font-size:11px;"><summary>Debug</summary>';
      html += '<pre style="white-space:pre-wrap;word-break:break-all;max-height:300px;overflow:auto;">' + JSON.stringify(data.debug, null, 2) + '</pre>';
      html += '</details>';
    }
    content.innerHTML = html;
    return;
  }

  // Mostrar perfiles A1 encontrados
  const a1Profiles = (data.debug.allInstances || []).filter((p) => p.isA1);
  const allProfiles = data.debug.allInstances || [];

  let html = '';
  if (data.image) {
    html += `<img class="preview" src="${data.image}" alt="${data.name}" />`;
  }
  html += `<div class="field"><div class="label">Nombre</div><div class="value">${data.name}</div></div>`;
  html += `<div class="field"><div class="label">Peso</div><div class="value">${data.grams} g</div></div>`;
  html += `<div class="field"><div class="label">Tiempo</div><div class="value">${data.hours}h ${data.minutes}m</div></div>`;

  // Selector de perfil si hay varios
  if (allProfiles.length > 1) {
    html += `<div class="field"><div class="label">Perfil (${allProfiles.length} disponibles${a1Profiles.length ? ', ' + a1Profiles.length + ' para A1' : ''})</div>`;
    html += `<select id="profileSelect" style="width:100%;padding:6px;border-radius:6px;border:1px solid #cbd5e1;font-size:12px;">`;
    allProfiles.forEach((p, i) => {
      const marker = p.isA1 ? ' ⭐ A1' : '';
      const sel = (p.title === data.debug.chosen?.title) ? 'selected' : '';
      html += `<option value="${i}" ${sel}>${p.title} (${p.weight}g)${marker}</option>`;
    });
    html += `</select></div>`;
  }

  html += `<button class="btn btn-primary" id="copyBtn">📋 Copiar datos (JSON)</button>`;
  const params = new URLSearchParams({
    name: data.name,
    image: data.image,
    grams: data.grams,
    hours: data.hours,
    minutes: data.minutes,
    url: data.url,
  });
  html += `<button class="btn btn-secondary" id="openBtn">🔗 Abrir en catálogo</button>`;
  html += `<button class="btn btn-secondary" id="openCalcBtn">Abrir en calculadora</button>`;
  html += `<p class="status" id="statusMsg"></p>`;

  content.innerHTML = html;

  // Si cambia el perfil seleccionado, actualizar datos
  const profileSelect = document.getElementById('profileSelect');
  if (profileSelect) {
    profileSelect.addEventListener('change', () => {
      const idx = parseInt(profileSelect.value);
      const prof = allProfiles[idx];
      if (prof) {
        data.grams = prof.weight || data.grams;
        // Tiempo
        if (typeof prof.prediction === 'number' && prof.prediction > 0) {
          data.hours = Math.floor(prof.prediction / 3600);
          data.minutes = Math.floor((prof.prediction % 3600) / 60);
        } else {
          const ext = prof.extentionData || {};
          for (const key of Object.keys(ext)) {
            if (/time|hour|minute|duration/i.test(key)) {
              const val = ext[key];
              if (typeof val === 'number') {
                if (val > 3600) { data.hours = Math.floor(val / 3600); data.minutes = Math.floor((val % 3600) / 60); }
                else if (val > 60) { data.hours = Math.floor(val / 60); data.minutes = val % 60; }
              } else if (typeof val === 'string') {
                const m = val.match(/(\\d+)\\s*h(?:\\s*(\\d+)\\s*m)?/i);
                if (m) { data.hours = parseInt(m[1]); data.minutes = m[2] ? parseInt(m[2]) : 0; }
              }
            }
          }
        }
        const gEl = document.querySelector('.field:nth-child(3) .value');
        if (gEl) gEl.textContent = data.grams + ' g';
        const tEl = document.querySelector('.field:nth-child(4) .value');
        if (tEl) tEl.textContent = data.hours + 'h ' + data.minutes + 'm';
      }
    });
  }

  document.getElementById('copyBtn').addEventListener('click', async () => {
    const json = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(json);
    document.getElementById('statusMsg').textContent = '✅ Datos copiados al portapapeles';
  });

  document.getElementById('openBtn').addEventListener('click', () => {
    const url = `https://reymero3d.netlify.app/agregar?${params.toString()}`;
    chrome.tabs.create({ url });
  });

  const openCalcBtn = document.getElementById('openCalcBtn');
  if (openCalcBtn) {
    openCalcBtn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(JSON.stringify(data, null, 2)); } catch (e) {}
      chrome.tabs.create({ url: 'https://reymero3d.github.io/Calculadora-3D-/index.html' });
      const sm = document.getElementById('statusMsg');
      if (sm) sm.textContent = 'Datos copiados. En la calculadora usá "Pegar desde portapapeles".';
    });
  }
});
