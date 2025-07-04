import React from 'react';
import { motion } from 'framer-motion';
import { initialServicesData, uxFlowsData } from '../data/mockData';
import ServiceStatusCard from './ServiceStatusCard';
import UXFlowSummaryCard from './UXFlowSummaryCard';

interface DashboardPageProps {
  onNavigate: (page: string, id?: number | string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-gray-100">Dashboard</h1>
      <p className="text-gray-400 mt-2">A holistic view of your application's quality, from backend services to user experience.</p>
    </header>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <section className="lg:col-span-3">
        <h2 className="text-2xl font-semibold text-gray-200 mb-6">Core Service Health</h2>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {initialServicesData.slice(0, 4).map((service) => (
            <ServiceStatusCard key={service.id} service={service} onNavigate={onNavigate} />
          ))}
        </div>
      </section>
      <section className="lg:col-span-2">
        <h2 className="text-2xl font-semibold text-gray-200 mb-6">UX Flow Health</h2>
        <div className="space-y-6">
          {uxFlowsData.map(flow => <UXFlowSummaryCard key={flow.id} flow={flow} onNavigate={onNavigate} />)}
        </div>
      </section>
    </div>
  </motion.div>
);

export default DashboardPage;
