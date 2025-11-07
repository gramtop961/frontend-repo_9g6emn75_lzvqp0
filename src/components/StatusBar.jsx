import React from 'react'
import { Wifi, Clock, Database, Gauge } from 'lucide-react'

export default function StatusBar({ online, lastUpdate, points, uptimeSeconds }) {
  const uptime = () => {
    const hrs = Math.floor(uptimeSeconds / 3600)
    const mins = Math.floor((uptimeSeconds % 3600) / 60)
    const secs = uptimeSeconds % 60
    return `${hrs}h ${mins}m ${secs}s`
  }

  return (
    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border ${online ? 'border-emerald-500/50' : 'border-rose-500/60'}`}>
        <Wifi size={16} className={online ? 'text-emerald-400' : 'text-rose-400'} />
        <span className="text-slate-300 text-sm">{online ? 'Online' : 'Offline'}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/60">
        <Clock size={16} className="text-sky-400" />
        <span className="text-slate-300 text-sm">{new Date(lastUpdate).toLocaleTimeString()}</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/60">
        <Database size={16} className="text-violet-400" />
        <span className="text-slate-300 text-sm">{points} points</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/60">
        <Gauge size={16} className="text-amber-400" />
        <span className="text-slate-300 text-sm">Uptime {uptime()}</span>
      </div>
    </div>
  )
}
