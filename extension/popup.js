// popup.js
document.addEventListener('DOMContentLoaded', async () => {
  const content = document.getElementById('content');

  // Obtener el tab activo
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.url || !tab.url.includes('makerworld.com')) {
    content.innerHTML = '<p class="status error">Abrí una página de modelo en MakerWorld primero.</p>';
    return;
  }

  // Pedir extracción al content script
  let data;
  try {
    data = await chrome.tabs.sendMessage(tab.id, { action: 'extract' });
  } catch (e) {
    // Content script no inyectado; inyectar manualmente
    try {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
      data = await chrome.tabs.sendMessage(tab.id, { action: 'extract' });
    } catch (e2) {
      content.innerHTML = '<p class="status error">No se pudo extraer datos. Recargá la página de MakerWorld.</p>';
      return;
    }
  }

  if (!data || !data.name) {
    content.innerHTML = '<p class="status error">No se encontraron datos del modelo.</p>';
    return;
  }

  // Mostrar preview
  let html = '';
  if (data.image) {
    html += `<img class="preview" src="${data.image}" alt="${data.name}" />`;
  }
  html += `<div class="field"><div class="label">Nombre</div><div class="value">${data.name}</div></div>`;
  html += `<div class="field"><div class="label">Peso</div><div class="value">${data.grams} g</div></div>`;
  html += `<div class="field"><div class="label">Tiempo</div><div class="value">${data.hours}h ${data.minutes}m</div></div>`;
  html += `<div class="field"><div class="label">URL</div><div class="value" style="font-size:10px">${data.url}</div></div>`;

  // Botón: copiar JSON al portapapeles
  html += `<button class="btn btn-primary" id="copyBtn">📋 Copiar datos (JSON)</button>`;
  // Botón: abrir admin con datos en URL
  const params = new URLSearchParams({
    name: data.name,
    image: data.image,
    grams: data.grams,
    hours: data.hours,
    minutes: data.minutes,
    url: data.url,
  });
  html += `<button class="btn btn-secondary" id="openBtn">🔗 Abrir en catálogo</button>`;
  html += `<p class="status" id="statusMsg"></p>`;

  content.innerHTML = html;

  // Copiar JSON
  document.getElementById('copyBtn').addEventListener('click', async () => {
    const json = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(json);
    document.getElementById('statusMsg').textContent = '✅ Datos copiados al portapapeles';
  });

  // Abrir en catálogo
  document.getElementById('openBtn').addEventListener('click', () => {
    const url = `https://reymero3d.netlify.app/agregar?${params.toString()}`;
    chrome.tabs.create({ url });
  });
});
