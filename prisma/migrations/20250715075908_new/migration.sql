-- CreateTable
CREATE TABLE "SiteHealthReport" (
    "id" SERIAL NOT NULL,
    "flow_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "service_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "healthScore" DOUBLE PRECISION NOT NULL,
    "avgLatency" INTEGER NOT NULL,
    "errorRate" DOUBLE PRECISION NOT NULL,
    "aiSummary" TEXT NOT NULL,
    "positiveHighlights" TEXT NOT NULL,
    "frictionPoints" TEXT NOT NULL,
    "recommendations" TEXT NOT NULL,
    "detailedFindings" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteHealthReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "service_type" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Issue" (
    "id" SERIAL NOT NULL,
    "flowName" TEXT NOT NULL,
    "element" TEXT NOT NULL,
    "pageUrl" TEXT NOT NULL,
    "domSelector" TEXT,
    "action" TEXT NOT NULL,
    "expected" TEXT NOT NULL,
    "actual" TEXT NOT NULL,
    "error" TEXT,
    "consoleNetworkErrors" TEXT,
    "screenshot" TEXT,
    "severity" TEXT,
    "timestamp" TEXT,
    "stepsToReproduce" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("id")
);
