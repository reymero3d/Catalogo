import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'

const WHATSAPP_NUMBER = '5491167994767'

export default function CartDrawer() {
  const { items, open, setOpen, remove, updateQty, clear, total } = useCart()

  const buildMessage = () => {
    const lines = items.map(
      (i) => `• ${i.name} x${i.qty} — ${formatPrice(i.price * i.qty)}${i.note ? ' (' + i.note + ')' : ''}`
    )
    const msg = `Hola! Quiero hacer este pedido:\n\n${lines.join('\n')}\n\nTotal: ${formatPrice(total)}\n\nGracias!`
    return encodeURIComponent(msg)
  }

  const checkout = () => {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${buildMessage()}`
    window.open(url, '_blank')
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-2xl flex flex-col animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xl">🛒</span>
            <h2 className="text-lg font-bold text-slate-900">Tu carrito</h2>
            {items.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold">{items.length}</span>
            )}
          </div>
          <button onClick={() => setOpen(false)} className="w-9 h-9 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-900 transition">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-slate-500 mt-16">
              <div className="text-6xl mb-4">🛒</div>
              <p className="font-medium">Tu carrito está vacío</p>
              <p className="text-sm mt-1 text-slate-400">Agregá productos del catálogo</p>
              <button onClick={() => setOpen(false)} className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition">
                Ver catálogo
              </button>
            </div>
          ) : (
            items.map((i) => (
              <div key={i.id + i.note} className="flex gap-3 bg-slate-50 rounded-xl p-3">
                <img src={i.image} alt={i.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100 ring-1 ring-slate-200" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm line-clamp-1">{i.name}</div>
                  {i.note && <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">{i.note}</div>}
                  <div className="text-sm font-bold text-indigo-600 mt-1">{formatPrice(i.price * i.qty)}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center border border-slate-300 rounded-lg overflow-hidden bg-white">
                      <button onClick={() => updateQty(i.id, i.note, i.qty - 1)} className="px-2.5 py-1 hover:bg-slate-100 text-sm">−</button>
                      <span className="px-3 py-1 font-semibold text-sm">{i.qty}</span>
                      <button onClick={() => updateQty(i.id, i.note, i.qty + 1)} className="px-2.5 py-1 hover:bg-slate-100 text-sm">+</button>
                    </div>
                    <button onClick={() => remove(i.id, i.note)} className="ml-auto text-xs text-red-500 hover:text-red-700 font-medium">Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-200 p-5 space-y-3 bg-slate-50/50">
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <span>Total</span>
              <span className="text-indigo-600">{formatPrice(total)}</span>
            </div>
            <button
              onClick={checkout}
              className="w-full py-3.5 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition shadow-lg shadow-green-200 flex items-center justify-center gap-2 hover:-translate-y-0.5"
            >
              <span>📲</span> Pedir por WhatsApp
            </button>
            <button
              onClick={clear}
              className="w-full py-2 rounded-xl border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-100 transition"
            >
              Vaciar carrito
            </button>
            <p className="text-xs text-slate-500 text-center">
              Te redirigimos a WhatsApp con el detalle del pedido.
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}
