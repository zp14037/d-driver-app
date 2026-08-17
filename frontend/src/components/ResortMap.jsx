import React from 'react';

// ============================================================
// DELLA RESORTS — SVG MAP COMPONENTS
// Premium dark-mode resort top-down map
// Two variants: ValetMap (parking phases) | FleetMap (locations)
// ============================================================

const C = {
  bg: '#0B0B0B',
  grid: '#111111',
  road: '#1A1A1A',
  roadDash: '#252525',
  building: '#111111',
  buildingBorder: '#212121',
  inactive: '#4A4A4A',
  gold: '#C9A035',
  goldText: '#D4AF55',
  goldAlpha10: 'rgba(201,160,53,0.1)',
  goldAlpha55: 'rgba(201,160,53,0.55)',
  green: '#2D9E47',
  greenLight: '#3EC05C',
  originAlpha: 'rgba(45,158,71,0.12)',
  originBorder: 'rgba(45,158,71,0.5)',
};

// ============================================================
// VALET MAP — porch → parking phase
// Layout: Phase III (top) | Phase I (bottom-left) | Phase II (bottom-right)
// ============================================================
export function ValetMap({ destination }) {
  // destination: 'phase1' | 'phase2' | 'phase3'
  const phases = {
    phase1: { x: 16, y: 128, w: 88, h: 60, cx: 60, cy: 158, label: 'Phase I', tag: '\u2190 PARK HERE' },
    phase2: { x: 196, y: 128, w: 88, h: 60, cx: 240, cy: 158, label: 'Phase II', tag: 'PARK HERE \u2192' },
    phase3: { x: 108, y: 10, w: 84, h: 52, cx: 150, cy: 36, label: 'Phase III', tag: '\u2191 PARK HERE' },
  };
  const porch = { cx: 150, cy: 100 };
  const dest = phases[destination] || phases.phase2;

  return (
    <svg viewBox="0 0 300 202" width="100%" style={{ display: 'block' }}>
      {/* Background */}
      <rect width="300" height="202" fill={C.bg} />

      {/* Grid */}
      {[0,1,2,3,4,5].map(i => (
        <line key={`vg${i}`} x1={i*60} y1="0" x2={i*60} y2="202" stroke={C.grid} strokeWidth="0.5" />
      ))}
      {[0,1,2,3,4].map(i => (
        <line key={`hg${i}`} x1="0" y1={i*50} x2="300" y2={i*50} stroke={C.grid} strokeWidth="0.5" />
      ))}

      {/* Main horizontal road */}
      <rect x="0" y="86" width="300" height="28" fill={C.road} />
      {/* Road center dashes */}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={`d${i}`} x={i*46+8} y="99" width="26" height="2" rx="1" fill={C.roadDash} />
      ))}

      {/* Vertical connector roads */}
      <rect x="135" y="0" width="30" height="86" fill={C.road} />
      <rect x="135" y="114" width="30" height="88" fill={C.road} />

      {/* Left building — Main Building */}
      <rect x="8" y="18" width="118" height="62" rx="6" fill={C.building} stroke={C.buildingBorder} strokeWidth="1" />
      <text x="67" y="44" textAnchor="middle" fill="#3A3A3A" fontSize="9.5" fontFamily="Inter, sans-serif" fontWeight="500">Main Building</text>
      <text x="67" y="57" textAnchor="middle" fill="#2A2A2A" fontSize="8" fontFamily="Inter, sans-serif">Reception</text>

      {/* Right building — Lobby & Spa */}
      <rect x="174" y="18" width="118" height="62" rx="6" fill={C.building} stroke={C.buildingBorder} strokeWidth="1" />
      <text x="233" y="44" textAnchor="middle" fill="#3A3A3A" fontSize="9.5" fontFamily="Inter, sans-serif" fontWeight="500">Lobby & Spa</text>
      <text x="233" y="57" textAnchor="middle" fill="#2A2A2A" fontSize="8" fontFamily="Inter, sans-serif">Wellness</text>

      {/* === PARKING PHASES === */}
      {Object.entries(phases).map(([key, p]) => {
        const active = key === destination;
        return (
          <g key={key}>
            <rect
              x={p.x} y={p.y} width={p.w} height={p.h} rx="6"
              fill={active ? C.goldAlpha10 : C.building}
              stroke={active ? C.goldAlpha55 : C.buildingBorder}
              strokeWidth={active ? 1.5 : 1}
            />
            <text x={p.cx} y={p.cy - 5}
              textAnchor="middle"
              fill={active ? C.goldText : C.inactive}
              fontSize="10" fontFamily="Inter, sans-serif"
              fontWeight={active ? '600' : '400'}
            >{p.label}</text>
            {active && (
              <text x={p.cx} y={p.cy + 11}
                textAnchor="middle"
                fill={C.gold} fontSize="7.5" fontFamily="Inter, sans-serif" fontWeight="600"
              >{p.tag}</text>
            )}
          </g>
        );
      })}

      {/* Route: dashed line porch → dest */}
      <line
        x1={porch.cx} y1={porch.cy}
        x2={dest.cx} y2={dest.cy}
        stroke={C.gold} strokeWidth="1.5" strokeDasharray="7,5" opacity="0.65"
      />

      {/* Destination ripple rings */}
      <circle cx={dest.cx} cy={dest.cy} r="13"
        fill="none" stroke={C.gold} strokeWidth="1"
        style={{ animation: 'mapRippleA 2.2s ease-in-out infinite' }}
      />
      <circle cx={dest.cx} cy={dest.cy} r="20"
        fill="none" stroke={C.gold} strokeWidth="0.75"
        style={{ animation: 'mapRippleB 2.2s ease-in-out infinite' }}
      />
      {/* Destination core */}
      <circle cx={dest.cx} cy={dest.cy} r="5.5" fill={C.gold} />

      {/* Porch YOU marker */}
      <circle cx={porch.cx} cy={porch.cy} r="14" fill={C.bg} stroke={C.green} strokeWidth="2" />
      <circle cx={porch.cx} cy={porch.cy} r="5" fill={C.green} />
      <text x={porch.cx} y={porch.cy + 24}
        textAnchor="middle" fill={C.greenLight}
        fontSize="7.5" fontFamily="Inter, sans-serif" fontWeight="700"
      >PORCH</text>
    </svg>
  );
}

