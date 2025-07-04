import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import StatusIcon from './StatusIcon';
import type { Service } from '../types/types.ts';

interface ServiceStatusCardProps {
  service: Service;
  onNavigate: (page: string, id?: number | string) => void;
}

const ServiceStatusCard: React.FC<ServiceStatusCardProps> = ({ service, onNavigate }) => {
  const getStatusColor = (status: string) => ({
    'Operational': 'border-green-500/50',
    'Degraded Performance': 'border-yellow-500/50',
    'Partial Outage': 'border-red-500/50',
  }[status] || 'border-gray-500/20');

  return (
    <motion.div
      onClick={() => onNavigate('service-detail', service.id)}
      className={`bg-gray-800/50 backdrop-blur-sm border ${getStatusColor(service.status)} rounded-xl shadow-lg transition-all duration-300 hover:shadow-cyan-500/10 hover:border-cyan-500/50 p-6 cursor-pointer`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-gray-100">{service.name}</h3>
        <div className={`flex items-center gap-2 text-sm font-semibold`}>
          <StatusIcon status={service.status} />
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-1 mb-4">7-Day Uptime History</p>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={service.uptimeHistory} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
          <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <YAxis domain={[90, 100]} tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
          <Tooltip contentStyle={{ background: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563', borderRadius: '0.5rem', color: '#fff' }} formatter={(value: number) => [`${value}%`, 'Uptime']} />
          <Bar dataKey="uptime" radius={[4, 4, 0, 0]}>
            {service.uptimeHistory.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.uptime >= 99.9 ? '#22c55e' : entry.uptime >= 97 ? '#f59e0b' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default ServiceStatusCard;
