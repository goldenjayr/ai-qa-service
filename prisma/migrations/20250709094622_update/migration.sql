/*
  Warnings:

  - You are about to drop the column `service_type` on the `SiteHealthReport` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteHealthReport" (
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
INSERT INTO "new_SiteHealthReport" ("aiSummary", "avgLatency", "createdAt", "errorRate", "flow_name", "frictionPoints", "healthScore", "id", "positiveHighlights", "recommendations", "status", "url") SELECT "aiSummary", "avgLatency", "createdAt", "errorRate", "flow_name", "frictionPoints", "healthScore", "id", "positiveHighlights", "recommendations", "status", "url" FROM "SiteHealthReport";
DROP TABLE "SiteHealthReport";
ALTER TABLE "new_SiteHealthReport" RENAME TO "SiteHealthReport";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
