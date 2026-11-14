import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'

export default function ProductModal({ product, onClose }) {
  const { add } = useCart()
  const [qty, setQty] = useState(1)
  const [note, setNote] = useState('')
  const [color, setColor] = useState(product ? product.color : '')

  if (!product) return null

  const handleAdd = () => {
    add(product, qty, note ? `${note}${color ? ' · Color: ' + color : ''}` : (color ? 'Color: ' + color : ''))
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 shadow flex items-center justify-center text-slate-600 hover:text-slate-900"
          aria-label="Cerrar"
        >
          ✕
        </button>
        <div className="grid md:grid-cols-2 gap-0">
          <div className="aspect-square bg-slate-100">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="p-6 flex flex-col">
            <div className="text-xs uppercase tracking-wide text-indigo-600 font-semibold">{product.material}</div>
            <h2 className="mt-1 text-2xl font-extrabold text-slate-900">{product.name}</h2>
            <p className="mt-3 text-slate-600">{product.description}</p>

            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-slate-500">Tamaño</div>
                <div className="font-semibold text-slate-900">{product.size}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-slate-500">Stock</div>
                <div className="font-semibold text-slate-900">{product.stock} disponibles</div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Color preferido</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="Ej: Negro, Blanco, Rojo..."
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Personalización / notas</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Nombre, texto, medidas especiales..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 hover:bg-slate-100"
                >−</button>
                <span className="px-4 py-2 font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
                  className="px-3 py-2 hover:bg-slate-100"
                >+</button>
              </div>
              <div className="text-2xl font-extrabold text-slate-900">{formatPrice(product.price * qty)}</div>
            </div>

            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="mt-5 w-full py-3 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed"
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
