import React from 'react';

type SeverityPillProps = { severity: 'High' | 'Medium' | 'Low' };

const SeverityPill: React.FC<SeverityPillProps> = ({ severity }) => {
  const styles = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-blue-100 text-blue-800',
  };
  return (
    <span className={`text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full ${styles[severity]}`}>{severity}</span>
  );
};

export default SeverityPill;
