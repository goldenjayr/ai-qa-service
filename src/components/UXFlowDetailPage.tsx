import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import type { UXFlow } from '../types/types.ts';
import FrictionPointCard from './FrictionPointCard';

interface UXFlowDetailPageProps {
  flow: UXFlow;
  onBack: () => void;
}

const UXFlowDetailPage: React.FC<UXFlowDetailPageProps> = ({ flow, onBack }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <header className="mb-8">
      <button onClick={onBack} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors">
        <ArrowLeft size={18} /> Back to UX Flows
      </button>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-100">{flow.name}</h1>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-lg text-gray-300">{flow.status}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">Conversion Rate</p>
          <p className="text-4xl font-bold text-green-400">{flow.conversionRate}%</p>
        </div>
      </div>
    </header>
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-300 mb-2">30-Day Conversion Trend</h4>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={flow.historicalPerformance} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="rate" name="Conversion Rate" stroke="#22c55e" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-300 mb-2">AI Summary</h4>
          <p className="text-gray-300 bg-cyan-900/20 p-3 rounded-md border border-cyan-500/20">{flow.aiSummary}</p>
        </div>
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-gray-200 mb-4 flex items-center gap-3">
          <AlertTriangle /> Friction Points
        </h3>
        <div className="space-y-4">
          {flow.frictionPoints.map(fp => (
            <FrictionPointCard key={fp.id} point={fp} />
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default UXFlowDetailPage;
