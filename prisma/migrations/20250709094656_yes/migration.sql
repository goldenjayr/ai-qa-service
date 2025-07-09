/*
  Warnings:

  - Added the required column `service_type` to the `SiteHealthReport` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Service_service_type_key";

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteHealthReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "flow_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "service_type" TEXT NOT NULL,
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
