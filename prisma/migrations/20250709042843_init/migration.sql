-- CreateTable
CREATE TABLE "SiteHealthReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flow_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "healthScore" REAL NOT NULL,
    "avgLatency" INTEGER NOT NULL,
    "errorRate" REAL NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "positiveHighlights" TEXT NOT NULL,
    "frictionPoints" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
