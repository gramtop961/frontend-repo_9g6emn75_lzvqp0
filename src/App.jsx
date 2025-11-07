import React, { useEffect, useMemo, useRef, useState } from 'react'
import Hero3D from './components/Hero3D'
import DataCard from './components/DataCard'
import MainChart from './components/MainChart'
import StatusBar from './components/StatusBar'
import { Zap, Thermometer, Activity, Cpu, RefreshCcw, Settings } from 'lucide-react'

const V_COLOR = '#06b6d4' // cyan
const C_COLOR = '#f59e0b' // amber
const T_COLOR = '#ef4444' // red
const P_COLOR = '#10b981' // green

function evaluateStatus({ voltage, current, temperature, power }) {
  // Voltage
  const vStatus = voltage < 10 || voltage > 16 ? 'danger' : (voltage < 11 || voltage > 14) ? 'caution' : 'safe'
  // Current
  const cStatus = current > 3 ? 'danger' : current >= 1.2 ? 'caution' : 'safe'
  // Temperature
  const tStatus = temperature > 70 ? 'danger' : temperature >= 60 ? 'caution' : 'safe'
  // Power
  const pStatus = power > 100 ? 'danger' : power >= 50 ? 'caution' : 'safe'
  return { vStatus, cStatus, tStatus, pStatus }
}

function normalizeSeries(arr, maxVal) {
  const max = Math.max(1, ...arr, maxVal || 0)
  return arr.map(v => ({ value: v, normalized: Math.min(1, v / max) }))
}

export default function App() {
  const [online, setOnline] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(Date.now())
  const [history, setHistory] = useState([]) // {t, voltage, current, temperature, power}
  const [preferences, setPreferences] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('prefs') || '{}')
    } catch { return {} }
  })
  const startTimeRef = useRef(Date.now())

  const latest = history[history.length - 1] || { voltage: 0, current: 0, temperature: 0, power: 0 }

  const trend = (key) => {
    const n = history.length
    if (n < 3) return 'stable'
    const a = history[n - 3][key]
    const b = history[n - 2][key]
    const c = history[n - 1][key]
    const slope = (c - a) / 2
    if (slope > 0.05) return 'up'
    if (slope < -0.05) return 'down'
    return 'stable'
  }

  const { vStatus, cStatus, tStatus, pStatus } = evaluateStatus(latest)

  // Auto-refresh every 3 seconds: try backend, else simulate
  useEffect(() => {
    const controller = new AbortController()
    const tick = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_BACKEND_URL ? `${import.meta.env.VITE_BACKEND_URL}/data` : '/data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ping: true }),
          signal: controller.signal,
        })
        const json = await res.json()
        const { voltage, current, temperature } = json
        const power = (voltage || 0) * (current || 0)
        const point = { t: Date.now(), voltage, current, temperature, power }
        setHistory(prev => {
          const next = [...prev, point].slice(-30)
          return next
        })
        setOnline(true)
        setLastUpdate(Date.now())
      } catch (e) {
        // Simulate realistic fluctuations when backend isn't available
        setOnline(false)
        setLastUpdate(Date.now())
        setHistory(prev => {
          const last = prev[prev.length - 1] || { voltage: 12.3, current: 0.9, temperature: 45, power: 11 }
          const rand = (base, vol) => +(base + (Math.random() - 0.5) * vol).toFixed(2)
          const voltage = Math.max(8, Math.min(18, rand(last.voltage || 12.5, 0.6)))
          const current = Math.max(0, Math.min(4, rand(last.current || 1.0, 0.25)))
          const temperature = Math.max(20, Math.min(90, rand(last.temperature || 45, 1.5)))
          const power = +(voltage * current).toFixed(2)
          const point = { t: Date.now(), voltage, current, temperature, power }
          const next = [...prev, point].slice(-30)
          return next
        })
      }
    }

    tick()
    const id = setInterval(tick, 3000)
    return () => { controller.abort(); clearInterval(id) }
  }, [])

  // Persist simple preferences
  useEffect(() => {
    localStorage.setItem('prefs', JSON.stringify(preferences))
  }, [preferences])

  const mini = useMemo(() => {
    const volts = normalizeSeries(history.slice(-8).map(p => p.voltage), 16)
    const amps = normalizeSeries(history.slice(-8).map(p => p.current), 3)
    const temps = normalizeSeries(history.slice(-8).map(p => p.temperature), 90)
    const powers = normalizeSeries(history.slice(-8).map(p => p.power), 150)
    return { volts, amps, temps, powers }
  }, [history])

  const uptimeSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000)

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        <Hero3D />

        {/* Status */}
        <div className="mt-6">
          <StatusBar online={online} lastUpdate={lastUpdate} points={history.length} uptimeSeconds={uptimeSeconds} />
        </div>

        {/* Alerts */}
        { (vStatus === 'danger' || cStatus === 'danger' || tStatus === 'danger' || pStatus === 'danger') ? (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/60 text-rose-200 animate-pulse">
            Critical alert: One or more metrics in danger range. Investigate immediately.
          </div>
        ) : (vStatus === 'caution' || cStatus === 'caution' || tStatus === 'caution' || pStatus === 'caution') ? (
          <div className="mt-4 p-3 rounded-xl bg-amber-400/15 border border-amber-400/60 text-amber-200">
            Caution: Some metrics approaching unsafe thresholds.
          </div>
        ) : null }

        {/* Cards */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DataCard title="Voltage" value={latest.voltage?.toFixed ? latest.voltage.toFixed(2) : latest.voltage} unit="V" icon={Zap} color={V_COLOR} miniData={mini.volts} status={vStatus} trend={trend('voltage')} />
          <DataCard title="Current" value={latest.current?.toFixed ? latest.current.toFixed(2) : latest.current} unit="A" icon={Activity} color={C_COLOR} miniData={mini.amps} status={cStatus} trend={trend('current')} />
          <DataCard title="Temperature" value={latest.temperature?.toFixed ? latest.temperature.toFixed(1) : latest.temperature} unit="°C" icon={Thermometer} color={T_COLOR} miniData={mini.temps} status={tStatus} trend={trend('temperature')} />
          <DataCard title="Power" value={latest.power?.toFixed ? latest.power.toFixed(1) : latest.power} unit="W" icon={Cpu} color={P_COLOR} miniData={mini.powers} status={pStatus} trend={trend('power')} />
        </div>

        {/* Main chart */}
        <div className="mt-6">
          <MainChart history={history} />
        </div>

        {/* Quick actions */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/60 hover:border-slate-500 transition-colors flex items-center gap-2" onClick={() => setHistory([])}>
            <RefreshCcw size={16} />
            Reset History
          </button>
          <button className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/60 hover:border-slate-500 transition-colors flex items-center gap-2" onClick={() => setPreferences(p => ({ ...p, dense: !p.dense }))}>
            <Settings size={16} />
            Toggle Density
          </button>
        </div>

        {/* Footer clock */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <span>{new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  )
}
