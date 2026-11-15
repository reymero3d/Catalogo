import { useState, useMemo } from 'react'
import { categories } from '../data/products'
import { formatPrice } from '../data/products'

// Fórmula de la calculadora-3d
function calcPrice({ grams, hours, minutes, priceKg, priceKwh, watts, lifespan, repair, errPct, mult, insumos, qty }) {
  const p = (hours || 0) + (minutes || 0) / 60
  const b = (grams / 1000) * priceKg * qty
  const x = (watts / 1000) * p * priceKwh * qty
  const h = (lifespan > 0 ? repair / lifespan : 0) * p * qty
  const g = (errPct / 100) * (b + x + h)
  const f = b + x + h + g
  const y = 1.3 * insumos * qty
  const precio = f * mult + y
  return { precio, b, x, h, g, f, y, p }
}

export default function Agregar({ onNavigate }) {
  const params = new URLSearchParams(window.location.search)

  const [token, setToken] = useState(localStorage.getItem('gh_token') || '')
  const [tokenInput, setTokenInput] = useState('')
  const [authStatus, setAuthStatus] = useState('checking') // checking | ok | need | invalid
  const [authError, setAuthError] = useState('')

  const [form, setForm] = useState({
    name: params.get('name') || '',
    category: 'figuras',
    material: 'PLA',
    color: '',
    colorMode: 'elegir',
    size: '',
    image: params.get('image') || '',
    description: '',
    featured: false,
    grams: parseFloat(params.get('grams')) || 0,
    hours: parseFloat(params.get('hours')) || 0,
    minutes: parseFloat(params.get('minutes')) || 0,
  })

  // Parámetros de calculadora
  const [calc, setCalc] = useState({
    priceKg: 25000,
    priceKwh: 140,
    watts: 95,
    lifespan: 4320,
    repair: 150000,
    errPct: 5,
    mult: 4,
    insumos: 0,
    qty: 1,
  })

  const [status, setStatus] = useState('')
  const [saving, setSaving] = useState(false)

  // Verificar token al montar
  useEffect(() => {
    if (!token) { setAuthStatus('need'); return }
    verifyToken(token)
  }, [])

  const verifyToken = async (t) => {
    setAuthStatus('checking')
    setAuthError('')
    try {
      const res = await fetch('https://api.github.com/user', {
        headers: { Authorization: `token ${t}`, Accept: 'application/vnd.github.v3+json' },
      })
      if (res.ok) {
        const u = await res.json()
        setAuthStatus('ok')
        setStatus(`✅ Bienvenido, ${u.login}`)
      } else {
        setAuthStatus('invalid')
        setAuthError('Token inválido o sin permisos. Ingresá un token válido.')
      }
    } catch (e) {
      setAuthStatus('invalid')
      setAuthError('Error al verificar el token.')
    }
  }

  const saveToken = () => {
    const t = tokenInput.trim()
    if (!t) { setAuthError('Ingresá un token.'); return }
    localStorage.setItem('gh_token', t)
    setToken(t)
    verifyToken(t)
  }

  const logout = () => {
    localStorage.removeItem('gh_token')
    setToken('')
    setTokenInput('')
    setAuthStatus('need')
    setStatus('')
  }

  const result = useMemo(() => calcPrice({ ...form, ...calc }), [form, calc])

  const updateForm = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const updateCalc = (k, v) => setCalc((c) => ({ ...c, [k]: v === '' ? 0 : Number(v) }))

  const saveProduct = async () => {
    if (!token) {
      setStatus('❌ Necesitás configurar tu GitHub token primero (abajo).')
      return
    }
    if (!form.name) {
      setStatus('❌ El nombre es obligatorio.')
      return
    }
    setSaving(true)
    setStatus('Guardando...')
    try {
      const owner = 'reymero3d'
      const repo = 'Catalogo'
      const path = 'src/data/products.json'

      // 1. Obtener archivo actual
      const getRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' },
      })
      if (!getRes.ok) throw new Error('No se pudo leer products.json: ' + getRes.status)
      const fileData = await getRes.json()
      const currentContent = JSON.parse(atob(fileData.content))
      const products = currentContent.products || []

      // 2. Generar nuevo ID
      const newId = products.length ? Math.max(...products.map((p) => p.id || 0)) + 1 : 1

      // 3. Crear producto
      const newProduct = {
        id: newId,
        name: form.name,
        category: form.category,
        price: Math.round(result.precio),
        description: form.description,
        material: form.material,
        color: form.color,
        colorMode: form.colorMode,
        size: form.size,
        image: form.image,
        featured: form.featured,
      }

      products.push(newProduct)
      const newContent = JSON.stringify({ products }, null, 2)

      // 4. Commit
      const putRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `feat: agregar producto ${form.name}`,
          content: btoa(unescape(encodeURIComponent(newContent))),
          sha: fileData.sha,
        }),
      })
      if (!putRes.ok) {
        const err = await putRes.json()
        throw new Error(err.message || 'Error al guardar')
      }
      setStatus('✅ Producto guardado. Netlify redeployará en ~1 minuto.')
    } catch (e) {
      setStatus('❌ ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const copyJson = () => {
    const newProduct = {
      id: 0,
      name: form.name,
      category: form.category,
      price: Math.round(result.precio),
      description: form.description,
      material: form.material,
      color: form.color,
      colorMode: form.colorMode,
      size: form.size,
      image: form.image,
      featured: form.featured,
    }
    navigator.clipboard.writeText(JSON.stringify(newProduct, null, 2))
    setStatus('✅ JSON copiado al portapapeles. Pegalo en el admin.')
  }

  if (authStatus !== 'ok') {
    return (
      <section className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-20 animate-fade-in">
        <div className="text-center mb-6">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Acceso restringido</h2>
          <p className="text-slate-500">Ingresá tu GitHub Personal Access Token para acceder al panel de administración.</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
          {authError && <p className="text-sm text-red-600">{authError}</p>}
          {authStatus === 'checking' && <p className="text-sm text-slate-500">Verificando...</p>}
          <div className="flex gap-2">
            <input
              type="password"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="ghp_... o github_pat_..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
            />
            <button onClick={saveToken} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
              Verificar
            </button>
          </div>
          <p className="text-xs text-slate-500">
            Creá un token en GitHub → Settings → Developer settings → Personal access tokens → con scope <code>repo</code>.
          </p>
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => onNavigate('home')} className="text-indigo-600 font-semibold hover:underline">
            ← Volver al inicio
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      <div className="mb-6">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-2">Importar</span>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Agregar producto desde MakerWorld</h2>
        <p className="text-slate-500 mt-1.5">Los datos se extrajeron de MakerWorld. Ajustá y guardá.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Formulario del producto */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg">Producto</h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input value={form.name} onChange={(e) => updateForm('name', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
            <select value={form.category} onChange={(e) => updateForm('category', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
              {categories.filter((c) => c.id !== 'all').map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Material</label>
              <input value={form.material} onChange={(e) => updateForm('material', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tamaño</label>
              <input value={form.size} onChange={(e) => updateForm('size', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tipo de color</label>
            <select value={form.colorMode} onChange={(e) => updateForm('colorMode', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500">
              <option value="elegir">El cliente elige el color</option>
              <option value="fijo">Color fijo</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Color</label>
            <input value={form.color} onChange={(e) => updateForm('color', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea value={form.description} onChange={(e) => updateForm('description', e.target.value)} rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 resize-none" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Imagen (URL)</label>
            <input value={form.image} onChange={(e) => updateForm('image', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
            {form.image && <img src={form.image} alt="preview" className="mt-2 w-full h-32 object-cover rounded-xl" />}
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.featured} onChange={(e) => updateForm('featured', e.target.checked)} className="rounded" />
            Destacado en la home
          </label>
        </div>

        {/* Calculadora */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
          <h3 className="font-bold text-slate-900 text-lg">Calculadora de precio</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Peso (g)</label>
              <input type="number" value={form.grams} onChange={(e) => updateForm('grams', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Horas</label>
              <input type="number" value={form.hours} onChange={(e) => updateForm('hours', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Minutos</label>
              <input type="number" value={form.minutes} onChange={(e) => updateForm('minutes', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Cantidad</label>
              <input type="number" value={calc.qty} onChange={(e) => updateCalc('qty', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <details className="text-sm">
            <summary className="cursor-pointer font-medium text-indigo-600">Parámetros avanzados</summary>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Filamento ($/kg)</label>
                <input type="number" value={calc.priceKg} onChange={(e) => updateCalc('priceKg', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">kWh ($)</label>
                <input type="number" value={calc.priceKwh} onChange={(e) => updateCalc('priceKwh', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Consumo (W)</label>
                <input type="number" value={calc.watts} onChange={(e) => updateCalc('watts', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Vida útil (h)</label>
                <input type="number" value={calc.lifespan} onChange={(e) => updateCalc('lifespan', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Repuestos ($)</label>
                <input type="number" value={calc.repair} onChange={(e) => updateCalc('repair', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Margen error (%)</label>
                <input type="number" value={calc.errPct} onChange={(e) => updateCalc('errPct', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Multiplicador</label>
                <input type="number" step="0.1" value={calc.mult} onChange={(e) => updateCalc('mult', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Insumos ($)</label>
                <input type="number" value={calc.insumos} onChange={(e) => updateCalc('insumos', e.target.value)} className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
          </details>

          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="text-xs text-indigo-600 font-bold uppercase tracking-wide">Precio calculado</div>
            <div className="text-3xl font-extrabold text-indigo-700 mt-1">{formatPrice(Math.round(result.precio))}</div>
            <div className="text-xs text-slate-500 mt-2 space-y-0.5">
              <div>Material: {formatPrice(result.b)}</div>
              <div>Luz: {formatPrice(result.x)}</div>
              <div>Desgaste: {formatPrice(result.h)}</div>
              <div>Margen error: {formatPrice(result.g)}</div>
              <div>Insumos: {formatPrice(result.y)}</div>
            </div>
          </div>

          <div className="text-sm font-medium text-slate-700">
            Precio final: <span className="text-indigo-600 font-bold">{formatPrice(Math.round(result.precio))}</span>
          </div>
        </div>
      </div>

      {/* Guardar */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-900 text-lg">Guardar producto</h3>

        {authStatus !== 'ok' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
            <p className="text-sm font-medium text-amber-800">
              🔒 Ingresá tu GitHub Personal Access Token para acceder al panel.
            </p>
            {authError && <p className="text-sm text-red-600">{authError}</p>}
            {authStatus === 'checking' && <p className="text-sm text-slate-500">Verificando...</p>}
            <div className="flex gap-2">
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_... o github_pat_..."
                className="flex-1 px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500"
              />
              <button onClick={saveToken} className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition">
                Verificar
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Creá un token en GitHub → Settings → Developer settings → Personal access tokens → con scope <code>repo</code>.
            </p>
          </div>
        )}

        {authStatus === 'ok' && (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl p-3">
            <span className="text-sm font-medium text-green-700">✅ Token verificado. Podés guardar productos.</span>
            <button onClick={logout} className="text-xs text-red-500 hover:text-red-700 font-medium">Cerrar sesión</button>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={saveProduct}
            disabled={saving}
            className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : '💾 Guardar en el catálogo'}
          </button>
          <button
            onClick={copyJson}
            className="px-4 py-3 rounded-xl border border-slate-300 text-slate-600 font-semibold hover:bg-slate-100 transition"
          >
            📋 Copiar JSON
          </button>
        </div>

        {status && (
          <div className={`text-sm font-medium ${status.startsWith('✅') ? 'text-green-600' : status.startsWith('❌') ? 'text-red-600' : 'text-slate-600'}`}>
            {status}
          </div>
        )}
      </div>
    </section>
  )
}
