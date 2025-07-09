-- CreateTable
CREATE TABLE "SiteHealthReport" (
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SiteHealthReport_service_type_fkey" FOREIGN KEY ("service_type") REFERENCES "Service" ("service_type") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "service_type" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_service_type_key" ON "Service"("service_type");
