import React, { useEffect, useRef } from 'react'
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, CategoryScale, Filler, Tooltip, Legend } from 'chart.js'

Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, CategoryScale, Filler, Tooltip, Legend)

export default function MainChart({ history }) {
  const canvasRef = useRef(null)
  const chartRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    const labels = history.map(h => new Date(h.t).toLocaleTimeString())

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Voltage (V)',
            data: history.map(h => h.voltage),
            borderColor: '#06b6d4',
            backgroundColor: 'rgba(6,182,212,0.2)',
            fill: true,
            tension: 0.35,
            pointRadius: 0,
          },
          {
            label: 'Current (A)',
            data: history.map(h => h.current),
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245,158,11,0.2)',
            fill: true,
            tension: 0.35,
            pointRadius: 0,
          },
          {
            label: 'Temperature (°C)',
            data: history.map(h => h.temperature),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.2)',
            fill: true,
            tension: 0.35,
            pointRadius: 0,
          },
          {
            label: 'Power (W)',
            data: history.map(h => h.power),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.2)',
            fill: true,
            tension: 0.35,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: { color: 'rgba(148,163,184,0.1)' },
            ticks: { color: '#94a3b8' },
          },
          y: {
            grid: { color: 'rgba(148,163,184,0.1)' },
            ticks: { color: '#94a3b8' },
          },
        },
        plugins: {
          legend: {
            labels: { color: '#cbd5e1' },
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          },
        },
        animation: { duration: 300 },
      },
    })

    return () => {
      if (chartRef.current) chartRef.current.destroy()
    }
  }, [history])

  return (
    <div className="w-full h-72 md:h-[420px] rounded-2xl p-4 bg-slate-900/60 border border-slate-700/60 backdrop-blur">
      <canvas ref={canvasRef} />
    </div>
  )
}
