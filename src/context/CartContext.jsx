import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)

  const add = useCallback((product, qty = 1, note = '') => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id && i.note === note)
      if (existing) {
        return prev.map((i) =>
          i.id === product.id && i.note === note ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [...prev, { ...product, qty, note }]
    })
    setOpen(true)
  }, [])

  const remove = useCallback((id, note) => {
    setItems((prev) => prev.filter((i) => !(i.id === id && i.note === note)))
  }, [])

  const updateQty = useCallback((id, note, qty) => {
    if (qty <= 0) {
      remove(id, note)
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.id === id && i.note === note ? { ...i, qty } : i))
    )
  }, [remove])

  const clear = useCallback(() => setItems([]), [])

  const total = items.reduce((s, i) => s + i.price * i.qty, 0)
  const count = items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, open, setOpen, add, remove, updateQty, clear, total, count }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
