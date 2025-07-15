import React from "react";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.75rem",
  border: "1px solid #ccc",
  borderRadius: 4,
  fontSize: 14,
  marginRight: 10,
  background: "#fafbfc",
};

export default function DateRangeFilter({ startDate, endDate, onChange }: DateRangeFilterProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", marginBottom: 18, gap: 8 }}>
      <label style={{ fontWeight: 500, marginRight: 8 }}>Filter by date:</label>
      <input
        type="date"
        value={startDate}
        onChange={e => onChange(e.target.value, endDate)}
        style={inputStyle}
        max={endDate || undefined}
      />
      <span style={{ margin: "0 6px" }}>to</span>
      <input
        type="date"
        value={endDate}
        onChange={e => onChange(startDate, e.target.value)}
        style={inputStyle}
        min={startDate || undefined}
      />
    </div>
  );
}
