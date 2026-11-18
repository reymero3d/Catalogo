// content.js - se inyecta en páginas de makerworld.com
(function () {
  // Palabras clave para identificar impresoras A1 / A1 Mini
  const A1_KEYWORDS = ['a1', 'a1 mini', 'a1mini', 'bambu a1'];

  function isA1(profile) {
    const text = ((profile.title || '') + ' ' + (profile.extention ? JSON.stringify(profile.extention) : '') + ' ' + ((profile.lacInfo && profile.lacInfo.machineName) || '')).toLowerCase();
    return A1_KEYWORDS.some((kw) => text.includes(kw));
  }

  function extract() {
    const data = {
      name: '',
      image: '',
      grams: 0,
      hours: 0,
      minutes: 0,
      url: location.href,
      debug: {},
    };

    try {
      const nextScript = document.getElementById('__NEXT_DATA__');
      if (!nextScript) {
        data.debug.noNextData = true;
        return data;
      }
      const json = JSON.parse(nextScript.textContent);
      data.debug.nextData = true;

      const design = json.props && json.props.pageProps && json.props.pageProps.design;
      if (!design) {
        data.debug.noDesign = true;
        return data;
      }

      // Nombre e imagen del modelo
      data.name = design.title || data.name;
      data.image = design.coverUrl || design.coverPortrait || design.cover || design.previewUrl || design.thumbnail || data.image;

      const instances = design.instances || [];
      data.debug.totalInstances = instances.length;

      // Listar todos los perfiles con info relevante
      data.debug.allInstances = instances.map((inst) => {
        const ext = inst.extention || {};
        return {
          title: inst.title,
          weight: inst.weight,
          prediction: inst.prediction,
          machineName: (inst.lacInfo && inst.lacInfo.machineName) || '',
          extentionKeys: Object.keys(ext),
          extentionData: Object.fromEntries(
            Object.entries(ext).filter(([k, v]) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')
          ),
          isA1: isA1(inst),
        };
      });

      // Filtrar solo A1 / A1 Mini
      const a1Instances = instances.filter(isA1);
      data.debug.a1Count = a1Instances.length;

      // Si no hay A1, usar todos (fallback)
      const candidates = a1Instances.length > 0 ? a1Instances : instances;

      // Elegir el primer candidato (o el default si existe)
      const chosen = candidates.find((i) => i.isDefault) || candidates[0];
      if (chosen) {
        data.name = design.title;
        data.image = chosen.cover || chosen.preview || chosen.coverUrl || design.coverUrl || design.coverPortrait || design.cover || data.image;
        data.grams = chosen.weight || 0;

        // Tiempo de impresión: buscar en prediction, extention, o campos de tiempo
        // prediction puede ser segundos
        if (chosen.prediction && typeof chosen.prediction === 'number') {
          data.hours = Math.floor(chosen.prediction / 3600);
          data.minutes = Math.floor((chosen.prediction % 3600) / 60);
        }

        // Buscar tiempo en extention
        const ext = chosen.extention || {};
        for (const key of Object.keys(ext)) {
          if (/time|hour|minute|duration/i.test(key)) {
            const val = ext[key];
            if (typeof val === 'number') {
              if (val > 3600) {
                data.hours = Math.floor(val / 3600);
                data.minutes = Math.floor((val % 3600) / 60);
              } else if (val > 60) {
                data.hours = Math.floor(val / 60);
                data.minutes = val % 60;
              }
            } else if (typeof val === 'string') {
              const m = val.match(/(\d+)\s*h(?:\s*(\d+)\s*m)?/i);
              if (m) {
                data.hours = parseInt(m[1]);
                data.minutes = m[2] ? parseInt(m[2]) : 0;
              }
            }
          }
        }

        data.debug.chosen = {
          title: chosen.title,
          weight: chosen.weight,
          prediction: chosen.prediction,
          extentionKeys: Object.keys(chosen.extention || {}),
          extentionData: Object.fromEntries(
            Object.entries(chosen.extention || {}).filter(([k, v]) => typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean')
          ),
          lacInfo: chosen.lacInfo || {},
        };
      }
    } catch (e) {
      data.debug.error = e.message;
    }

    // Fallback DOM para nombre/imagen si no se encontró
    if (!data.name) {
      const h1 = document.querySelector('h1');
      if (h1) data.name = h1.textContent.trim();
    }
    if (!data.image) {
      const og = document.querySelector('meta[property="og:image"]');
      if (og) data.image = og.getAttribute('content') || data.image;
    }
    if (!data.image) {
      const imgs = Array.from(document.querySelectorAll('img'));
      const bigImg = imgs.find((img) => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        return w >= 200 && h >= 200 && img.src && !img.src.includes('avatar') && !img.src.includes('icon');
      });
      if (bigImg) data.image = bigImg.src;
    }

    return data;
  }

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extract') {
      sendResponse(extract());
    }
  });

  const data = extract();
  chrome.storage.local.set({ lastExtracted: data });
  console.log('Reymero3D extracted:', data);
})();
