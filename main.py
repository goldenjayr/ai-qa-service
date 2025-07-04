import asyncio
import json
import os
from browser_use import Agent, Controller, BrowserSession
from browser_use.llm import ChatGoogle
from pydantic import BaseModel

# Define the output format as a Pydantic model


class Flow(BaseModel):
    content: str


class Flows(BaseModel):
    flow: list[Flow]


controller = Controller(output_model=Flows)

browser_session = BrowserSession(
    headless=True,
)


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
        A brief, 1-2 sentence summary of the experience.

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
        flow_name_sanitized = flow['flow_name'].replace(
            ' ', '_').replace('/', '_').lower()

        try:
            parsed: Flows = Flows.model_validate_json(result)
            analysis_content = parsed.flow[0].content
        except (json.JSONDecodeError, KeyError, IndexError):
            analysis_content = result  # Fallback to the raw result if parsing fails

        md_filename = os.path.join('results', f"{flow_name_sanitized}.md")
        with open(md_filename, 'w', encoding='utf-8') as f:
            f.write(analysis_content)
        print(f"Result saved to {md_filename}")

        json_filename = os.path.join('results', f"{flow_name_sanitized}.json")
        json_output = {
            "flow_name": flow['flow_name'],
            "url": flow['url'],
            "analysis": analysis_content
        }
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(json_output, f, indent=4)
        print(f"Result saved to {json_filename}")
    else:
        print('No result')


async def main():
    print("Hello from ai-qa-service!")

    flows = [
        {
            "flow_name": "Homepage to Product Discovery Flow",
            "flow_type": "User Journey - Top of Funnel",
            "url": "https://wear.23point5.com",
            "steps": [
                "Step 1: User lands on the homepage (wear.23point5.com).",
                "Step 2: User is presented with featured collections, new arrivals, or specific brand promotions (e.g., The Beatles, Care Bears).",
                "Step 3: User chooses a path: clicks on a promotional banner, uses the main navigation menu ('Products', 'Brands'), or uses the search bar.",
                "Step 4: User navigates to a collection/listing page, displaying multiple products.",
                "Step 5: User scrolls through the products and clicks on an item image or title to view its details."
            ]
        },
        {
            "flow_name": "Product Page to Add To Cart Flow",
            "flow_type": "Conversion - Mid-Funnel",
            "url": "https://wear.23point5.com",
            "steps": [
                "Step 1: User is on a specific product page.",
                "Step 2: User views product images, description, and price.",
                "Step 3: User selects a required product option, such as 'Size' (e.g., S, M, L, XL), from a dropdown or button list.",
                "Step 4: User may adjust the 'Quantity' for the selected item.",
                "Step 5: User clicks the primary call-to-action button, labeled 'Add to Cart' or similar.",
                "Step 6: A confirmation appears (e.g., a slide-out cart drawer or a mini-modal) showing the item has been added, along with the subtotal."
            ]
        },
        {
            "flow_name": "Shopping Cart and Checkout Flow",
            "flow_type": "Conversion - Bottom of Funnel",
            "url": "https://wear.23point5.com",
            "steps": [
                "Step 1: After adding an item, the user navigates to the full shopping cart page by clicking 'View Cart' or a cart icon.",
                "Step 2: On the cart page, the user reviews all added items, can update quantities, remove items, or add notes to their order.",
                "Step 3: User sees the order subtotal and clicks the 'Checkout' or 'Secure Checkout' button.",
                "Step 4: User is taken to the first page of the Shopify checkout process, where they enter their email and shipping address.",
                "Step 5: User proceeds to the next step to select a shipping method (e.g., Standard Shipping).",
                "Step 6: User enters payment information (Credit Card, PayPal, etc.) in the final step.",
                "Step 7: User reviews all information (contact, shipping address, payment method, and total cost) before finalizing the purchase.",
                "Step 8: User clicks the 'Pay Now' or 'Complete Order' button."
            ]
        }

    ]
    for flow in flows:
        await analyzePage(flow)


if __name__ == "__main__":
    asyncio.run(main())
