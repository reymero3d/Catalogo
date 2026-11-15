import data from './products.json'

export const categories = [
  { id: 'all', name: 'Todos', icon: '🖨️' },
  { id: 'figuras', name: 'Figuras', icon: '🗿' },
  { id: 'llaveros', name: 'Llaveros', icon: '🔑' },
  { id: 'decoracion', name: 'Decoración', icon: '🏠' },
  { id: 'litofanias', name: 'Litofanías', icon: '💡' },
  { id: 'personalizado', name: 'Personalizado', icon: '✨' },
  { id: 'utilitarios', name: 'Utilitarios', icon: '🔧' },
]

export const products = data.products.map((p, i) => ({
  ...p,
  id: p.id ?? i + 1,
  stock: p.stock ?? 99,
  colorMode: p.colorMode ?? 'elegir',
}))

export const formatPrice = (n) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(n)
