import type { Service, UXFlow, Report } from '../types/types.ts';

export const initialServicesData: Service[] = [
  {
    id: 1,
    name: "Storefront",
    status: "Operational",
    healthScore: 99.5,
    aiSummary: "The main e-commerce site is fully operational. All core user flows are performing within expected parameters.",
    avgLatency: 120,
    errorRate: 0.02,
    uptimeHistory: [
      { day: "Mon", uptime: 100 },
      { day: "Tue", uptime: 100 },
      { day: "Wed", uptime: 99.9 },
      { day: "Thu", uptime: 100 },
      { day: "Fri", uptime: 100 },
      { day: "Sat", uptime: 100 },
      { day: "Sun", uptime: 100 }
    ],
    latencyHistory: [
      { hour: "00:00", ms: 110 },
      { hour: "04:00", ms: 115 },
      { hour: "08:00", ms: 130 },
      { hour: "12:00", ms: 140 },
      { hour: "16:00", ms: 125 },
      { hour: "20:00", ms: 118 }
    ],
    errorRateHistory: [
      { hour: "00:00", rate: 0.01 },
      { hour: "04:00", rate: 0.02 },
      { hour: "08:00", rate: 0.02 },
      { hour: "12:00", rate: 0.03 },
      { hour: "16:00", rate: 0.02 },
      { hour: "20:00", rate: 0.01 }
    ],
    dailyChecks: [
      {
        date: "2025-07-04",
        status: "Passed",
        summary: "All checks passed successfully.",
        details: [
          "Homepage GET response: 200 OK",
          "Product page load time: 1.2s",
          "Checkout API latency: 150ms"
        ],
        aiAnalysis: "The Storefront is healthy. User-facing latency is low and all critical endpoints are responsive. No anomalies detected."
      }
    ]
  },
  {
    id: 2,
    name: "Design Studio",
    status: "Operational",
    healthScore: 98.9,
    aiSummary: "The 3D product design service is stable. A minor increase in rendering time was observed for complex models, but it remains within SLOs.",
    avgLatency: 850,
    errorRate: 0.5,
    uptimeHistory: [
      { day: "Mon", uptime: 100 },
      { day: "Tue", uptime: 100 },
      { day: "Wed", uptime: 100 },
      { day: "Thu", uptime: 99.7 },
      { day: "Fri", uptime: 100 },
      { day: "Sat", uptime: 100 },
      { day: "Sun", uptime: 100 }
    ],
    dailyChecks: [
      {
        date: "2025-07-04",
        status: "Passed",
        summary: "All checks passed successfully.",
        details: [
          "GET /v2/designs: 200 OK",
          "POST /v2/designs: 201 Created",
          "Texture Generator dependency: Healthy",
          "Mockup Generator dependency: Healthy"
        ],
        aiAnalysis: "The Design Studio is performing as expected. Core CRUD operations are functional and dependencies are responsive."
      }
    ]
  },

    {
    id: 3,
    name: "Export Service",
    status: "Degraded Performance",
    healthScore: 72.1,
    aiSummary: "High failure rate for export jobs. The service is struggling to connect to the ERP to validate material SKUs.",
    avgLatency: 5500,
    errorRate: 15.2,
    uptimeHistory: [
      { day: "Mon", uptime: 100 },
      { day: "Tue", uptime: 100 },
      { day: "Wed", uptime: 85.0 },
      { day: "Thu", uptime: 82.5 },
      { day: "Fri", uptime: 90.1 },
      { day: "Sat", uptime: 92.3 },
      { day: "Sun", uptime: 95.0 }
    ],
    latencyHistory: [
      { hour: "00:00", ms: 4500 },
      { hour: "04:00", ms: 5000 },
      { hour: "08:00", ms: 6000 },
      { hour: "12:00", ms: 7000 },
      { hour: "16:00", ms: 5500 },
      { hour: "20:00", ms: 4800 }
    ],
    errorRateHistory: [
      { hour: "00:00", rate: 12.1 },
      { hour: "04:00", rate: 14.5 },
      { hour: "08:00", rate: 18.1 },
      { hour: "12:00", rate: 16.8 },
      { hour: "16:00", rate: 14.9 },
      { hour: "20:00", rate: 13.2 }
    ],
    dailyChecks: [
      {
        date: "2025-07-04",
        status: "Failed",
        summary: "ERP connection timeouts are causing export failures.",
        details: [
          "POST /v1/export: 202 Accepted",
          "ERP Connection Healthcheck: FAILED (Timeout)",
          "PrintLayout dependency: Healthy"
        ],
        aiAnalysis: "The primary issue is the connectivity to the ERP. The Export Service itself is running, but its core functionality is impaired by the failing upstream dependency. This is causing a significant backlog of export jobs."
      },
      {
        date: "2025-07-03",
        status: "Warning",
        summary: "Elevated latency on ERP connection.",
        details: [
          "POST /v1/export: 202 Accepted",
          "ERP Connection Healthcheck: Passed (Latency: 4500ms)",
          "PrintLayout dependency: Healthy"
        ],
        aiAnalysis: "Latency to the ERP service increased dramatically yesterday afternoon, likely a precursor to today's timeouts. This suggests the issue is with the ERP service or the network path to it, not the Export Service itself."
      }
    ],
    rootCauseAnalysis: {
      problem: "15% of export jobs are failing with a 'SKU_VALIDATION_TIMEOUT' error.",
      timeline: [
        "July 3, 4:00 PM: ERP service deployed a security patch.",
        "July 3, 4:15 PM: Export service error rate began to climb.",
        "July 4, 9:00 AM: Error rate breached the 10% SLO threshold."
      ],
      probableCause: "The new ERP security patch appears to have introduced stricter firewall rules. The Export Service's IP address range may no longer be whitelisted, causing connection timeouts when it tries to validate material SKUs.",
      recommendation: "1. **Immediate:** Contact the ERP team to verify firewall and whitelisting rules for the Export Service. 2. **Short-term:** Add more robust retry logic with exponential backoff to the ERP connection client in the Export Service. 3. **Long-term:** Establish a shared, automated integration testing suite between the Export and ERP services that runs before any production deployment."
    }
  },

    {
    id: 4,
    name: "Texture Generator",
    status: "Operational",
    healthScore: 99.9,
    aiSummary: "Service is operating at peak efficiency. No issues detected.",
    avgLatency: 350,
    errorRate: 0.01,
    uptimeHistory: [
      { day: "Mon", uptime: 100 },
      { day: "Tue", uptime: 100 },
      { day: "Wed", uptime: 100 },
      { day: "Thu", uptime: 100 },
      { day: "Fri", uptime: 100 },
      { day: "Sat", uptime: 100 },
      { day: "Sun", uptime: 100 }
    ],
    dailyChecks: [
      {
        date: "2025-07-04",
        status: "Passed",
        summary: "All checks passed successfully.",
        details: [
          "Image processing queue depth: 2",
          "Average processing time: 300ms"
        ],
        aiAnalysis: "The Texture Generator is nominal. Processing queue is low and job completion times are excellent."
      }
    ]
  },
  {
    id: 5,
    name: "Mockup Generator",
    status: "Operational",
    healthScore: 99.8,
    aiSummary: "Service is stable. All systems nominal.",
    avgLatency: 400,
    errorRate: 0.03,
    uptimeHistory: [
      { day: "Mon", uptime: 100 },
      { day: "Tue", uptime: 100 },
      { day: "Wed", uptime: 100 },
      { day: "Thu", uptime: 100 },
      { day: "Fri", uptime: 100 },
      { day: "Sat", uptime: 100 },
      { day: "Sun", uptime: 100 }
    ],
    dailyChecks: [
      {
        date: "2025-07-04",
        status: "Passed",
        summary: "All checks passed successfully.",
        details: [
          "Scene rendering queue depth: 5",
          "Average render time: 380ms"
        ],
        aiAnalysis: "The Mockup Generator is healthy and processing jobs efficiently."
      }
    ]
  },
  {
    id: 6,
    name: "ERP",
    status: "Operational",
    healthScore: 99.6,
    aiSummary: "ERP system is stable after the recent security patch. Monitoring all dependent services.",
    avgLatency: 250,
    errorRate: 0.1,
    uptimeHistory: [
      { day: "Mon", uptime: 100 },
      { day: "Tue", uptime: 100 },
      { day: "Wed", uptime: 100 },
      { day: "Thu", uptime: 99.9 },
      { day: "Fri", uptime: 100 },
      { day: "Sat", uptime: 100 },
      { day: "Sun", uptime: 100 }
    ],
    dailyChecks: [
      {
        date: "2025-07-04",
        status: "Passed",
        summary: "All checks passed successfully.",
        details: [
          "GET /api/skus: 200 OK",
          "Database connection pool: 95% available"
        ],
        aiAnalysis: "The ERP system is stable and responsive. No issues detected following yesterday's security patch."
      }
    ]
  },
  {
    id: 7,
    name: "PrintLayout Generator",
    status: "Operational",
    healthScore: 97.5,
    aiSummary: "Service is operational, but showing slightly increased processing times due to upstream latency from the Export Service.",
    avgLatency: 1200,
    errorRate: 1.2,
    uptimeHistory: [
      { day: "Mon", uptime: 100 },
      { day: "Tue", uptime: 100 },
      { day: "Wed", uptime: 99.5 },
      { day: "Thu", uptime: 99.0 },
      { day: "Fri", uptime: 99.2 },
      { day: "Sat", uptime: 99.8 },
      { day: "Sun", uptime: 100 }
    ],
    dailyChecks: [
      {
        date: "2025-07-04",
        status: "Warning",
        summary: "Processing time has increased by 20%.",
        details: [
          "PDF generation time: 1100ms",
          "Export Service dependency: Degraded"
        ],
        aiAnalysis: "The service itself is functional, but its performance is being negatively impacted by the degraded state of the upstream Export Service. This is a cascading effect."
      }
    ]
  }
];

