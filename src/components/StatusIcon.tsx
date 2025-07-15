import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import React from 'react';

type StatusIconProps = { status: string; size?: number };

const StatusIcon: React.FC<StatusIconProps> = ({ status, size = 20 }) => {
  const statusMap: Record<string, React.ReactNode> = {
    'Operational': <CheckCircle className="text-green-500" size={size} />,
    'Degraded Performance': <AlertTriangle className="text-yellow-500" size={size} />,
    'Partial Outage': <XCircle className="text-red-500" size={size} />,
    'Passed': <CheckCircle className="text-green-500" size={size} />,
    'Failed': <XCircle className="text-red-500" size={size} />,
    'Warning': <AlertTriangle className="text-yellow-500" size={size} />,
    'Optimal': <CheckCircle className="text-green-500" size={size} />,
    'Needs Improvement': <AlertTriangle className="text-yellow-500" size={size} />,
  };
  return statusMap[status] || <CheckCircle className="text-gray-400" size={size} />;
};

export default StatusIcon;
