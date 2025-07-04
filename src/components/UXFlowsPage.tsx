import React from 'react';
import { motion } from 'framer-motion';
import { uxFlowsData } from '../data/mockData';
import UXFlowCard from './UXFlowCard';

interface UXFlowsPageProps {
  onNavigate: (page: string, id?: number | string) => void;
}

const UXFlowsPage: React.FC<UXFlowsPageProps> = ({ onNavigate }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-gray-100">User Experience Flows</h1>
      <p className="text-gray-400 mt-2">
        Analysis of critical user journeys on the
        <a href="https://wear.23point5.com" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline"> Storefront</a>
      </p>
    </header>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {uxFlowsData.map(flow => (
        <UXFlowCard key={flow.id} flow={flow} onNavigate={onNavigate} />
      ))}
    </div>
  </motion.div>
);

export default UXFlowsPage;
