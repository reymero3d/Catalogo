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
    // Fallback: buscar cualquier URL de imagen en el JSON
    if (!data.image) {
      try {
        const nextScript = document.getElementById('__NEXT_DATA__');
        if (nextScript) {
          const m = nextScript.textContent.match(/https?:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/i);
          if (m) data.image = m[0];
        }
      } catch (e) {}
    }
    if (!data.image) {
      const og = document.querySelector('meta[property="og:image"]');
      if (og) data.image = og.getAttribute('content') || data.image;
    }
    if (!data.image) {
      // Buscar en srcset / data-src / lazy
      const imgs = Array.from(document.querySelectorAll('img'));
      let best = null;
      imgs.forEach((img) => {
        const src = img.currentSrc || img.src || img.getAttribute('data-src') || img.getAttribute('data-original') || '';
        if (!src || src.includes('avatar') || src.includes('icon') || src.includes('logo')) return;
        const w = img.naturalWidth || img.width || 0;
        const h = img.naturalHeight || img.height || 0;
        const area = w * h;
        if (!best || area > best.area) { best = { src, area }; }
      });
      if (best && best.src) data.image = best.src;
    }
    if (!data.image) {
      // Background images
      const nodes = Array.from(document.querySelectorAll('*'));
      let bestBg = null;
      nodes.forEach((n) => {
        const bg = getComputedStyle(n).backgroundImage;
        if (bg && bg !== 'none') {
          const m = bg.match(/url\(["']?(https?:\/\/[^"')]+)["']?\)/i);
          if (m && !m[1].includes('avatar') && !m[1].includes('icon')) {
            const area = (n.clientWidth || 0) * (n.clientHeight || 0);
            if (!bestBg || area > bestBg.area) bestBg = { src: m[1], area };
          }
        }
      });
      if (bestBg) data.image = bestBg.src;
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
