import React from 'react';

type CustomTooltipProps = { active?: boolean; payload?: any[]; label?: string; unit?: string };

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-600 p-3 rounded-lg shadow-lg">
        <p className="label text-gray-300 font-bold">{`${label}`}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>{`${p.name}: ${p.value.toFixed(2)}${p.unit || ''}`}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
