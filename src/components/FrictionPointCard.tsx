import React from 'react';
import type { FrictionPoint } from '../types/types.ts';
import { AlertCircle } from 'lucide-react';

interface FrictionPointCardProps {
  point: FrictionPoint;
}

const FrictionPointCard: React.FC<FrictionPointCardProps> = ({ point }) => {
  const color = point.severity === 'High' ? 'text-red-400' : point.severity === 'Medium' ? 'text-yellow-400' : 'text-green-400';
  return (
    <div className={`bg-gray-900/60 border-l-4 ${color} rounded-lg p-4 flex items-start gap-4`}>
      <AlertCircle className={`${color} mt-1`} size={20} />
      <div>
        <div className="flex gap-2 items-center mb-1">
          <span className={`font-bold ${color}`}>{point.severity} Severity</span>
          <span className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded">{point.type}</span>
        </div>
        <p className="text-gray-200 mb-1">{point.description}</p>
        <p className="text-xs text-gray-400">Element: {point.element} | Browser: {point.browser} | Device: {point.device}</p>
      </div>
    </div>
  );
};

export default FrictionPointCard;
