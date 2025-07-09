import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { initialServicesData } from '../../data/mockData';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Fetch all services
    const services = await prisma.service.findMany();
    if (!services || services.length === 0) {
      return res.status(200).json(initialServicesData);
    }

    // For each service, fetch all related reports (by flow_name)
    const result = await Promise.all(
      services.map(async (service) => {
        const reports = await prisma.siteHealthReport.findMany({
          where: { service_type: service.service_type },
          orderBy: { createdAt: 'desc' }
        });

        // Convert reports to dailyChecks
        const dailyChecks = reports.map((report) => {
          const sections: string[] = [];
          if (report.positiveHighlights) {
            sections.push(`### **Positive Highlights**\n${report.positiveHighlights}`);
          }
          if (report.frictionPoints) {
            sections.push(`### **Friction Points**\n${report.frictionPoints}`);
          }
          if (report.recommendations) {
            sections.push(`### **Recommendations**\n${report.recommendations}`);
          }
          const detailsMd = sections.join('\n &nbsp; \n');
          return {
            date: report.createdAt.toISOString().slice(0, 10),
            status: report.status,
            summary: report.positiveHighlights || 'No summary',
            details: detailsMd,
            aiAnalysis: report.aiSummary
          };
        });

        // Latest daily check (if any)
        const latestCheck = dailyChecks[0] || null;

        // Use the latest report for other fields, or defaults
        const latestReport = reports[0];
        return {
          id: service.id,
          name: service.name,
          service_type: latestReport?.service_type || '',
          status: latestReport?.status || 'Unknown',
          healthScore: latestReport?.healthScore || 0,
          aiSummary: latestReport?.aiSummary || '',
          avgLatency: latestReport?.avgLatency || 0,
          errorRate: latestReport?.errorRate || 0,
          // Build uptimeHistory for the current week (Mon-Sun)
          uptimeHistory: (() => {
            // Get current date and determine the start of the week (Monday)
            const now = new Date();
            // Local time is 2025-07-09T16:27:30+08:00 (Wednesday)
            // Compute Monday of this week
            const dayOfWeek = now.getDay(); // 0 (Sun) - 6 (Sat)
            // Map Sunday (0) to 7 for easier math
            const offsetToMonday = ((dayOfWeek + 6) % 7);
            const monday = new Date(now);
            monday.setDate(now.getDate() - offsetToMonday);
            // Prepare days array
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            // Build a map of reports per day (use latest for each day)
            // Use a type for reportsByDay that matches the report object
            type Report = typeof reports[0];
            const reportsByDay: { [key: number]: Report } = {};
            reports.forEach((report) => {
              const reportDate = new Date(report.createdAt);
              // Get weekday index (0=Sun, 1=Mon, ..., 6=Sat)
              const weekday = reportDate.getDay();
              // Map Sunday (0) to 6, Monday (1) to 0, etc.
              const mappedIdx = (weekday + 6) % 7;
              // Only consider reports within this week
              const mondayDate = new Date(monday);
              mondayDate.setHours(0,0,0,0);
              const sunday = new Date(monday);
              sunday.setDate(monday.getDate() + 6);
              sunday.setHours(23,59,59,999);
              if (reportDate >= mondayDate && reportDate <= sunday) {
                // For each day, keep only the latest report
                if (!reportsByDay[mappedIdx] || new Date(report.createdAt) > new Date(reportsByDay[mappedIdx].createdAt)) {
                  reportsByDay[mappedIdx] = report;
                }
              }
            });
            // Build uptimeHistory for each day
            return days.map((day, idx) => {
              const report = reportsByDay[idx];
              return {
                day,
                uptime: report ? report.healthScore : 0
              };
            });
          })(),
          latencyHistory: (() => {
            // Time slots for the day
            const hours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
            // Find latest report for today
            const today = new Date();
            today.setHours(0,0,0,0);
            const latestTodayReport = reports.find((report) => {
              const d = new Date(report.createdAt);
              return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
            });
            return hours.map(hour => ({
              hour,
              ms: latestTodayReport ? latestTodayReport.avgLatency : 0
            }));
          })(),
          errorRateHistory: (() => {
            const hours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];
            const today = new Date();
            today.setHours(0,0,0,0);
            const latestTodayReport = reports.find((report) => {
              const d = new Date(report.createdAt);
              return d.getFullYear() === today.getFullYear() && d.getMonth() === today.getMonth() && d.getDate() === today.getDate();
            });
            return hours.map(hour => ({
              hour,
              rate: latestTodayReport ? latestTodayReport.errorRate : 0
            }));
          })(),
          dailyChecks,
          latestDailyCheck: latestCheck,
          rootCauseAnalysis: undefined,
        };
      })
    );

    return res.status(200).json(result);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

