import asyncio
import json
import os
from browser_use import Agent, Controller, BrowserSession
from browser_use.llm import ChatGoogle
from pydantic import BaseModel

from typing import List, Optional

class Issue(BaseModel):
    element: str
    page_url: str
    dom_selector: Optional[str]
    action: str
    expected: str
    actual: str
    error: Optional[str]
    console_network_errors: Optional[str]
    screenshot: Optional[str]
    severity: Optional[str]
    timestamp: Optional[str]
    steps_to_reproduce: List[str]

class Flow(BaseModel):
    flow_name: str
    issues: List[Issue]

class Flows(BaseModel):
    flows: List[Flow]


controller = Controller(output_model=Flows)

browser_session = BrowserSession(
    headless=True,
    user_agent="Mozilla/5.0 (compatible; 23point5-Bot/1.0; +https://23point5.com/bot)"
)


DEVELOPMENT_MODE = False  # Toggle this to False for production/full crawl

import requests

async def save_issues_to_db(flow_name, issues):
    QA_SERVICE_URL = os.environ.get("QA_SERVICE_URL", "http://localhost:3000")
    API_URL = f"{QA_SERVICE_URL}/api/issues"
    for issue in issues:
        data = {
            'flowName': flow_name,
            'element': issue.get('element', ''),
            'pageUrl': issue.get('page_url', ''),
            'domSelector': issue.get('dom_selector'),
            'action': issue.get('action', ''),
            'expected': issue.get('expected', ''),
            'actual': issue.get('actual', ''),
            'error': issue.get('error'),
            'consoleNetworkErrors': issue.get('console_network_errors'),
            'screenshot': issue.get('screenshot'),
            'severity': issue.get('severity'),
            'timestamp': issue.get('timestamp'),
            'stepsToReproduce': json.dumps(issue.get('steps_to_reproduce', [])),
        }
        try:
            response = requests.post(API_URL, json=data)
            response.raise_for_status()
            print(f"Issue saved via API: {response.json()}")
        except Exception as e:
            print(f"Failed to save issue via API: {e}")


