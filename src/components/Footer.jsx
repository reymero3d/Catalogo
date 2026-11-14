import { formatPrice } from '../data/products'

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🖨️</span>
            <span className="font-extrabold text-xl text-white">reymero<span className="text-indigo-400">3d</span></span>
          </div>
          <p className="mt-3 text-sm text-slate-400">
            Impresión 3D personalizada. Tu idea, impresa en 3D.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Navegación</h4>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => onNavigate('home')} className="hover:text-white">Inicio</button></li>
            <li><button onClick={() => onNavigate('catalog')} className="hover:text-white">Catálogo</button></li>
            <li><button onClick={() => onNavigate('about')} className="hover:text-white">Nosotros</button></li>
            <li><button onClick={() => onNavigate('contact')} className="hover:text-white">Contacto</button></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Categorías</h4>
          <ul className="space-y-2 text-sm">
            <li>Figuras</li>
            <li>Llaveros</li>
            <li>Decoración</li>
            <li>Litofanías</li>
            <li>Personalizado</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Contacto</h4>
          <ul className="space-y-2 text-sm">
            <li>📲 WhatsApp</li>
            <li>✉️ hola@reymero3d.com</li>
            <li>📍 Argentina</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} reymero3d. Todos los derechos reservados.
      </div>
    </footer>
  )
}
