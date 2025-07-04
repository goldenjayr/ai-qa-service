import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoadingSpinner from './LoadingSpinner';
import callGeminiAPI from '../utils/callGeminiAPI';

interface GenerateReportModalProps {
  onClose: () => void;
}

const GenerateReportModal: React.FC<GenerateReportModalProps> = ({ onClose }) => {
  const [aiSummary, setAiSummary] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const prompt =
      "Generate a concise executive summary for a weekly performance report for a creative e-commerce platform. The key findings are: The main `Storefront` site is stable. However, the `Export Service` has a degraded performance due to an ERP connection issue, causing a 15% failure rate for export jobs. The UX flow for checkout is also underperforming, with high drop-off on the shipping page.";
    const result = await callGeminiAPI(prompt);
    setAiSummary(result);
    setIsGenerating(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: -20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: -20 }}
        className="bg-gray-800 border border-gray-700 rounded-xl shadow-2xl w-full max-w-lg p-8"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-gray-100 mb-4">Generate Executive Summary</h2>
        <button
          onClick={handleGenerateSummary}
          disabled={isGenerating}
          className="bg-cyan-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-cyan-600 transition-colors flex items-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-wait"
        >
          {isGenerating ? <LoadingSpinner /> : null}
          {isGenerating ? 'Generating...' : '✨ Generate with AI'}
        </button>
        {aiSummary && (
          <div className="mt-4 text-gray-300 bg-cyan-900/20 p-4 rounded-md border border-cyan-500/20">
            <h4 className="font-bold text-cyan-200 mb-2">AI Summary:</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{aiSummary}</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default GenerateReportModal;
