import React from 'react';
import { motion } from 'framer-motion';
import ServicesListPage from './ServicesListPage';

interface ServicesPageProps {
  onNavigate: (page: string, id?: number | string) => void;
}

const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <header className="mb-8">
      <h1 className="text-4xl font-bold text-gray-100">Services</h1>
      <p className="text-gray-400 mt-2">Monitor service health and track daily automated checks.</p>
    </header>
    <ServicesListPage onNavigate={onNavigate} />
  </motion.div>
);

export default ServicesPage;
