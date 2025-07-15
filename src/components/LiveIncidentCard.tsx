import React, { useState } from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import type { RootCauseAnalysis } from '../types/types.ts';
import callGeminiAPI from '../utils/callGeminiAPI';

interface LiveIncidentCardProps {
  rca: RootCauseAnalysis;
}

const LiveIncidentCard: React.FC<LiveIncidentCardProps> = ({ rca }) => {
  const [deepAnalysis, setDeepAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDeepenAnalysis = async () => {
    setIsLoading(true);
    const prompt = `You are an expert Site Reliability Engineer. Given the following initial Root Cause Analysis, provide a deeper, more technical analysis. Expand on the probable cause, identify potential cascading failures to other services, and suggest a more detailed, step-by-step remediation plan with code examples if applicable.\n\nInitial RCA:\n- Problem: ${rca.problem}\n- Timeline: ${rca.timeline.join("\n")}\n- Probable Cause: ${rca.probableCause}\n- Recommendation: ${rca.recommendation}`;
    const result = await callGeminiAPI(prompt);
    setDeepAnalysis(result);
    setIsLoading(false);
  };

  return (
    <div className="bg-red-900/20 backdrop-blur-sm border border-red-500/50 rounded-xl p-6">
      <h3 className="flex items-center gap-3 font-semibold text-red-300 text-lg mb-4">
        <AlertTriangle /> Live Incident Analysis
      </h3>
      <div className="space-y-4">
        <div>
          <h4 className="font-bold text-gray-200">Problem Identified:</h4>
          <p className="text-gray-300">{rca.problem}</p>
        </div>
        <div>
          <h4 className="font-bold text-gray-200">Most Probable Cause:</h4>
          <p className="text-gray-300">{rca.probableCause}</p>
        </div>
        <button
          onClick={handleDeepenAnalysis}
          disabled={isLoading}
          className="text-sm bg-red-500/20 hover:bg-red-500/40 text-red-200 font-semibold py-2 px-3 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait"
        >
          {isLoading ? <LoadingSpinner /> : <Sparkles size={16} />}
          {isLoading ? 'Analyzing...' : '✨ Deepen Analysis with AI'}
        </button>
        {deepAnalysis && (
          <div className="mt-4 text-sm text-gray-300 bg-red-900/30 p-4 rounded-md border border-red-500/30">
            <h4 className="font-bold text-red-200 mb-2">Deep Analysis Results:</h4>
            <p style={{ whiteSpace: 'pre-wrap' }}>{deepAnalysis}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveIncidentCard;
