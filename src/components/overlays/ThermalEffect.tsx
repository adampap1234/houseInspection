interface ThermalEffectProps {
  active: boolean
}

/**
 * False-color thermal camera overlay effect.
 * Classic thermal imaging: blue = cold, red/yellow = hot.
 *
 * Uses CSS gradients and opacity transitions for a realistic thermal camera look.
 * A pulsing hot spot in the center creates visual interest.
 */
export function ThermalEffect({ active }: ThermalEffectProps) {
  return (
    <div
      className="relative w-full aspect-[4/3] rounded-lg overflow-hidden"
      style={{
        opacity: active ? 1 : 0,
        transition: 'opacity 1s ease-out',
      }}
    >
      {/* False-color gradient background — thermal camera color scale */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #1a237e 0%, #0d47a1 15%, #00695c 30%, #2e7d32 45%, #f9a825 60%, #ef6c00 75%, #c62828 90%, #b71c1c 100%)',
        }}
      />

      {/* Noise texture overlay for realism */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'repeating-conic-gradient(rgba(255,255,255,0.03) 0% 25%, transparent 0% 50%)',
          backgroundSize: '4px 4px',
        }}
      />

      {/* Window frame overlay */}
      <div className="absolute inset-4 border-2 border-white/20 rounded" />

      {/* Hot spot — center-right area */}
      <div className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-red-500/70 blur-lg animate-pulse" />

      {/* Secondary warm zone */}
      <div className="absolute top-1/2 left-1/3 w-14 h-14 rounded-full bg-orange-500/40 blur-md" />

      {/* Cold corner — bottom left */}
      <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-blue-900/50 blur-md" />

      {/* Temperature reading */}
      <div className="absolute top-2 right-3 font-mono text-xs text-white/80 bg-black/30 px-2 py-1 rounded">
        MAX: 28.4°C
      </div>

      {/* Min temperature */}
      <div className="absolute bottom-2 left-3 font-mono text-xs text-white/80 bg-black/30 px-2 py-1 rounded">
        MIN: 14.2°C
      </div>
    </div>
  )
}