// Location name → map key
export function normalizeFleetLoc(name) {
  if (!name) return 'lobby';
  const n = name.toLowerCase();
  if (n.includes('villa')) return 'villas';
  if (n.includes('lobby')) return 'lobby';
  if (n.includes('cafe')) return 'cafe24';
  if (n.includes('pool') || n.includes('aqua')) return 'pool';
  if (n.includes('spa') || n.includes('temple') || n.includes('wellness')) return 'spa';
  if (n.includes('club') || n.includes('della') || n.includes('adventure')) return 'adventure';
  return 'lobby';
}

// ============================================================
// FLEET MAP — location → location
// Layout: Villas (TL) | Spa (TR) | Lobby (C) | Pool (BL) | Cafe24 (BR)
// ============================================================
export function FleetMap({ origin, destination }) {
  const locs = {
    lobby:     { x: 116, y: 88,  w: 68,  h: 44, cx: 150, cy: 110, label: 'Lobby' },
    villas:    { x: 14,  y: 16,  w: 76,  h: 54, cx: 52,  cy: 43,  label: 'Villas' },
    spa:       { x: 210, y: 16,  w: 76,  h: 54, cx: 248, cy: 43,  label: 'Spa' },
    pool:      { x: 14,  y: 140, w: 76,  h: 54, cx: 52,  cy: 167, label: 'Pool' },
    cafe24:    { x: 210, y: 140, w: 76,  h: 54, cx: 248, cy: 167, label: 'Cafe 24' },
    adventure: { x: 112, y: 148, w: 76,  h: 46, cx: 150, cy: 171, label: 'Adventure' },
  };

  const origKey = normalizeFleetLoc(origin);
  const destKey = normalizeFleetLoc(destination);
  const orig = locs[origKey] || locs.lobby;
  const dest = locs[destKey] || locs.cafe24;

  return (
    <svg viewBox="0 0 300 210" width="100%" style={{ display: 'block' }}>
      <rect width="300" height="210" fill={C.bg} />

      {/* Grid */}
      {[0,1,2,3,4,5].map(i => (
        <line key={`vg${i}`} x1={i*60} y1="0" x2={i*60} y2="210" stroke={C.grid} strokeWidth="0.5" />
      ))}
      {[0,1,2,3,4].map(i => (
        <line key={`hg${i}`} x1="0" y1={i*52} x2="300" y2={i*52} stroke={C.grid} strokeWidth="0.5" />
      ))}

      {/* Roads */}
      <rect x="0" y="82" width="300" height="26" fill={C.road} />
      <rect x="136" y="0" width="28" height="82" fill={C.road} />
      <rect x="136" y="108" width="28" height="102" fill={C.road} />
      {/* Road dashes */}
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={`d${i}`} x={i*46+8} y="94" width="26" height="2" rx="1" fill={C.roadDash} />
      ))}

      {/* Location boxes */}
      {Object.entries(locs).map(([key, loc]) => {
        const isOrig = key === origKey;
        const isDest = key === destKey;
        return (
          <g key={key}>
            <rect x={loc.x} y={loc.y} width={loc.w} height={loc.h} rx="6"
              fill={isDest ? C.goldAlpha10 : isOrig ? C.originAlpha : C.building}
              stroke={isDest ? C.goldAlpha55 : isOrig ? C.originBorder : C.buildingBorder}
              strokeWidth={isDest || isOrig ? 1.5 : 1}
            />
            <text x={loc.cx} y={loc.cy}
              textAnchor="middle"
              fill={isDest ? C.goldText : isOrig ? C.greenLight : C.inactive}
              fontSize="9.5" fontFamily="Inter, sans-serif"
              fontWeight={isDest || isOrig ? '600' : '400'}
            >{loc.label}</text>
          </g>
        );
      })}

      {/* Route line */}
      {origKey !== destKey && (
        <line
          x1={orig.cx} y1={orig.cy}
          x2={dest.cx} y2={dest.cy}
          stroke={C.gold} strokeWidth="1.5" strokeDasharray="7,5" opacity="0.65"
        />
      )}

      {/* Destination ripple */}
      <circle cx={dest.cx} cy={dest.cy} r="13"
        fill="none" stroke={C.gold} strokeWidth="1"
        style={{ animation: 'mapRippleA 2.2s ease-in-out infinite' }}
      />
      <circle cx={dest.cx} cy={dest.cy} r="20"
        fill="none" stroke={C.gold} strokeWidth="0.75"
        style={{ animation: 'mapRippleB 2.2s ease-in-out infinite' }}
      />
      <circle cx={dest.cx} cy={dest.cy} r="5.5" fill={C.gold} />

      {/* Origin marker */}
      <circle cx={orig.cx} cy={orig.cy} r="13" fill={C.bg} stroke={C.green} strokeWidth="2" />
      <circle cx={orig.cx} cy={orig.cy} r="5" fill={C.green} />
    </svg>
  );
}
