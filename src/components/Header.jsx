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
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={() => nav('home')} className="flex items-center gap-2">
            <span className="text-2xl">🖨️</span>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">
              reymero<span className="text-indigo-600">3d</span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button onClick={() => nav('home')} className="hover:text-indigo-600 transition">Inicio</button>
            <button onClick={() => nav('catalog')} className="hover:text-indigo-600 transition">Catálogo</button>
            <button onClick={() => nav('about')} className="hover:text-indigo-600 transition">Nosotros</button>
            <button onClick={() => nav('contact')} className="hover:text-indigo-600 transition">Contacto</button>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className="relative p-2 rounded-full hover:bg-slate-100 transition"
              aria-label="Carrito"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-slate-100"
              aria-label="Menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="px-4 py-3 flex flex-col gap-2 text-sm font-medium text-slate-600">
            <button onClick={() => nav('home')} className="text-left py-2">Inicio</button>
            <button onClick={() => nav('catalog')} className="text-left py-2">Catálogo</button>
            <button onClick={() => nav('about')} className="text-left py-2">Nosotros</button>
            <button onClick={() => nav('contact')} className="text-left py-2">Contacto</button>
          </div>
        </div>
      )}
    </header>
  )
}
