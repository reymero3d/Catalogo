import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'

export default function ProductModal({ product, onClose }) {
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')
  const [color, setColor] = useState(product ? product.color : '')
  const colorEditable = !product || product.colorMode !== 'fijo'

  if (!product) return null

  const handleAdd = () => {
    const colorNote = colorEditable && color ? `Color: ${color}` : ''
    const fullNote = [note, colorNote].filter(Boolean).join(' · ')
    add(product, qty, fullNote)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
          aria-label="Cerrar"
        >
          ✕
        </button>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square md:aspect-auto md:min-h-[420px] bg-gradient-to-br from-slate-100 to-slate-50 relative">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            {product.featured && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-amber-400 text-amber-900 text-xs font-bold shadow-lg">
                ★ Destacado
              </span>
            )}
          </div>
          <div className="p-6 sm:p-8 flex flex-col">
            <div className="text-xs uppercase tracking-wider text-indigo-600 font-bold">{product.material}</div>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">{product.name}</h2>
            <p className="mt-3 text-slate-600 leading-relaxed">{product.description}</p>

            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <div className="text-slate-500 text-xs uppercase tracking-wide">Tamaño</div>
                <div className="font-semibold text-slate-900 mt-0.5">{product.size}</div>
              </div>
              {product.stock < 99 ? (
                <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                  <div className="text-slate-500 text-xs uppercase tracking-wide">Stock</div>
                  <div className="font-semibold text-slate-900 mt-0.5">{product.stock} disponibles</div>
                </div>
              ) : (
                <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100">
                  <div className="text-emerald-600 text-xs uppercase tracking-wide">Disponibilidad</div>
                  <div className="font-semibold text-emerald-700 mt-0.5">Disponible</div>
                </div>
              )}
            </div>

            {colorEditable ? (
              <div className="mt-5">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Color preferido</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="Ej: Negro, Blanco, Rojo..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                />
                <p className="text-xs text-slate-400 mt-1">Podés elegir el color que prefieras.</p>
              </div>
            ) : (
              <div className="mt-5 bg-slate-50 rounded-xl p-3.5 border border-slate-100">
                <div className="text-slate-500 text-xs uppercase tracking-wide">Color</div>
                <div className="font-semibold text-slate-900 mt-0.5">{product.color}</div>
                <p className="text-xs text-slate-400 mt-1">Color fijo, no se puede cambiar.</p>
              </div>
            )}

            <div className="mt-3">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Personalización / notas</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nombre, texto, medidas especiales..."
                rows={3}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
              />
            </div>

            <div className="mt-5 flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3.5 py-2.5 hover:bg-slate-100 transition text-lg"
                >−</button>
                <span className="px-4 py-2.5 font-semibold min-w-[2.5rem] text-center">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                  className="px-3.5 py-2.5 hover:bg-slate-100 transition text-lg"
                >+</button>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{formatPrice(product.price * qty)}</div>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="mt-6 w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 disabled:bg-slate-300 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
            </button>
            <p className="mt-2 text-xs text-slate-500 text-center">
              El pedido se coordina por WhatsApp luego del checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
