import { useState } from 'react'
import { useCart } from '../context/CartContext'

export default function Header({ onNavigate }) {
  const { count, setOpen } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const nav = (id) => {
    onNavigate(id)
    setMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => nav('home')} className="flex items-center gap-2 group">
            <span className="text-2xl group-hover:scale-110 transition-transform">🖨️</span>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              reymero<span className="text-indigo-600">3d</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            {[
              { id: 'home', label: 'Inicio' },
              { id: 'catalog', label: 'Catálogo' },
              { id: 'about', label: 'Nosotros' },
              { id: 'contact', label: 'Contacto' },
              { id: 'agregar', label: 'Importar' },
            ].map((n) => (
              <button
                key={n.id}
                onClick={() => nav(n.id)}
                className="px-4 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition"
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOpen(true)}
              className="relative p-2.5 rounded-full hover:bg-slate-100 transition group"
              aria-label="Carrito"
            >
              <svg className="w-5 h-5 text-slate-700 group-hover:text-indigo-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 min-w-[18px] px-1 flex items-center justify-center shadow">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2.5 rounded-full hover:bg-slate-100"
              aria-label="Menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200/60 bg-white/95 backdrop-blur">
          <div className="px-4 py-3 flex flex-col gap-1 text-sm font-medium text-slate-600">
            {[
              { id: 'home', label: 'Inicio' },
              { id: 'catalog', label: 'Catálogo' },
              { id: 'about', label: 'Nosotros' },
              { id: 'contact', label: 'Contacto' },
              { id: 'agregar', label: 'Importar' },
            ].map((n) => (
              <button key={n.id} onClick={() => nav(n.id)} className="text-left px-3 py-2 rounded-lg hover:bg-indigo-50 hover:text-indigo-600">
                {n.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
