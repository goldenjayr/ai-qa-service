import React from 'react';

interface MetricCardProps {
  title: string;
  children: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, children }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
    <h4 className="font-semibold text-gray-300 mb-2">{title}</h4>
    {children}
  </div>
);

export default MetricCard;
