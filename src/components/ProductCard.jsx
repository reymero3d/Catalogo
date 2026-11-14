import { formatPrice } from '../data/products'

export default function ProductCard({ product, onOpen }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {product.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold shadow">
            Destacado
          </span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow">
            Últimas {product.stock}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-700 text-white text-xs font-bold shadow">
            Agotado
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">{product.material}</div>
        <h3 className="mt-1 font-bold text-slate-900 line-clamp-1">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-500 line-clamp-2">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-extrabold text-slate-900">{formatPrice(product.price)}</span>
          <button
            onClick={() => onOpen(product)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition"
          >
            Ver
          </button>
        </div>
      </div>
    </div>
  )
}
