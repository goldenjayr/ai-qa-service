import React from "react";

interface DateRangeFilterProps {
  startDate: string;
  endDate: string;
  onChange: (start: string, end: string) => void;
}

const inputStyle: React.CSSProperties = {
  padding: "0.5rem 0.85rem",
  border: "1.5px solid #d3dae6",
  borderRadius: 6,
  fontSize: 15,
  marginRight: 10,
  background: "#f8fafc",
  outline: "none",
  transition: "border-color 0.18s, box-shadow 0.18s, background 0.18s",
  cursor: "pointer",
};

const inputHoverStyle: React.CSSProperties = {
  borderColor: "#2563eb",
  background: "#f1f5fe",
  boxShadow: "0 0 0 2px #2563eb22",
};

const filterContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  marginBottom: 18,
  gap: 8,
  background: "#f5f7fa",
  borderRadius: 10,
  boxShadow: "0 1px 6px #22304a0a",
  padding: "0.7rem 1.2rem",
  border: "1.5px solid #e7eaf3",
  transition: "box-shadow 0.18s, border 0.18s",
};

export default function DateRangeFilter({ startDate, endDate, onChange }: DateRangeFilterProps) {
  return (
    <div
      style={filterContainerStyle}
      onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px #2563eb11')}
      onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.boxShadow = filterContainerStyle.boxShadow as string)}
    >
      <label style={{ fontWeight: 600, marginRight: 10, color: "#22304a", fontSize: 15, letterSpacing: "0.1px" }}>
        <span style={{ marginRight: 6, fontSize: 16, color: "#2563eb" }}>⏱️</span>
        Filter by date:
      </label>
      <input
        type="date"
        value={startDate}
        onChange={e => onChange(e.target.value, endDate)}
        style={inputStyle}
        max={endDate || undefined}
        onFocus={e => Object.assign(e.currentTarget.style, inputHoverStyle)}
        onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
        onMouseEnter={e => Object.assign(e.currentTarget.style, inputHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, inputStyle)}
      />
      <span style={{ margin: "0 6px", color: "#7b869c", fontWeight: 500 }}>to</span>
      <input
        type="date"
        value={endDate}
        onChange={e => onChange(startDate, e.target.value)}
        style={inputStyle}
        min={startDate || undefined}
        onFocus={e => Object.assign(e.currentTarget.style, inputHoverStyle)}
        onBlur={e => Object.assign(e.currentTarget.style, inputStyle)}
        onMouseEnter={e => Object.assign(e.currentTarget.style, inputHoverStyle)}
        onMouseLeave={e => Object.assign(e.currentTarget.style, inputStyle)}
      />
    </div>
  );
}
