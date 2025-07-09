import React from 'react';
import { motion } from 'framer-motion';
import ServicesListPage from './ServicesListPage';
import type { Service } from '../types/types';

interface ServicesPageProps {
  onNavigate: (page: string, id?: number | string) => void;
  services: Service[];
  loading: boolean;
  error: string | null;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, services, loading, error }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-gray-100">Services</h1>
      <p className="text-gray-400 mt-2">Monitor service health and track daily automated checks.</p>
    </header>
    <ServicesListPage onNavigate={onNavigate} services={services} loading={loading} error={error} />
  </motion.div>
);

export default ServicesPage;
