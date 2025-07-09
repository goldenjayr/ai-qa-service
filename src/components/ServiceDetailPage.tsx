import React from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area } from 'recharts';
import StatusIcon from './StatusIcon';
import MetricCard from './MetricCard';
import DailyHealthCheckCard from './DailyHealthCheckCard';
import LiveIncidentCard from './LiveIncidentCard';
import { ArrowLeft, Calendar } from 'lucide-react';
import type { Service } from '../types/types.ts';

interface ServiceDetailPageProps {
  service: Service;
  onBack: () => void;
}

const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ service, onBack }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <header className="mb-8">
      <button onClick={onBack} className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 mb-4 transition-colors">
        <ArrowLeft size={18} /> Back to Services
      </button>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-100 capitalize">{service.service_type}</h1>
          <div className="flex items-center gap-3 mt-2">
            <StatusIcon status={service.status} />
            <span className="text-lg text-gray-300">{service.status}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400">AI Health Score</p>
          <p
            className="text-4xl font-bold"
            style={{ color: service.healthScore > 95 ? '#22c55e' : service.healthScore > 80 ? '#f59e0b' : '#ef4444' }}
          >
            {service.healthScore.toFixed(1)}%
          </p>
        </div>
      </div>
    </header>
    <div className="space-y-6">
      {service.status !== 'Operational' && service.rootCauseAnalysis && <LiveIncidentCard rca={service.rootCauseAnalysis} />}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricCard title="7-Day Uptime">
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={service.uptimeHistory} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <YAxis domain={[80, 100]} tickLine={false} axisLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: 'rgba(31, 41, 55, 0.8)', border: '1px solid #4b5563', borderRadius: '0.5rem', color: '#fff' }} formatter={(value: number) => [`${value}%`, 'Uptime']} />
              <Bar dataKey="uptime" radius={[4, 4, 0, 0]}>
                {service.uptimeHistory.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.uptime >= 99.9 ? '#22c55e' : entry.uptime >= 97 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </MetricCard>
        <MetricCard title="24-Hour Latency (ms)">
          <ResponsiveContainer width="100%" height={150}>
            <AreaChart data={service.latencyHistory || []} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="colorLatency" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <YAxis stroke="#9ca3af" fontSize={12} />
              <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
              <Tooltip />
              <Area type="monotone" dataKey="ms" name="Latency" stroke="#f59e0b" fill="url(#colorLatency)" />
            </AreaChart>
          </ResponsiveContainer>
        </MetricCard>
      </div>
      <div>
        <h3 className="text-2xl font-semibold text-gray-200 mb-4 flex items-center gap-3">
          <Calendar /> Daily Health Checks
        </h3>
        <div className="space-y-4">
          {service.dailyChecks.map(check => (
            <DailyHealthCheckCard key={check.date} check={check} />
          ))}
        </div>
      </div>
    </div>
  </motion.div>
);

export default ServiceDetailPage;
