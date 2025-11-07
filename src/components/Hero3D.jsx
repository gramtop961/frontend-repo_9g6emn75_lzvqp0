import React from 'react'
import Spline from '@splinetool/react-spline'

export default function Hero3D() {
  return (
    <div className="relative w-full h-72 md:h-96 rounded-2xl overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Spline
        scene="https://prod.spline.design/DAWBaaySM7FLUKpn/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
        <div>
          <h1 className="text-white font-semibold text-2xl md:text-3xl tracking-tight">Transformer Health Monitoring</h1>
          <p className="text-slate-300 text-sm md:text-base">Real-time insights with live metrics, alerts, and trend analytics</p>
        </div>
        <div className="hidden md:flex items-center gap-2 text-slate-300 text-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live
        </div>
      </div>
    </div>
  )
}
