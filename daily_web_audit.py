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
)


DEVELOPMENT_MODE = True  # Toggle this to False for production/full crawl

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
        Perform a comprehensive automated QA and UX analysis on the website `{flow['url']}`.

        **SCOPE**
        - Enumerate all pages and interactive elements (buttons, links, forms, menus, etc.).
        {limit_clause}
        - For each element:
            - Log its type, label/text, expected function, and the DOM selector or XPath used.
            - Perform its action (click, submit, navigate, etc.).
            - Check if the actual result matches the expected function.
            - Log the full page URL and timestamp.
            - Capture a screenshot if a failure occurs.
            - Log any browser console or network errors that occur during the action.
        - Record any failures, errors, unexpected behaviors, or warnings (e.g., slow response, accessibility issues).
        - At the end, generate a report listing all actual issues found, with details.

        **OUTPUT FORMAT**
        Output only a detailed, actionable list of all issues actually found during the test, in the following markdown format:

        # Test Issues Report

        ## Issues Found

        For each issue, include:
        - **Element:** (e.g., button label, form name, or page route)
        - **Page URL:** (full URL where issue was found)
        - **DOM Selector/XPath:** (if available)
        - **Action:** (e.g., click, submit, navigation)
        - **Expected:** (expected result/behavior)
        - **Actual:** (actual result/behavior)
        - **Error:** (error message, stack trace, or symptom if any)
        - **Console/Network Errors:** (any relevant browser errors)
        - **Screenshot:** (file path or link, if captured)
        - **Severity:** (blocker, critical, minor, warning)
        - **Timestamp:** (when the issue was detected)
        - **Steps to Reproduce:** (step-by-step, if relevant)

        Example:
        1. **Element:** "Add to Cart" button on /product/123
           **Page URL:** https://wear.23point5.com/product/123
           **DOM Selector:** button.add-to-cart
           **Action:** Click
           **Expected:** Item added to cart and confirmation shown
           **Actual:** No confirmation, item not added
           **Error:** JS console error: `Cannot read property 'cart' of undefined`
           **Console/Network Errors:** See attached log
           **Screenshot:** ./screenshots/add-to-cart-error.png
           **Severity:** Critical
           **Timestamp:** 2025-07-10T01:48:43+08:00
           **Steps to Reproduce:**
             - Go to /product/123
             - Click "Add to Cart"

        Only include actual issues found. Do not include summaries, highlights, or recommendations.
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
        # {
        #     "flow_name": "Dashboard Site Health and Core Functionality Check",
        #     "flow_type": "system_check",
        #     "url": "https://dashboard.23point5.com",
        #     "service_type": "dashboard",
        #     "steps": [
        #         "Step 1: Visit the homepage and record the HTTP status code. If 200, set `status` to 'Operational'.",
        #         "Step 2: Login to the dashboard using these credentials: username: jayr@23point5.com, password: 23Point5!!",
        #         "Step 3: Measure page load time (in ms) and store as `avgLatency`.",
        #         "Step 4: During navigation, track failed requests (4xx/5xx) and calculate `errorRate` as (failures / total requests).",
        #         "Step 5: Visit at least 3 key pages. If all load correctly, assign a `healthScore` example: ~99%.",
        #         "Step 6: Based on above results, generate a rough `aiSummary` describing if the site is generally working fine."
        #     ]
        # },
        # {
        #     "flow_name": "Design Studio Functionality and Stability Check",
        #     "flow_type": "system_check",
        #     "url": "https://design.23point5.com",
        #     "service_type": "design-studio",
        #     "steps": [
        #         "Step 1: Access the design studio homepage and record the HTTP status code. If 200, set `status` to 'Operational'.",
        #         "Step 2: Login using the following credentials: username: jayr@23point5.com, password: 23Point5!!",
        #         "Step 3: Select a garment style (e.g., hoodie, t-shirt, sweatshirt). If style loads successfully, continue.",
        #         "Step 4: Wait for the 3D canvas to fully render. Allow a few seconds for model and textures to load completely.",
        #         "Step 5: Record the time until the design canvas becomes fully interactive as `canvasLoadTime` (in ms).",
        #         "Step 6: Test core design actions: (a) add an image, (b) apply a solid color, (c) add text, (d) edit the text (font, size, position). Confirm each executes without bugs.",
        #         "Step 7: Track all network requests during design interactions. Count any failed requests (4xx/5xx) and compute `errorRate` = (failures / total requests).",
        #         "Step 8: If all core features function and there are no critical errors, assign a `healthScore` (e.g., 98–100%).",
        #         "Step 9: Generate an `aiSummary` that briefly evaluates if the design experience is smooth, functional, and production-ready."
        #     ]
        # }

        # {
        #     "flow_name": "Homepage to Product Discovery Flow",
        #     "flow_type": "User Journey - Top of Funnel",
        #     "url": "https://wear.23point5.com",
        #     "steps": [
        #         "Step 1: User lands on the homepage (wear.23point5.com).",
        #         "Step 2: User is presented with featured collections, new arrivals, or specific brand promotions (e.g., The Beatles, Care Bears).",
        #         "Step 3: User chooses a path: clicks on a promotional banner, uses the main navigation menu ('Products', 'Brands'), or uses the search bar.",
        #         "Step 4: User navigates to a collection/listing page, displaying multiple products.",
        #         "Step 5: User scrolls through the products and clicks on an item image or title to view its details."
        #     ]
        # },
        # {
        #     "flow_name": "Product Page to Add To Cart Flow",
        #     "flow_type": "Conversion - Mid-Funnel",
        #     "url": "https://wear.23point5.com",
        #     "steps": [
        #         "Step 1: User is on a specific product page.",
        #         "Step 2: User views product images, description, and price.",
        #         "Step 3: User selects a required product option, such as 'Size' (e.g., S, M, L, XL), from a dropdown or button list.",
        #         "Step 4: User may adjust the 'Quantity' for the selected item.",
        #         "Step 5: User clicks the primary call-to-action button, labeled 'Add to Cart' or similar.",
        #         "Step 6: A confirmation appears (e.g., a slide-out cart drawer or a mini-modal) showing the item has been added, along with the subtotal."
        #     ]
        # },
        # {
        #     "flow_name": "Shopping Cart and Checkout Flow",
        #     "flow_type": "Conversion - Bottom of Funnel",
        #     "url": "https://wear.23point5.com",
        #     "steps": [
        #         "Step 1: After adding an item, the user navigates to the full shopping cart page by clicking 'View Cart' or a cart icon.",
        #         "Step 2: On the cart page, the user reviews all added items, can update quantities, remove items, or add notes to their order.",
        #         "Step 3: User sees the order subtotal and clicks the 'Checkout' or 'Secure Checkout' button.",
        #         "Step 4: User is taken to the first page of the Shopify checkout process, where they enter their email and shipping address.",
        #         "Step 5: User proceeds to the next step to select a shipping method (e.g., Standard Shipping).",
        #         "Step 6: User enters payment information (Credit Card, PayPal, etc.) in the final step.",
        #         "Step 7: User reviews all information (contact, shipping address, payment method, and total cost) before finalizing the purchase.",
        #         "Step 8: User clicks the 'Pay Now' or 'Complete Order' button."
        #     ]
        # }

    ]
    for flow in flows:
        # Run the comprehensive element/functionality check for each flow
        await analyzePage(flow)


if __name__ == "__main__":
    asyncio.run(main())
