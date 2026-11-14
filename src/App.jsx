import { useState } from 'react'
import { CartProvider } from './context/CartContext'
import Header from './components/Header'
import Hero from './components/Hero'
import Catalog from './components/Catalog'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import ProductModal from './components/ProductModal'
import ProductCard from './components/ProductCard'
import { products } from './data/products'

function AppInner() {
  const [page, setPage] = useState('home')
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
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">Destacados</h2>
                  <p className="text-slate-500 mt-1">Nuestros productos más elegidos</p>
                </div>
                <button onClick={() => navigate('catalog')} className="text-indigo-600 font-semibold hover:underline">
                  Ver todo →
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((p) => (
                  <ProductCard key={p.id} product={p} onOpen={setProduct} />
                ))}
              </div>
            </section>

            <section className="bg-white border-y border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid md:grid-cols-3 gap-8 text-center">
                {[
                  { icon: '🎨', t: 'Diseño a medida', d: 'Personalizamos cada pieza según tu idea.' },
                  { icon: '⚡', t: 'Producción rápida', d: 'Entregas en 24 a 72 horas.' },
                  { icon: '📦', t: 'Envíos a todo el país', d: 'Coordinamos el envío por WhatsApp.' },
                ].map((f) => (
                  <div key={f.t}>
                    <div className="text-4xl">{f.icon}</div>
                    <h3 className="mt-3 font-bold text-slate-900">{f.t}</h3>
                    <p className="mt-1 text-sm text-slate-500">{f.d}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
        {page === 'catalog' && <Catalog onOpenProduct={setProduct} />}
        {page === 'about' && <About />}
        {page === 'contact' && <Contact />}
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
