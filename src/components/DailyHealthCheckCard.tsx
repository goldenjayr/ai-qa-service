import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from "remark-breaks"
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
            <p className="text-sm text-gray-400">{check.aiAnalysis}</p>
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
                <h4 className="font-semibold text-gray-300 mb-2">Details</h4>
                <div className="prose prose-invert max-w-none text-sm text-gray-400">
                  <ReactMarkdown remarkPlugins={[remarkBreaks]} children={check.details} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DailyHealthCheckCard;
