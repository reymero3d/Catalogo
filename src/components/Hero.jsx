export default function Hero({ onNavigate }) {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-slate-900" />
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-pink-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-cyan-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur text-sm font-medium mb-5 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Impresión 3D a medida
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05] tracking-tight">
              Tu idea, impresa en <span className="bg-gradient-to-r from-cyan-300 to-pink-300 bg-clip-text text-transparent">3D</span>
            </h1>
            <p className="mt-5 text-lg text-indigo-100/90 max-w-xl leading-relaxed">
              Catálogo de figuras, llaveros, decoración y piezas personalizadas. Diseñamos e imprimimos lo que
              imaginas, con la calidad que merece tu proyecto.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('catalog')}
                className="px-6 py-3.5 rounded-xl bg-white text-indigo-700 font-semibold hover:bg-indigo-50 transition shadow-lg shadow-indigo-900/20 hover:shadow-xl hover:-translate-y-0.5"
              >
                Ver catálogo →
              </button>
              <button
                onClick={() => onNavigate('contact')}
                className="px-6 py-3.5 rounded-xl border border-white/30 text-white font-semibold hover:bg-white/10 transition backdrop-blur"
              >
                Pedir personalizado
              </button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { v: '+200', l: 'Piezas impresas' },
                { v: '48h', l: 'Tiempo promedio' },
                { v: '100%', l: 'Personalizable' },
              ].map((s) => (
                <div key={s.l}>
                  <div className="text-2xl font-extrabold">{s.v}</div>
                  <div className="text-xs text-indigo-200 mt-0.5">{s.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:block animate-scale-in">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-r from-cyan-400 to-pink-500 rounded-[2rem] blur-2xl opacity-40" />
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-white/20">
                <img
                  src="https://picsum.photos/seed/hero3dprint/700/700"
                  alt="Impresión 3D"
                  className="w-full object-cover aspect-square"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
