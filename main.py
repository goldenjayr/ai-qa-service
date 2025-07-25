import asyncio
import json
import os
from browser_use import Agent, Controller, BrowserSession
from browser_use.llm import ChatGoogle
from pydantic import BaseModel
from prisma_client import prisma

# Define the output format as a Pydantic model


class Flow(BaseModel):
    status: str
    healthScore: float
    avgLatency: int
    errorRate: float
    aiSummary: str
    positiveHighlights: str
    frictionPoints: str
    recommendations: str
    detailedFindings: str


class Flows(BaseModel):
    flow: list[Flow]


controller = Controller(output_model=Flows)

browser_session = BrowserSession(
    headless=False,
)


async def save_to_db(json_output):
    await prisma.connect()
    await prisma.sitehealthreport.create(
        data={
            'flow_name': json_output['flow_name'],
            'url': json_output['url'],
            'service_type': json_output['service_type'],
            'status': json_output['status'],
            'healthScore': json_output['healthScore'],
            'avgLatency': json_output['avgLatency'],
            'errorRate': json_output['errorRate'],
            'aiSummary': json_output['aiSummary'],
            'positiveHighlights': json_output['positiveHighlights'],
            'frictionPoints': json_output['frictionPoints'],
            'recommendations': json_output['recommendations'],
            'detailedFindings': json_output['detailedFindings'],
        }
    )
    await prisma.disconnect()


async def analyzePage(flow):
    llm = ChatGoogle(model='gemini-2.5-pro')
    initial_actions = [
        {'go_to_url': {'url': flow['url'], 'new_tab': True}},
    ]
    task = f"""
            **1. OBJECTIVE**
        Perform a concise UX analysis of the following user flow on the website `{flow['url']}`.

        **2. USER FLOW TO EXECUTE**
        3. REQUIRED ANALYSIS
        {json.dumps(flow)}

        Report your findings in the following markdown format:

        ### Overall Summary
        - `status`: Operational / Degraded / Down
        - `healthScore`: % success (e.g. 99.5%)
        - `avgLatency`: Approximate average latency in ms (e.g. 120)
        - `errorRate`: Ratio or percentage (e.g. 0.02 or 2%)
        - `aiSummary`: One short sentence on the general system performance.

        ### Detailed Findings
        - Provide a brief narrative summary (4–5 sentences) of what occurred during the test. Mention which parts of the flow worked as intended, any notable delays or failures, and how the system responded overall. Highlight any unexpected behaviors, broken UI elements, or confusing steps. This section should give a quick but informative walkthrough of the experience across the flow. If any edge cases or errors were triggered, summarize them here.

        ### Positive Highlights
        - Bullet points identifying elements that were clear, reassuring, or created a smooth user experience.

        ### Key Friction Points
        - Bullet points identifying the most significant moments of confusion, hesitation, or difficulty in the flow.

        ### Actionable Recommendations
        - 2-3 concrete suggestions to improve the flow and increase conversion.
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
    if result:
        os.makedirs('results', exist_ok=True)
        parsed: Flows = Flows.model_validate_json(result)
        json_output = {
            "flow_name": flow['flow_name'],
            "url": flow['url'],
            "service_type": flow['service_type'],
            "status": parsed.flow[0].status,
            "healthScore": parsed.flow[0].healthScore,
            "avgLatency": parsed.flow[0].avgLatency,
            "errorRate": parsed.flow[0].errorRate,
            "aiSummary": parsed.flow[0].aiSummary,
            "positiveHighlights": parsed.flow[0].positiveHighlights,
            "frictionPoints": parsed.flow[0].frictionPoints,
            "recommendations": parsed.flow[0].recommendations,
            "detailedFindings": parsed.flow[0].detailedFindings,
        }

        # --- Save to Prisma DB ---
        await save_to_db(json_output)
        print("Result saved to the database via Prisma.")
    else:
        print('No result')


async def main():
    print("Hello from ai-qa-service!")

    flows = [
        {
            "flow_name": "Storefront Site Health and Core Functionality Check",
            "flow_type": "system_check",
            "url": "https://wear.23point5.com",
            "service_type": "storefront",
            "steps": [
                "Step 1: Visit the homepage and record the HTTP status code. If 200, set `status` to 'Operational'.",
                "Step 2: Measure page load time (in ms) and store as `avgLatency`.",
                "Step 3: During navigation, track failed requests (4xx/5xx) and calculate `errorRate` as (failures / total requests).",
                "Step 4: Visit at least 3 key pages (Homepage, Product Listing, Product Detail). If all load correctly, assign a `healthScore` example: ~99%.",
                "Step 5: Based on above results, generate a rough `aiSummary` describing if the site is generally working fine."
            ]
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
        await analyzePage(flow)


if __name__ == "__main__":
    asyncio.run(main())
