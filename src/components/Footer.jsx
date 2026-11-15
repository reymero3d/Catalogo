export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-gradient-to-br from-slate-900 to-indigo-950 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🖨️</span>
            <span className="font-extrabold text-xl text-white">reymero<span className="text-indigo-400">3d</span></span>
          </div>
          <p className="mt-3 text-sm text-slate-400 leading-relaxed">
            Impresión 3D personalizada. Tu idea, impresa en 3D con la mejor calidad.
          </p>
          <div className="mt-5 flex gap-3">
            {['Instagram', 'WhatsApp', 'Email'].map((s) => (
              <span key={s} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center cursor-pointer transition text-xs font-bold">
                {s[0]}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Navegación</h4>
          <ul className="space-y-2.5 text-sm">
            {[
              { id: 'home', label: 'Inicio' },
              { id: 'catalog', label: 'Catálogo' },
              { id: 'about', label: 'Nosotros' },
              { id: 'contact', label: 'Contacto' },
            ].map((n) => (
              <li key={n.id}>
                <button onClick={() => onNavigate(n.id)} className="hover:text-white hover:translate-x-1 inline-block transition">
                  {n.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Categorías</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li>Figuras</li>
            <li>Llaveros</li>
            <li>Decoración</li>
            <li>Litofanías</li>
            <li>Personalizado</li>
            <li>Utilitarios</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-4">Contacto</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li className="flex items-center gap-2">📲 WhatsApp</li>
            <li className="flex items-center gap-2">✉️ hola@reymero3d.com</li>
            <li className="flex items-center gap-2">📍 Argentina</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} reymero3d. Todos los derechos reservados.
      </div>
    </footer>
  )
}