async def analyzePage(flow):
    llm = ChatGoogle(model='gemini-2.5-pro')
    initial_actions = [
        {'go_to_url': {'url': flow['url'], 'new_tab': True}},
    ]
    PAGE_LIMIT = 1 if DEVELOPMENT_MODE else None
    limit_clause = f"- For development speed, visit at most {PAGE_LIMIT} pages during this run." if DEVELOPMENT_MODE else ""
    task = f"""
        **OBJECTIVE**
        Perform a focused automated QA analysis on the website `{flow['url']}` to identify ONLY genuine functional issues that impact user experience.

        **CRITICAL ANALYSIS REQUIREMENTS**
        You are an expert QA analyst. Apply strict criteria to avoid false positives:

        **SCOPE & VALIDATION RULES**
        - Test core user flows and critical interactive elements (primary buttons, forms, navigation, search)
        {limit_clause}
        - For each element tested:
            1. **PRE-VALIDATION**: Verify the element is actually broken, not just behaving differently than expected
            2. **FUNCTIONAL TEST**: Perform the action and wait for full completion (3-5 seconds for async operations)
            3. **CONTEXT ANALYSIS**: Consider if the behavior makes sense in the business context
            4. **IMPACT ASSESSMENT**: Only report if it prevents users from completing their intended action

        **STRICT ISSUE CRITERIA - ONLY REPORT IF ALL CONDITIONS ARE MET:**

        **CRITICAL ISSUES** (Blocks core functionality):
        - Forms that fail to submit after multiple attempts with valid data
        - Cart/checkout processes that fail completely
        - Authentication systems that prevent login with correct credentials
        - Payment processing failures
        - 404/500 errors on core pages
        - Complete page crashes or infinite loading (>30 seconds)

        **MAJOR ISSUES** (Significantly impacts UX):
        - Search functionality returning no results when it should
        - Navigation links leading to wrong destinations
        - Product images/content failing to load consistently
        - Mobile responsive breakdowns that make content unusable
        - Significant performance issues (>10 second load times)

        **MINOR ISSUES** (Noticeable but not blocking):
        - Minor visual inconsistencies that affect readability
        - Slow loading elements (3-10 seconds) that eventually work
        - Accessibility issues that impact disabled users

        **DO NOT REPORT AS ISSUES:**
        - Design choices you disagree with (colors, layouts, styling)
        - Different behavior than competitor sites
        - Elements that work but load slowly (<3 seconds)
        - Pop-ups, marketing banners, or promotional content
        - Social media integrations that are optional
        - External service integrations that are working as designed
        - Cookie notices, GDPR banners, or legal disclaimers
        - Cosmetic spacing or alignment issues
        - Elements that require user interaction to activate (hover states, dropdowns)
        - Features that are intentionally restricted (guest checkout, member-only content)

        **VERIFICATION PROTOCOL**
        Before reporting any issue:
        1. **Retry the action 2-3 times** to confirm it's consistently broken
        2. **Wait for full loading** - many modern sites use lazy loading and async operations
        3. **Check console errors** - only report if there are actual JavaScript errors causing the malfunction
        4. **Verify user impact** - ask "Does this prevent a user from completing their goal?"
        5. **Consider business logic** - some restrictions might be intentional

        **OUTPUT FORMAT**
        Report ONLY verified, impactful issues using this format:

        # Verified Issues Report

        ## Critical Issues Found
        [Only include issues that completely block core functionality]

        ## Major Issues Found
        [Only include issues that significantly impact user experience]

        ## Minor Issues Found
        [Only include issues that are noticeable but not blocking]

        For each genuine issue, include:
        - **Element:** (specific element that failed)
        - **Page URL:** (exact URL where issue occurs)
        - **DOM Selector:** (if relevant for developers)
        - **Action:** (what action was performed)
        - **Expected:** (what should happen based on standard web conventions)
        - **Actual:** (what actually happened, be specific)
        - **Error:** (exact error message or symptom)
        - **Console/Network Errors:** (only if relevant JavaScript/network errors exist)
        - **Screenshot:** (if captured during failure)
        - **Severity:** (critical, major, or minor based on criteria above)
        - **Timestamp:** (when detected)
        - **Steps to Reproduce:** (precise steps that consistently reproduce the issue)
        - **Verification:** (confirm you tested this 2-3 times and it consistently fails)

        **FINAL VALIDATION**
        Before submitting your report, ask yourself:
        - Would this issue prevent a real user from completing their purchase/goal?
        - Is this actually broken, or just designed differently than I expected?
        - Did I wait long enough for async operations to complete?
        - Is this a genuine functional failure or just a design preference?

        If you cannot answer "yes" to the first question, DO NOT include it in your report.

        **If no genuine issues are found, return: "No functional issues detected during testing."**
    """
    agent = Agent(
        task=task,
        initial_actions=initial_actions,
        llm=llm,
        browser_session=browser_session,
        controller=controller,
        max_failures=20
    )
    history = await agent.run()
    result = history.final_result()
    print(result)
    # # Save result to a JSON file in the results folder
    # os.makedirs('results', exist_ok=True)
    # flow_name_safe = flow['flow_name'].replace(' ', '_').replace('&', 'and').replace('/', '_').lower()
    # result_path = f"results/{flow_name_safe}_result.json"
    # with open(result_path, 'w', encoding='utf-8') as f:
    #     f.write(result if isinstance(result, str) else json.dumps(result, indent=2, ensure_ascii=False))
    # print(f"Result saved to {result_path}")

    # Parse and save issues to DB
    try:
        result_json = json.loads(result) if isinstance(result, str) else result
        # Support both single flow and multiple flows structure
        flows = result_json.get('flows') or result_json.get('flow') or []
        if isinstance(flows, dict):
            flows = [flows]
        for flow_obj in flows:
            flow_name = flow_obj.get('flow_name', flow.get('flow_name', ''))
            issues = flow_obj.get('issues', [])
            await save_issues_to_db(flow_name, issues)
        print("Issues saved to the database via Prisma.")
    except Exception as e:
        print(f"Failed to save issues to DB: {e}")


async def main():
    print("Hello from ai-qa-service!")

    flows = [
        {
            "flow_name": "Comprehensive Site Element & Functionality Check",
            "flow_type": "full_crawl",
            "url": "https://wear.23point5.com",
            "service_type": "storefront",
        },
    ]
    for flow in flows:
        # Run the comprehensive element/functionality check for each flow
        await analyzePage(flow)


