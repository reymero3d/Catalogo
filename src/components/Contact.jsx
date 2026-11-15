import { useState } from 'react'

const WHATSAPP_NUMBER = '5491167994767'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const submit = (e) => {
    e.preventDefault()
    const msg = `Hola! Soy ${form.name} (${form.email}).\n\n${form.message}`
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center mb-8">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-3">Contacto</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">¿Tenés un proyecto?</h2>
        <p className="text-slate-500 mt-2">Escribinos y lo hacemos realidad.</p>
      </div>

      <form onSubmit={submit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-100 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Nombre</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Mensaje</label>
          <textarea
            required
            rows={5}
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Contanos tu idea, medidas, colores..."
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition resize-none"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200"
        >
          Enviar por WhatsApp
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-slate-600">O escribinos directamente:</p>
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 mt-3 px-6 py-3 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition shadow-lg shadow-green-200 hover:-translate-y-0.5"
        >
          <span>📲</span> Abrir WhatsApp
        </a>
      </div>
    </section>
  )
}
