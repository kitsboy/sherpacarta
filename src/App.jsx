import { useState } from 'react'

function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden font-sans">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a3a2e_1px,transparent_1px),linear-gradient(to_bottom,#1a3a2e_1px,transparent_1px)] bg-[size:50px_50px] opacity-30"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
        <div className="mb-8 inline-flex items-center gap-2 text-emerald-400 text-sm tracking-[4px] uppercase">
          1215 — 2026
        </div>

        <h1 className="text-[120px] md:text-[155px] font-serif tracking-[-6px] leading-none mb-6 text-white">
          SherpaCarta
        </h1>

        <p className="text-5xl md:text-6xl font-light text-emerald-400 mb-12 tracking-tight">
          A Magna Carta for the Digital Age
        </p>

        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-16">
          Privacy as a Fundamental Human Right.<br />
          A living charter for every person on Earth.
        </p>

        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <button className="px-12 py-6 bg-emerald-500 hover:bg-emerald-400 text-black font-medium text-xl rounded-2xl transition-all">
            Open the Full Charter
          </button>
          <button className="px-12 py-6 border border-emerald-500/50 hover:bg-emerald-500/10 text-xl rounded-2xl transition-all">
            Sign the Charter
          </button>
        </div>
      </div>
    </div>
  )
}

export default App
