export function Meadow() {
  return (
    <div className="absolute bottom-0 inset-x-0 h-[220px] pointer-events-none overflow-hidden">
      {/* Real meadow photo with gradient mask */}
      <img
        src="/meadow/meadow-panorama.jpg"
        alt=""
        className="absolute inset-0 w-full h-full object-cover object-[50%_75%] select-none"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, black 0%, black 60%, transparent 100%)",
        }}
      />

      {/* SVG grass overlay on top */}
      <svg
        viewBox="0 0 1440 220"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
      >
        {/* Grass tufts along the meadow ridge */}
        <GrassTufts
          positions={[
            [80, 170],
            [190, 168],
            [310, 172],
            [440, 168],
            [560, 166],
            [680, 170],
            [800, 167],
            [920, 172],
            [1040, 168],
            [1160, 170],
            [1280, 166],
            [1380, 172],
          ]}
        />
        <GrassTufts
          positions={[
            [150, 142],
            [350, 138],
            [550, 144],
            [750, 140],
            [950, 142],
            [1150, 138],
            [1350, 144],
          ]}
          scale={0.65}
        />
      </svg>
    </div>
  )
}

function GrassTufts({
  positions,
  scale = 1,
}: {
  positions: [number, number][]
  scale?: number
}) {
  return (
    <>
      {positions.map(([cx, cy], idx) => (
        <g
          key={idx}
          className="grass-cluster"
          style={{ transformOrigin: `${cx}px ${cy}px`, transform: `scale(${scale})` }}
        >
          <path
            d={`M${cx} ${cy} Q${cx - 2} ${cy - 16} ${cx} ${cy - 26} Q${cx + 2} ${cy - 16} ${cx} ${cy}`}
            fill="#7ac062"
            opacity={0.8}
          />
          <path
            d={`M${cx - 4} ${cy + 2} Q${cx - 8} ${cy - 12} ${cx - 5} ${cy - 20} Q${cx - 3} ${cy - 12} ${cx - 4} ${cy + 2}`}
            fill="#6ab85f"
            opacity={0.7}
          />
          <path
            d={`M${cx + 4} ${cy + 1} Q${cx + 8} ${cy - 14} ${cx + 5} ${cy - 22} Q${cx + 3} ${cy - 14} ${cx + 4} ${cy + 1}`}
            fill="#8ad074"
            opacity={0.75}
          />
          <path
            d={`M${cx - 2} ${cy - 2} Q${cx - 5} ${cy - 18} ${cx - 3} ${cy - 28} Q${cx - 1} ${cy - 18} ${cx - 2} ${cy - 2}`}
            fill="#c8e6a0"
            opacity={0.5}
          />
        </g>
      ))}
    </>
  )
}
