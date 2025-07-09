/*
  Warnings:

  - Added the required column `service_type` to the `Service` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Service" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "service_type" TEXT NOT NULL
);
INSERT INTO "new_Service" ("id", "name") SELECT "id", "name" FROM "Service";
DROP TABLE "Service";
ALTER TABLE "new_Service" RENAME TO "Service";
CREATE UNIQUE INDEX "Service_service_type_key" ON "Service"("service_type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