export const reportsData: Report[] = [
  {
    id: 'r1',
    title: "Q2 2025 Performance & Uptime Report",
    date: "2025-07-01",
    type: "Quarterly Summary"
  },
  {
    id: 'r2',
    title: "Weekly Security Audit - W26",
    date: "2025-06-30",
    type: "Security Scan"
  },
  {
    id: 'r3',
    title: "Auth Service Deep-Dive Analysis",
    date: "2025-06-28",
    type: "Performance Analysis"
  }
];

export const uxFlowsData: UXFlow[] = [
  {
    id: 'ux1',
    name: "Add to Cart & Checkout",
    status: "Needs Improvement",
    conversionRate: 4.2,
    trend: -12,
    avgTime: "3m 15s",
    aiSummary: "The checkout flow experiences a significant 65% drop-off on the 'Shipping Details' step. AI analysis indicates user frustration due to slow address validation and multiple rage clicks on the 'Next' button.",
    funnel: [
      { step: "View Product", users: 10000 },
      { step: "Add to Cart", users: 2500 },
      { step: "Begin Checkout", users: 2450 },
      { step: "Shipping Details", users: 2200 },
      { step: "Payment", users: 770 },
      { step: "Conversion", users: 765 }
    ],
    frictionPoints: [
      {
        id: 'fp1',
        type: "Rage Click",
        severity: "High",
        description: "Multiple rapid clicks detected on the shipping form 'Next' button.",
        element: "button#next-step",
        browser: "Chrome",
        device: "Desktop"
      },
      {
        id: 'fp2',
        type: "Slow API Call",
        severity: "High",
        description: "The external address validation API is taking over 5 seconds to respond.",
        element: "input#address-line-1",
        browser: "All",
        device: "All"
      },
      {
        id: 'fp3',
        type: "Confusing UI",
        severity: "Medium",
        description: "Users hesitate for an average of 12 seconds on the payment selection screen.",
        element: "div.payment-options",
        browser: "Safari",
        device: "Mobile"
      }
    ],
    historicalPerformance: [
      { date: '6/4', rate: 4.8 },
      { date: '6/11', rate: 4.7 },
      { date: '6/18', rate: 4.9 },
      { date: '6/25', rate: 4.3 },
      { date: '7/2', rate: 4.2 }
    ]
  },
  {
    id: 'ux2',
    name: "Homepage to Product Discovery",
    status: "Optimal",
    conversionRate: 78.5,
    trend: 3,
    avgTime: "0m 45s",
    aiSummary: "This flow is performing well. The new 'Shop the Look' feature has a high engagement rate and is successfully driving users to product pages.",
    funnel: [
      { step: "Visit Homepage", users: 10000 },
      { step: "Use Search Bar", users: 4500 },
      { step: "Click Category", users: 3500 },
      { step: "View Product Page", users: 7850 }
    ],
    frictionPoints: [],
    historicalPerformance: [
      { date: '6/4', rate: 75.1 },
      { date: '6/11', rate: 76.3 },
      { date: '6/18', rate: 77.0 },
      { date: '6/25', rate: 78.1 },
      { date: '7/2', rate: 78.5 }
    ]
  },
  {
    id: 'ux3',
    name: "Category Filtering & Refinement",
    status: "Needs Improvement",
    conversionRate: 45.2,
    trend: -8,
    avgTime: "1m 25s",
    aiSummary: "Users on mobile devices are abandoning sessions after applying more than two filters, suggesting the mobile filter UI is cumbersome.",
    funnel: [
      { step: "Land on Category Page", users: 5000 },
      { step: "Apply First Filter", users: 3500 },
      { step: "Apply Second Filter", users: 2800 },
      { step: "View Product", users: 2260 }
    ],
    frictionPoints: [
      {
        id: 'fp5',
        type: "High Abandonment",
        severity: "High",
        description: "70% of mobile users leave the page after applying a second filter.",
        element: "div.mobile-filters",
        browser: "All",
        device: "Mobile"
      }
    ],
    historicalPerformance: [
      { date: '6/4', rate: 49.0 },
      { date: '6/11', rate: 48.5 },
      { date: '6/18', rate: 47.1 },
      { date: '6/25', rate: 46.3 },
      { date: '7/2', rate: 45.2 }
    ]
  },
  {
    id: 'ux4',
    name: "Search to Product View",
    status: "Optimal",
    conversionRate: 65.8,
    trend: 2,
    avgTime: "0m 30s",
    aiSummary: "Search performance is strong. Most users find a relevant product within the top 3 results.",
    funnel: [
      { step: "Initiate Search", users: 2000 },
      { step: "View Results Page", users: 1980 },
      { step: "Click a Product", users: 1316 }
    ],
    frictionPoints: [],
    historicalPerformance: [
      { date: '6/4', rate: 64.1 },
      { date: '6/11', rate: 64.5 },
      { date: '6/18', rate: 65.0 },
      { date: '6/25', rate: 65.2 },
      { date: '7/2', rate: 65.8 }
    ]
  }
];
