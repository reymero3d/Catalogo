import { formatPrice } from '../data/products'

export default function ProductCard({ product, onOpen }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/70 overflow-hidden hover:shadow-2xl hover:shadow-indigo-100 hover:-translate-y-1.5 transition-all duration-300 animate-fade-in">
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        {product.featured && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold shadow-lg flex items-center gap-1">
            <span>★</span> Destacado
          </span>
        )}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg">
            Últimas {product.stock}
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-700 text-white text-xs font-bold shadow-lg">
            Agotado
          </span>
        )}
        <button
          onClick={() => onOpen(product)}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 px-4 py-2 rounded-full bg-white text-indigo-700 text-sm font-semibold shadow-lg hover:bg-indigo-600 hover:text-white"
        >
          Vista rápida
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] uppercase tracking-wider text-indigo-600 font-bold">{product.material}</span>
          <span className="text-[11px] text-slate-400">{product.size}</span>
        </div>
        <h3 className="mt-1.5 font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition">{product.name}</h3>
        <p className="mt-1 text-sm text-slate-500 line-clamp-2 leading-snug">{product.description}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-extrabold text-slate-900">{formatPrice(product.price)}</span>
          <button
            onClick={() => onOpen(product)}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition shadow-sm hover:shadow"
          >
            Ver
          </button>
        </div>
      </div>
    </div>
  )
}
