import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import StatusIcon from './StatusIcon';
import type { UXFlow } from '../types/types.ts';

interface UXFlowCardProps {
  flow: UXFlow;
  onNavigate: (page: string, id?: number | string) => void;
}

const UXFlowCard: React.FC<UXFlowCardProps> = ({ flow, onNavigate }) => {
  const isGoodTrend = flow.trend >= 0;
  return (
    <motion.div
      onClick={() => onNavigate('ux-flow-detail', flow.id)}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 cursor-pointer transition-all duration-300 hover:border-cyan-500/50 hover:shadow-cyan-500/10"
      whileHover={{ y: -5 }}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-100">{flow.name}</h3>
        <div className={`flex items-center gap-2 text-sm font-semibold ${isGoodTrend ? 'text-green-400' : 'text-red-400'}`}>
          {isGoodTrend ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{flow.trend}%</span>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <StatusIcon status={flow.status} size={16} />
        <span className="text-sm text-gray-400">{flow.status}</span>
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-400 mb-2">30-Day Conversion Trend</p>
        {/* Chart handled in parent, if needed */}
      </div>
    </motion.div>
  );
};

export default UXFlowCard;
