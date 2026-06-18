import React from 'react';

const FunnelChartCard = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-slate-200 dark:border-gray-700 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Sales Funnel</h3>
        <div className="flex items-center justify-center h-80 text-slate-400 dark:text-gray-500">
          No funnel data available
        </div>
      </div>
    );
  }

  const SVG_W = 700;
  const SVG_H = 460;
  const CX = 280; 
  const BLOCK_H = 50;
  const GAP_Y = 20;
  const START_Y = 20;

  // Default light-mode chart palette used across the app
  const colors = [
    { main: '#3B82F6', fold: '#1D4ED8' }, // Blue
    { main: '#8B5CF6', fold: '#5B21B6' }, // Violet
    { main: '#F59E0B', fold: '#B45309' }, // Amber
    { main: '#06B6D4', fold: '#0E7490' }, // Cyan
    { main: '#10B981', fold: '#047857' }, // Emerald
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm flex flex-col items-center border border-slate-200 dark:border-gray-700">
      <div className="w-full flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sales Funnel</h3>
          <p className="text-xs text-slate-500 dark:text-gray-400 mt-0.5">Stage-by-stage pipeline</p>
        </div>
      </div>

      <div className="w-full flex justify-center py-4">
        <svg viewBox={`0 0 ${SVG_W} ${SVG_H}`} className="w-full max-w-3xl overflow-visible font-sans">
          
          {/* CONNECTING GAPS (drawn first to be behind the blocks) */}
          {data.map((_, i) => {
            const y_bot_prev = START_Y + i * (BLOCK_H + GAP_Y) + BLOCK_H;
            const y_top_next = START_Y + (i + 1) * (BLOCK_H + GAP_Y);
            
            const bot_w_prev = 300 - i * 50;
            const top_w_next = 340 - (i + 1) * 50;
            
            const L_bot_prev = CX - bot_w_prev / 2;
            const R_bot_prev = CX + bot_w_prev / 2;
            const L_top_next = CX - top_w_next / 2;
            const R_top_next = CX + top_w_next / 2;
            
            const points = `${L_bot_prev},${y_bot_prev} ${R_bot_prev},${y_bot_prev} ${R_top_next},${y_top_next} ${L_top_next},${y_top_next}`;
            
            return (
              <polygon 
                key={`gap-${i}`} 
                points={points} 
                fill={colors[i % colors.length].fold} 
              />
            );
          })}

          {/* MAIN BLOCKS AND TEXT */}
          {data.map((stage, i) => {
            const y_top = START_Y + i * (BLOCK_H + GAP_Y);
            const y_bot = y_top + BLOCK_H;
            
            const top_w = 340 - i * 50;
            const bot_w = 300 - i * 50;

            const L_top = CX - top_w / 2;
            const R_top = CX + top_w / 2;
            const L_bot = CX - bot_w / 2;
            const R_bot = CX + bot_w / 2;
            
            const points = `${L_top},${y_top} ${R_top},${y_top} ${R_bot},${y_bot} ${L_bot},${y_bot}`;
            
            const mid_y = y_top + BLOCK_H / 2;
            const R_mid = (R_top + R_bot) / 2;
            const clr = colors[i % colors.length];

            return (
              <g key={`block-${i}`}>
                {/* Trapezoid Block */}
                <polygon points={points} fill={clr.main} className="drop-shadow-sm" />
                
                {/* Left Number */}
                <text 
                  x={L_top - 20} 
                  y={mid_y + 12} 
                  fill={clr.main} 
                  fontSize="42" 
                  fontWeight="800" 
                  textAnchor="end"
                  opacity="0.4"
                  letterSpacing="-1"
                >
                  0{i + 1}
                </text>
                
                {/* Center Text (Stage Name) */}
                <text 
                  x={CX} 
                  y={mid_y + 6} 
                  fill="#ffffff" 
                  fontSize="16" 
                  fontWeight="700" 
                  textAnchor="middle"
                  letterSpacing="0.5"
                >
                  {stage.name}
                </text>
                
                {/* Connecting Line to Right Text */}
                <path 
                  d={`M ${R_mid} ${mid_y} L 480 ${mid_y}`} 
                  stroke="#cbd5e1" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 2"
                  fill="none" 
                />
                
                {/* Right Text Block */}
                <text x={495} y={mid_y - 12} fill="#0f172a" fontSize="17" fontWeight="bold">
                  {stage.value.toLocaleString()} Leads
                </text>
                <text x={495} y={mid_y + 8} fill="#475569" fontSize="13" fontWeight="500">
                  {stage.conversionRate}% Conversion Rate
                </text>
                <text x={495} y={mid_y + 24} fill="#94a3b8" fontSize="12">
                  Drop-off: {stage.dropOff}%
                </text>
              </g>
            );
          })}
          
          {/* BOTTOM TRIANGLE TIP */}
          {(() => {
            const lastIdx = data.length - 1;
            const i = lastIdx; // The triangle follows the last block
            const clr = colors[(lastIdx + 1) % colors.length];
            
            const y_top = START_Y + (i + 1) * (BLOCK_H + GAP_Y);
            const y_bot = y_top + 45;
            
            const top_w = 340 - (i + 1) * 50; 
            const L_top = CX - top_w / 2;
            const R_top = CX + top_w / 2;
            
            const triPoints = `${L_top},${y_top} ${R_top},${y_top} ${CX},${y_bot}`;
            
            return (
              <polygon points={triPoints} fill={clr.main} className="drop-shadow-sm" />
            );
          })()}
        </svg>
      </div>
    </div>
  );
};

export default FunnelChartCard;
