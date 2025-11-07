import React from 'react'

function statusClasses(level) {
  switch (level) {
    case 'safe':
      return 'border-emerald-500/60 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]'
    case 'caution':
      return 'border-amber-400/70 shadow-[0_0_0_1px_rgba(245,158,11,0.35)]'
    case 'danger':
      return 'border-rose-500/70 shadow-[0_0_0_1px_rgba(244,63,94,0.35)] animate-pulse'
    default:
      return 'border-slate-700'
  }
}

export default function DataCard({ title, value, unit, icon: Icon, color, miniData = [], status = 'safe', trend = 'stable' }) {
  const trendLabel = trend === 'up' ? 'Rising' : trend === 'down' ? 'Falling' : 'Stable'
  return (
    <div className={`group relative rounded-xl p-4 md:p-5 bg-slate-900/60 backdrop-blur border ${statusClasses(status)} transition-all duration-300 hover:scale-[1.01]`}
      style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.04), 0 20px 40px -20px rgba(0,0,0,0.6)' }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ background: `${color}22`, color }}>
            {Icon ? <Icon size={20} /> : null}
          </div>
          <div>
            <p className="text-slate-300 text-xs">{title}</p>
            <div className="flex items-end gap-1">
              <h3 className="text-white text-2xl md:text-3xl font-semibold tracking-tight">{value}</h3>
              <span className="text-slate-400 text-sm mb-1">{unit}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-slate-400 text-xs">{trendLabel}</span>
        </div>
      </div>

      {/* Sparkline */}
      <div className="mt-4 h-10 w-full">
        <svg viewBox="0 0 100 24" className="w-full h-full">
          <defs>
            <linearGradient id={`grad-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.7" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {miniData.length > 1 ? (
            <>
              <polyline
                fill={`url(#grad-${title})`}
                stroke="none"
                points={miniData
                  .map((d, i) => {
                    const x = (i / (miniData.length - 1)) * 100
                    const y = 24 - (d.normalized * 24)
                    return `${x},24 ${x},${y}`
                  })
                  .join(' ')}
              />
              <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                points={miniData
                  .map((d, i) => {
                    const x = (i / (miniData.length - 1)) * 100
                    const y = 24 - (d.normalized * 24)
                    return `${x},${y}`
                  })
                  .join(' ')}
              />
            </>
          ) : null}
        </svg>
      </div>

      {/* Status ribbon */}
      {status !== 'safe' && (
        <div className={`absolute -top-2 right-3 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide ${status === 'danger' ? 'bg-rose-500 text-white animate-pulse' : 'bg-amber-400 text-black'}`}>
          {status}
        </div>
      )}
    </div>
  )
}