import time
from datetime import datetime, timedelta

# Function to fetch today's issues, format as HTML, and send via API

def send_today_issues_email():
    try:
        QA_SERVICE_URL = os.environ.get("QA_SERVICE_URL", "http://localhost:3000")
        API_URL = f"{QA_SERVICE_URL}/api/issues?today=true"
        EMAIL_API = os.environ.get("API")
        EMAIL_ENDPOINT = f"{EMAIL_API}/send-email/qa-results" if EMAIL_API else None
        API_USERNAME = os.environ.get("API_USERNAME")
        API_PASSWORD = os.environ.get("API_PASSWORD")
        AUTH = None
        if API_USERNAME and API_PASSWORD:
            from requests.auth import HTTPBasicAuth
            AUTH = HTTPBasicAuth(API_USERNAME, API_PASSWORD)
        if not EMAIL_ENDPOINT:
            print("EMAIL API endpoint not set. Skipping email.")
            return

        resp = requests.get(API_URL, auth=AUTH)
        if resp.status_code != 200:
            print(f"Failed to fetch issues: {resp.text}")
            return
        issues = resp.json()
        if isinstance(issues, dict) and 'issues' in issues:
            issues = issues['issues']

        if not issues:
            # Send a positive email if no issues found
            html_body = """
                <div style='font-family:sans-serif;text-align:center;padding:2em;'>
                    <h2 style='color:#22c55e;'>QA Complete: No Issues Found Today</h2>
                    <p style='font-size:1.2em;'>🎉 Congratulations!<br><br>
                    The automated QA audit for today has completed and <b>no issues</b> were detected.<br>
                    Keep up the great work maintaining a high quality experience! 🚀</p>
                </div>
            """
            email_payload = {
                "subject": "QA Complete: No Issues Found Today",
                "html_body": html_body
            }
            email_resp = requests.post(EMAIL_ENDPOINT, json=email_payload, auth=AUTH)
            if email_resp.status_code == 200:
                print("No issues found today. Success email sent.")
            else:
                print(f"Failed to send no-issues email: {email_resp.text}")
            return

        # Group issues by severity
        severity_order = ['critical', 'major', 'minor']
        grouped = {s: [] for s in severity_order}
        grouped['other'] = []
        for issue in issues:
            sev = (issue.get('severity') or '').strip().lower()
            if sev in severity_order:
                grouped[sev].append(issue)
            else:
                grouped['other'].append(issue)

        # HTML color map
        row_style = {
            'critical': 'background:#ffdddd;color:#a00;font-weight:bold;',
            'major': 'background:#fff3cd;color:#b26a00;',
            'minor': 'background:#ffffe0;color:#666;',
            'other': ''
        }
        section_titles = {
            'critical': 'Critical Issues',
            'major': 'Major Issues',
            'minor': 'Minor Issues',
            'other': 'Other Issues'
        }
        # Inline styles for email-safe table
        wrapper_style = "font-family:Segoe UI,Roboto,Arial,sans-serif;"
        table_style = (
            "width:100%;border-collapse:separate;border-spacing:0;"
            "margin-bottom:2em;background:#fff;border-radius:12px;"
            "overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.07);"
        )
        th_style = (
            "background:#0ea5e9;color:#fff;font-weight:600;"
            "padding:12px 8px;border-bottom:2px solid #e0e7ef;text-align:left;"
        )
        td_style = (
            "padding:10px 8px;border-bottom:1px solid #f1f5f9;font-size:15px;"
        )
        even_row_style = "background:#f6fafd;"
        hover_style = "background:#e0f2fe;"  # Not supported in most email clients but left for clarity
        sev_row_styles = {
            'critical': 'background:#ffdddd;color:#a00;font-weight:bold;',
            'major': 'background:#fff3cd;color:#b26a00;',
            'minor': 'background:#ffffe0;color:#666;',
            'other': ''
        }
        html = [f"<div style='{wrapper_style}'><h2 style='margin-bottom:0.5em;color:#f59e42;'>⚠️ Issues Detected in Today's Automated QA Audit</h2>"]
        for sev in severity_order + ['other']:
            if not grouped[sev]:
                continue
            html.append(f"<h3 style='margin-top:2em;margin-bottom:0.5em;'>{section_titles[sev]}</h3>")
            html.append(f"<table style='{table_style}'>")
            html.append("<tr>"
                        f"<th style='{th_style}'>Element</th>"
                        f"<th style='{th_style}'>Page URL</th>"
                        f"<th style='{th_style}'>Action</th>"
                        f"<th style='{th_style}'>Expected</th>"
                        f"<th style='{th_style}'>Actual</th>"
                        f"<th style='{th_style}'>Error</th>"
                        f"<th style='{th_style}'>Steps To Reproduce</th>"
                        f"<th style='{th_style}'>Severity</th>"
                        f"<th style='{th_style}'>Timestamp</th>"
                        "</tr>")
            for idx, issue in enumerate(grouped[sev]):
                # Apply severity row style, and even-row background for zebra striping
                base_style = sev_row_styles[sev]
                zebra = even_row_style if idx % 2 == 1 and not base_style else ''
                row_style = base_style + zebra
                # Make pageUrl clickable if present
                page_url = issue.get('pageUrl','')
                if page_url:
                    page_url_html = (
                        f"<a href='{page_url}' style='color:#2563eb;text-decoration:underline;' target='_blank' rel='noopener noreferrer'>{page_url}</a>"
                    )
                else:
                    page_url_html = ''
                # Format timestamp to be human-readable
                import datetime
                raw_ts = issue.get('timestamp','')
                readable_ts = raw_ts
                try:
                    # Try ISO8601 with/without timezone
                    if raw_ts:
                        dt = None
                        try:
                            dt = datetime.datetime.fromisoformat(raw_ts.replace('Z', '+00:00'))
                        except Exception:
                            pass
                        if not dt:
                            try:
                                dt = datetime.datetime.strptime(raw_ts, '%Y-%m-%dT%H:%M:%S.%fZ')
                            except Exception:
                                pass
                        if dt:
                            readable_ts = dt.strftime('%b %d, %Y %H:%M')
                except Exception:
                    pass
                # Format steps to reproduce as HTML<br>-joined list
                steps = issue.get('stepsToReproduce') or issue.get('steps_to_reproduce') or []
                if isinstance(steps, str):
                    try:
                        import json as _json
                        steps = _json.loads(steps)
                    except Exception:
                        steps = [steps]
                if isinstance(steps, list):
                    steps_html = '<br>'.join(str(s) for s in steps)
                else:
                    steps_html = str(steps)
                html.append(
                    f"<tr style='{row_style}'>"
                    f"<td style='{td_style}'>{issue.get('element','')}</td>"
                    f"<td style='{td_style}'>{page_url_html}</td>"
                    f"<td style='{td_style}'>{issue.get('action','')}</td>"
                    f"<td style='{td_style}'>{issue.get('expected','')}</td>"
                    f"<td style='{td_style}'>{issue.get('actual','')}</td>"
                    f"<td style='{td_style}'>{issue.get('error','')}</td>"
                    f"<td style='{td_style}'>{steps_html}</td>"
                    f"<td style='{td_style}'>{issue.get('severity','')}</td>"
                    f"<td style='{td_style}'>{readable_ts}</td>"
                    f"</tr>"
                )
            html.append("</table>")
        html.append("</div>")
        html_body = "\n".join(html)

        # Send POST request
        email_payload = {
            "subject": "Today's QA Issues Report",
            "html_body": html_body
        }
        email_resp = requests.post(EMAIL_ENDPOINT, json=email_payload, auth=AUTH)
        if email_resp.status_code == 200:
            print("Today's issues email sent successfully.")
        else:
            print(f"Failed to send email: {email_resp.text}")
    except Exception as e:
        print(f"Error in send_today_issues_email: {e}")

if __name__ == "__main__":
    start_time = time.time()
    asyncio.run(main())
    end_time = time.time()
    elapsed = end_time - start_time
    print(f"Total elapsed time: {elapsed:.2f} seconds")

    # Send today's issues as an HTML email
    send_today_issues_email()
