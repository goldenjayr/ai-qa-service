import React from 'react';
import { motion } from 'framer-motion';
import { reportsData } from '../data/mockData';
import { FileDown, Zap } from 'lucide-react';

interface ReportsPageProps {
  onGenerateReport: () => void;
}

const ReportsPage: React.FC<ReportsPageProps> = ({ onGenerateReport }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
    <header className="mb-8 flex justify-between items-center">
      <div>
        <h1 className="text-4xl font-bold text-gray-100">Reports</h1>
        <p className="text-gray-400 mt-2">View historical analysis and generate new reports.</p>
      </div>
      <button
        onClick={onGenerateReport}
        className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2"
      >
        <Zap size={16} /> Generate New Report
      </button>
    </header>
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-700">
            <th className="p-4 text-sm font-semibold text-gray-400">Report Title</th>
            <th className="p-4 text-sm font-semibold text-gray-400">Date Generated</th>
            <th className="p-4 text-sm font-semibold text-gray-400">Type</th>
            <th className="p-4 text-sm font-semibold text-gray-400"></th>
          </tr>
        </thead>
        <tbody>
          {reportsData.map(report => (
            <tr key={report.id} className="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
              <td className="p-4 font-medium text-gray-200">{report.title}</td>
              <td className="p-4 text-gray-400">{report.date}</td>
              <td className="p-4">
                <span className="text-xs bg-gray-700 text-cyan-300 px-2 py-1 rounded">{report.type}</span>
              </td>
              <td className="p-4 text-right">
                <button className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 ml-auto">
                  <FileDown size={16} /> Download
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
);

export default ReportsPage;
