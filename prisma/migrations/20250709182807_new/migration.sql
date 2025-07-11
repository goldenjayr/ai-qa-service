-- CreateTable
CREATE TABLE "Issue" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
