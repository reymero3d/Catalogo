import { useCart } from '../context/CartContext'
import { formatPrice } from '../data/products'

const WHATSAPP_NUMBER = '5491167994767' // reemplazar con tu número

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
      <div className="absolute inset-0 bg-slate-900/50" onClick={() => setOpen(false)} />
      <aside className="absolute right-0 top-0 h-full w-full sm:w-96 bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">Tu carrito</h2>
          <button onClick={() => setOpen(false)} className="text-slate-500 hover:text-slate-900 text-xl">✕</button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="text-center text-slate-500 mt-10">
              <div className="text-5xl mb-3">🛒</div>
              <p>Tu carrito está vacío</p>
              <p className="text-sm mt-1">Agregá productos del catálogo</p>
            </div>
          ) : (
            items.map((i) => (
              <div key={i.id + i.note} className="flex gap-3">
                <img src={i.image} alt={i.name} className="w-16 h-16 rounded-lg object-cover bg-slate-100" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 text-sm line-clamp-1">{i.name}</div>
                  {i.note && <div className="text-xs text-slate-500 line-clamp-1">{i.note}</div>}
                  <div className="text-sm font-bold text-slate-900 mt-1">{formatPrice(i.price * i.qty)}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <button onClick={() => updateQty(i.id, i.note, i.qty - 1)} className="w-6 h-6 rounded border border-slate-300 text-sm hover:bg-slate-100">−</button>
                    <span className="text-sm font-medium w-6 text-center">{i.qty}</span>
                    <button onClick={() => updateQty(i.id, i.note, i.qty + 1)} className="w-6 h-6 rounded border border-slate-300 text-sm hover:bg-slate-100">+</button>
                    <button onClick={() => remove(i.id, i.note)} className="ml-auto text-xs text-red-500 hover:text-red-700">Eliminar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-200 p-5 space-y-3">
            <div className="flex justify-between text-lg font-bold text-slate-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              onClick={checkout}
              className="w-full py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2"
            >
              <span>📲</span> Pedir por WhatsApp
            </button>
            <button
              onClick={clear}
              className="w-full py-2 rounded-xl border border-slate-300 text-slate-600 text-sm font-medium hover:bg-slate-50 transition"
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
