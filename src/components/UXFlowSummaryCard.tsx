import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import type { UXFlow } from '../types/types.ts';

interface UXFlowSummaryCardProps {
  flow: UXFlow;
  onNavigate: (page: string, id?: number | string) => void;
}

const UXFlowSummaryCard: React.FC<UXFlowSummaryCardProps> = ({ flow, onNavigate }) => {
  const isGood = flow.status === 'Optimal';
  return (
    <motion.div
      onClick={() => onNavigate('ux-flow-detail', flow.id)}
      className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/60 rounded-xl p-4 cursor-pointer hover:bg-gray-800 transition-colors"
      whileHover={{ y: -3 }}
    >
      <div className="flex justify-between items-center">
        <h4 className="font-bold text-gray-200">{flow.name}</h4>
        <div className={`flex items-center gap-2 text-sm font-semibold ${isGood ? 'text-green-400' : 'text-yellow-400'}`}>
          {isGood ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span>{flow.conversionRate}%</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-1">{flow.status}</p>
    </motion.div>
  );
};

export default UXFlowSummaryCard;
