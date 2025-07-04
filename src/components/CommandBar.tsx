import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { initialServicesData, uxFlowsData } from '../data/mockData';

interface CommandBarProps {
  onClose: () => void;
  onNavigate: (page: string, id?: number | string) => void;
}

const CommandBar: React.FC<CommandBarProps> = ({ onClose, onNavigate }) => {
  const [search, setSearch] = useState('');
  const commands = [
    ...initialServicesData.map(s => ({ type: 'Service', name: s.name, action: () => onNavigate('service-detail', s.id) })),
    ...uxFlowsData.map(f => ({ type: 'UX Flow', name: f.name, action: () => onNavigate('ux-flow-detail', f.id) })),
    { type: 'Page', name: 'Dashboard', action: () => onNavigate('dashboard') },
    { type: 'Page', name: 'Services', action: () => onNavigate('services') },
    { type: 'Page', name: 'UX Flows', action: () => onNavigate('ux-flows') },
    { type: 'Page', name: 'Reports', action: () => onNavigate('reports') },
  ];
  const filteredCommands = search === '' ? commands : commands.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 pt-24" onClick={onClose}>
      <motion.div
        initial={{ scale: 0.95, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: -20 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-3 border-b border-gray-700 flex items-center gap-3">
          <Search className="text-gray-400" />
          <input
            type="text"
            autoFocus
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search for services, UX flows, or navigate..."
            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none"
          />
        </div>
        <ul className="p-2 max-h-96 overflow-y-auto">
          {filteredCommands.map((cmd, i) => (
            <li
              key={i}
              onClick={cmd.action}
              className="p-3 flex justify-between items-center rounded-lg hover:bg-cyan-500/10 cursor-pointer text-gray-200"
            >
              <span>{cmd.name}</span>
              <span className="text-xs text-gray-500 bg-gray-700 px-2 py-1 rounded">{cmd.type}</span>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default CommandBar;
