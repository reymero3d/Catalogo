export default function Hero({ onNavigate }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-slate-900 text-white">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-sm font-medium mb-4">
              ✨ Impresión 3D a medida
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
              Tu idea, impresa en <span className="text-cyan-300">3D</span>
            </h1>
            <p className="mt-5 text-lg text-indigo-100 max-w-xl">
              Catálogo de figuras, llaveros, decoración y piezas personalizadas. Diseñamos e imprimimos lo que
              imaginas, con la calidad que merece tu proyecto.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('catalog')}
                className="px-6 py-3 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition shadow-lg"
              >
                Ver catálogo
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3 rounded-xl border border-white/40 text-white font-semibold hover:bg-white/10 transition"
              >
                Pedir personalizado
              </button>
            </div>
            <div className="mt-10 flex gap-8 text-sm">
              <div><div className="text-2xl font-bold">+200</div><div className="text-indigo-200">Piezas impresas</div></div>
              <div><div className="text-2xl font-bold">48h</div><div className="text-indigo-200">Tiempo promedio</div></div>
              <div><div className="text-2xl font-bold">100%</div><div className="text-indigo-200">Personalizable</div></div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-3xl blur-2xl opacity-40" />
              <img
                src="https://picsum.photos/seed/hero3dprint/700/700"
                alt="Impresión 3D"
                className="relative rounded-3xl shadow-2xl w-full object-cover aspect-square"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
