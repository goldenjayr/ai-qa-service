import IssuesTable, { Issue } from "../../components/IssuesTable";
import { PrismaClient } from "@prisma/client";

export default async function IssuesPage() {
  const prisma = new PrismaClient();
  const dbIssues = await prisma.issue.findMany({ orderBy: { createdAt: "desc" } });
  // Map DB fields to camelCase for the client component
  const issues = dbIssues.map((issue: any) => ({
    id: issue.id,
    element: issue.element,
    pageUrl: issue.pageUrl,
    domSelector: issue.domSelector,
    action: issue.action,
    expected: issue.expected,
    actual: issue.actual,
    error: issue.error,
    consoleNetworkErrors: issue.consoleNetworkErrors,
    screenshot: issue.screenshot,
    severity: issue.severity,
    timestamp: issue.timestamp,
    createdAt: (typeof issue.createdAt === "string") ? issue.createdAt : issue.createdAt?.toISOString?.() ?? "",
    stepsToReproduce: typeof issue.stepsToReproduce === "string"
      ? JSON.parse(issue.stepsToReproduce)
      : (issue.stepsToReproduce ?? []),
  }));
  return <IssuesTable issues={issues as Issue[]} />;
}