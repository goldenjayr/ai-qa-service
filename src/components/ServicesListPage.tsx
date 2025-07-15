import React from 'react';
import StatusIcon from './StatusIcon';
import type { Service } from '../types/types.ts';

interface ServicesListPageProps {
  onNavigate: (page: string, id?: number | string) => void;
  services: Service[];
  loading: boolean;
  error: string | null;
}

const ServicesListPage: React.FC<ServicesListPageProps> = ({ onNavigate, services, loading, error }) => {
  if (loading) {
    return <div className="text-gray-400 p-8">Loading...</div>;
  }
  if (error) {
    return <div className="text-red-400 p-8">{error}</div>;
  }
  if (!services.length) {
    return <div className="text-gray-400 p-8">No services found.</div>;
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-4 text-sm font-semibold text-gray-400">Service Name</th>
            <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
            <th className="p-4 text-sm font-semibold text-gray-400 text-center">Health Score</th>
            <th className="p-4 text-sm font-semibold text-gray-400 text-center">Latency</th>
            <th className="p-4 text-sm font-semibold text-gray-400 text-center">Error Rate</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service: Service) => (
            <tr
              key={service.id}
              onClick={() => onNavigate('service-detail', service.id)}
              className="border-b border-gray-700/50 hover:bg-gray-700/30 cursor-pointer transition-colors"
            >
              <td className="p-4 font-medium text-gray-200 capitalize">{service.name}</td>
              <td className="p-4">
                <div className="flex items-center gap-2">
                  <StatusIcon status={service.status} size={16} />
                  <span className="text-sm text-gray-300">{service.status}</span>
                </div>
              </td>
              <td
                className="p-4 text-center text-lg font-semibold"
                style={{ color: service.healthScore > 95 ? '#22c55e' : service.healthScore > 80 ? '#f59e0b' : '#ef4444' }}
              >
                {service.healthScore.toFixed(1)}%
              </td>
              <td className="p-4 text-center text-gray-300">{service.avgLatency}ms</td>
              <td className="p-4 text-center text-gray-300">{service.errorRate}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesListPage;
