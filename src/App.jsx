import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Catalog from './components/Catalog'
import About from './components/About'
import Contact from './components/Contact'
import Agregar from './components/Agregar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ProductModal from './components/ProductModal'
import ProductCard from './components/ProductCard'
import { products } from './data/products'

function AppInner() {
  const initialPage = (() => {
    const path = window.location.pathname.toLowerCase()
    const search = window.location.search
    if (path.includes('admin') || path.includes('agregar') || search.includes('grams=') || search.includes('name=')) return 'agregar'
    return 'home'
  })()
  const [page, setPage] = useState(initialPage)
  const [product, setProduct] = useState(null)

  const navigate = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const featured = products.filter((p) => p.featured).slice(0, 4)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header onNavigate={navigate} />
      <main>
        {page === 'home' && (
          <>
            <Hero onNavigate={navigate} />
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-2">Destacados</span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Nuestros más elegidos</h2>
                  <p className="text-slate-500 mt-1.5">Piezas que nuestros clientes aman</p>
                </div>
                <button onClick={() => navigate('catalog')} className="hidden sm:inline-flex items-center gap-1 text-indigo-600 font-semibold hover:gap-2 transition-all">
                  Ver todo →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={setProduct} />
                ))}
              </div>
              <div className="sm:hidden mt-6 text-center">
                <button onClick={() => navigate('catalog')} className="text-indigo-600 font-semibold hover:underline">
                  Ver todo el catálogo →
                </button>
              </div>
            </section>

            <section className="bg-white border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid md:grid-cols-3 gap-8">
                {[
                  { icon: '🎨', t: 'Diseño a medida', d: 'Personalizamos cada pieza según tu idea. Envíanos tu archivo o foto.' },
                  { icon: '⚡', t: 'Producción rápida', d: 'Entregas en 24 a 72 horas. Seguimiento por WhatsApp.' },
                  { icon: '📦', t: 'Envíos a todo el país', d: 'Coordinamos el envío y el pago por WhatsApp.' },
                ].map((f) => (
                  <div key={f.t} className="flex gap-4 items-start p-5 rounded-2xl hover:bg-slate-50 transition">
                    <div className="text-3xl shrink-0">{f.icon}</div>
                    <div>
                      <h3 className="font-bold text-slate-900">{f.t}</h3>
                      <p className="mt-1 text-sm text-slate-500 leading-relaxed">{f.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
        {page === 'catalog' && <Catalog onOpenProduct={setProduct} />}
        {page === 'about' && <About />}
        {page === 'contact' && <Contact />}
        {page === 'agregar' && <Agregar onNavigate={navigate} />}
      </main>
      <Footer onNavigate={navigate} />
      <CartDrawer />
      <ProductModal key={product?.id ?? 'none'} product={product} onClose={() => setProduct(null)} />
    </div>
  )
}

export default function App() {
  return (
    <CartProvider>
      <AppInner />
    </CartProvider>
  )
}
