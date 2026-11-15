// content.js - se inyecta en páginas de makerworld.com
(function () {
  function extract() {
    const data = {
      name: '',
      image: '',
      grams: 0,
      hours: 0,
      minutes: 0,
      url: location.href,
    };

    // Nombre: primer h1
    const h1 = document.querySelector('h1');
    if (h1) data.name = h1.textContent.trim();

    // Imagen principal: primera img grande
    const imgs = Array.from(document.querySelectorAll('img'));
    const bigImg = imgs.find((img) => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      return w >= 200 && h >= 200 && img.src && !img.src.includes('avatar') && !img.src.includes('icon');
    });
    if (bigImg) data.image = bigImg.src;

    // Buscar peso (gramos) y tiempo (horas/minutos) en el texto de la página
    const text = document.body.innerText;

    // Peso: patrones como "123 g", "123g", "Weight: 123g", "Filament: 123 g"
    const weightMatch = text.match(/(?:weight|peso|filament|filamento)[^\d]{0,20}(\d+(?:[.,]\d+)?)\s*g/i);
    if (weightMatch) data.grams = parseFloat(weightMatch[1].replace(',', '.'));

    // Tiempo: patrones como "2h 30m", "2:30", "2 hours", "1h 45min", "Tiempo: 2h 30m"
    const timeMatch = text.match(/(?:time|tiempo|print time|estimated)[^\d]{0,20}(\d+)\s*h(?:\s*(\d+)\s*m)?/i);
    if (timeMatch) {
      data.hours = parseInt(timeMatch[1], 10);
      data.minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
    } else {
      const timeMatch2 = text.match(/(\d+)\s*h\s*(\d+)\s*m/i);
      if (timeMatch2) {
        data.hours = parseInt(timeMatch2[1], 10);
        data.minutes = parseInt(timeMatch2[2], 10);
      }
    }

    // Si no encontró peso/tiempo, intentar buscar en elementos con data attributes o clases comunes
    if (data.grams === 0) {
      const els = Array.from(document.querySelectorAll('[class*="weight"], [class*="gram"], [data-weight]'));
      for (const el of els) {
        const m = (el.textContent || el.getAttribute('data-weight') || '').match(/(\d+(?:[.,]\d+)?)\s*g/i);
        if (m) { data.grams = parseFloat(m[1].replace(',', '.')); break; }
      }
    }

    return data;
  }

  // Enviar datos al popup cuando se solicite
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extract') {
      sendResponse(extract());
    }
  });

  // También guardar en storage para que el popup lo lea
  const data = extract();
  chrome.storage.local.set({ lastExtracted: data });
})();
