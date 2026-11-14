export default function About() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900">Sobre reymero3d</h2>
          <p className="mt-4 text-slate-600 leading-relaxed">
            Somos un emprendimiento dedicado a la impresión 3D. Diseñamos y fabricamos piezas personalizadas,
            figuras, llaveros, decoración y utilitarios con la mejor calidad y atención al detalle.
          </p>
          <p className="mt-3 text-slate-600 leading-relaxed">
            Trabajamos con distintos materiales (PLA, PETG, TPU, resina) para que cada proyecto tenga el acabado
            y la durabilidad que necesita. Si tenés una idea, la hacemos realidad.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {[
              { t: 'Diseño personalizado', d: 'Envianos tu idea o archivo y la adaptamos.' },
              { t: 'Múltiples materiales', d: 'PLA, PETG, TPU, resina y más.' },
              { t: 'Entrega rápida', d: 'Tiempos de producción de 24 a 72 hs.' },
              { t: 'Atención directa', d: 'Coordinamos todo por WhatsApp.' },
            ].map((f) => (
              <div key={f.t} className="bg-slate-50 rounded-xl p-4">
                <div className="font-semibold text-slate-900">{f.t}</div>
                <div className="text-sm text-slate-500 mt-1">{f.d}</div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <img src="https://picsum.photos/seed/workshop3d/700/700" alt="Taller" className="rounded-2xl shadow-lg w-full object-cover aspect-square" />
        </div>
      </div>
    </section>
  )
}
