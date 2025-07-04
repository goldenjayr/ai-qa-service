import React, { useState } from 'react';
import StatusIcon from './StatusIcon';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, XCircle, ChevronDown, ChevronRight } from 'lucide-react';
import type { DailyHealthCheck } from '../types/types.ts';

interface DailyHealthCheckCardProps {
  check: DailyHealthCheck;
}

const DailyHealthCheckCard: React.FC<DailyHealthCheckCardProps> = ({ check }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusColors = {
    Passed: 'border-green-500/50',
    Warning: 'border-yellow-500/50',
    Failed: 'border-red-500/50',
  };
  return (
    <div className={`bg-gray-800/60 backdrop-blur-sm border ${statusColors[check.status]} rounded-lg transition-all duration-300`}>
      <div className="p-4 cursor-pointer flex justify-between items-center" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-4">
          <StatusIcon status={check.status} />
          <div>
            <p className="font-bold text-gray-200">{new Date(check.date).toDateString()}</p>
            <p className="text-sm text-gray-400">{check.summary}</p>
          </div>
        </div>
        {isExpanded ? <ChevronDown className="text-gray-400" /> : <ChevronRight className="text-gray-400" />}
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-gray-700/50 p-4 space-y-4">
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Checks Performed</h4>
                <ul className="space-y-1 text-sm">
                  {check.details.map((detail, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-400">
                      {detail.includes('FAILED') ? (
                        <XCircle size={14} className="text-red-500" />
                      ) : (
                        <CheckCircle size={14} className="text-green-500" />
                      )}
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">AI Analysis</h4>
                <p className="text-sm text-gray-300 bg-cyan-900/20 p-3 rounded-md border border-cyan-500/20">{check.aiAnalysis}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyHealthCheckCard;
