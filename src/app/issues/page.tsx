import IssuesTable, { Issue } from "../../components/IssuesTable";
import { PrismaClient } from "@prisma/client";

export default async function IssuesPage() {
  const prisma = new PrismaClient();
  const dbIssues = await prisma.issue.findMany({ orderBy: { createdAt: "desc" } });
  // Map DB fields to camelCase for the client component
  const issues: Issue[] = dbIssues.map((issue: any) => ({
    id: issue.id,
    element: issue.element,
    pageUrl: issue.pageUrl ?? issue.page_url,
    domSelector: issue.domSelector ?? issue.dom_selector,
    action: issue.action,
    expected: issue.expected,
    actual: issue.actual,
    error: issue.error,
    consoleNetworkErrors: issue.consoleNetworkErrors ?? issue.console_network_errors,
    screenshot: issue.screenshot,
    severity: issue.severity,
    timestamp: issue.timestamp,
    createdAt: (typeof issue.createdAt === "string") ? issue.createdAt : issue.createdAt?.toISOString?.() ?? "",
    stepsToReproduce: typeof issue.stepsToReproduce === "string"
      ? JSON.parse(issue.stepsToReproduce)
      : (issue.stepsToReproduce ?? issue.steps_to_reproduce ?? []),
  }));
  return <IssuesTable issues={issues} />;
}