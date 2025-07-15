"use client";
import React, { useState, useMemo } from "react";
import DateRangeFilter from "./DateRangeFilter";

export interface Issue {
  id: number;
  element: string;
  pageUrl: string;
  domSelector?: string | null;
  action: string;
  expected: string;
  actual: string;
  error?: string | null;
  consoleNetworkErrors?: string | null;
  screenshot?: string | null;
  severity: string;
  timestamp?: string;
  createdAt: string;
  stepsToReproduce: string[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString();
}

function getSeverityColor(sev: string) {
  if (sev.toLowerCase() === "critical") return "#e53935";
  if (sev.toLowerCase() === "minor") return "#fbc02d";
  return "#888";
}

const thStyle: React.CSSProperties = {
  padding: "0.75rem 1rem",
  textAlign: "left",
  fontWeight: 700,
  background: "#f2f2f3",
  fontSize: 15,
  borderBottom: "2px solid #e5e5e8",
};

const tdStyle: React.CSSProperties = {
  padding: "0.7rem 1rem",
  fontSize: 14,
  borderBottom: "1px solid #ececec",
  verticalAlign: "top",
};

const SEVERITY_ORDER = ["critical", "major", "minor"];

type SortOrder = "none" | "asc" | "desc";

export default function IssuesTable({ issues }: { issues: Issue[] }) {
  // Set default date range to last 7 days
  const [startDate, setStartDate] = useState<string>(() => {
    if (!issues.length) return "";
    const allDates = issues.map(i => i.createdAt).sort();
    const max = allDates[allDates.length - 1];
    return max ? new Date(Date.parse(max) - 6 * 86400000).toISOString().slice(0, 10) : "";
  });
  const [endDate, setEndDate] = useState<string>(() => {
    if (!issues.length) return "";
    const allDates = issues.map(i => i.createdAt).sort();
    const max = allDates[allDates.length - 1];
    return max ? max.slice(0, 10) : "";
  });

  const [severitySort, setSeveritySort] = useState<SortOrder>("none");

  const filteredIssues = useMemo(() => {
    if (!startDate && !endDate) return issues;
    return issues.filter((issue: Issue) => {
      const d = issue.createdAt.slice(0, 10);
      return (!startDate || d >= startDate) && (!endDate || d <= endDate);
    });
  }, [issues, startDate, endDate]);

  // Sorting logic
  const sortedIssues = useMemo(() => {
    if (severitySort === "none") return filteredIssues;
    const getOrder = (sev: string) => {
      const idx = SEVERITY_ORDER.indexOf(sev.toLowerCase());
      return idx === -1 ? SEVERITY_ORDER.length : idx;
    };
    const sorted = [...filteredIssues].sort((a, b) => {
      const cmp = getOrder(a.severity) - getOrder(b.severity);
      return severitySort === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [filteredIssues, severitySort]);

  const handleSeveritySort = () => {
    setSeveritySort(prev => prev === "none" ? "desc" : prev === "desc" ? "asc" : "none");
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "1.5rem" }}>All Issues Found</h1>
      <DateRangeFilter
        startDate={startDate}
        endDate={endDate}
        onChange={(start, end) => {
          setStartDate(start);
          setEndDate(end);
        }}
      />
      <div style={{ overflowX: "auto", borderRadius: 8, boxShadow: "0 2px 8px #0002", background: "#fff" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
          <thead style={{ background: "#f7f7f8" }}>
            <tr>
              <th style={thStyle}>Element</th>
              <th style={thStyle}>Page URL</th>
              <th style={thStyle}>Action</th>
              <th style={thStyle}>Expected</th>
              <th style={thStyle}>Actual</th>
              <th
                style={{
                  ...thStyle,
                  cursor: 'pointer',
                  color: severitySort !== 'none' ? '#2563eb' : thStyle.color,
                  background: severitySort !== 'none' ? '#eaf1fb' : thStyle.background,
                  transition: 'background 0.18s, color 0.18s',
                  userSelect: 'none',
                }}
                onClick={handleSeveritySort}
                onMouseEnter={e => (e.currentTarget.style.background = '#dbeafe')}
                onMouseLeave={e => (e.currentTarget.style.background = severitySort !== 'none' ? '#eaf1fb' : thStyle.background as string)}
              >
                <span style={{display: 'inline-flex', alignItems: 'center', gap: 4}}>
                  Severity
                  {severitySort === "desc" && <span style={{fontSize: 15}}>↓</span>}
                  {severitySort === "asc" && <span style={{fontSize: 15}}>↑</span>}
                </span>
              </th>
              <th style={thStyle}>Timestamp</th>
              <th style={thStyle}>Steps to Reproduce</th>
            </tr>
          </thead>
          <tbody>
            {sortedIssues.length === 0 ? (
              <tr>
                <td colSpan={8} style={{
                  textAlign: "center",
                  padding: "2.5rem 1rem",
                  color: '#7b869c',
                  fontSize: 18,
                  background: '#f7fafd',
                  borderRadius: 10,
                  fontWeight: 500,
                  letterSpacing: '0.1px',
                }}>
                  <span style={{ fontSize: 34, display: 'block', marginBottom: 8 }}>😶‍🌫️</span>
                  No issues found for selected date range.
                </td>
              </tr>
            ) : (
              sortedIssues.map((issue: Issue, idx: number) => (
                <tr
                  key={issue.id ?? idx}
                  style={{
                    background: idx % 2 === 0 ? "#fff" : "#f5f6fa",
                    transition: 'background 0.16s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#eaf3fa')}
                  onMouseLeave={e => (e.currentTarget.style.background = idx % 2 === 0 ? "#fff" : "#f5f6fa")}
                >
                  <td style={tdStyle}>{issue.element}</td>
                  <td style={{ ...tdStyle, maxWidth: 220, wordBreak: "break-all" }}>
                    <a
                      href={issue.pageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#2563eb",
                        textDecoration: "underline",
                        fontWeight: 500,
                        transition: 'color 0.16s',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#174ea6')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#2563eb')}
                    >
                      {issue.pageUrl}
                    </a>
                  </td>
                  <td style={tdStyle}>{issue.action}</td>
                  <td style={{ ...tdStyle, maxWidth: 200, wordBreak: "break-word" }}>{issue.expected}</td>
                  <td style={{ ...tdStyle, maxWidth: 200, wordBreak: "break-word" }}>{issue.actual}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, color: getSeverityColor(issue.severity) }}>{issue.severity}</td>
                  <td style={tdStyle}>{formatDate(issue.createdAt)}</td>
                  <td style={{ ...tdStyle, maxWidth: 260, wordBreak: "break-word", fontSize: 13 }}>
                    <ol style={{ margin: 0, paddingLeft: 18 }}>
                      {issue.stepsToReproduce.map((step: string, sidx: number) => (
                        <li key={sidx}>{step}</li>
                      ))}
                    </ol>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
