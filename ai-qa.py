import asyncio
from urllib.parse import urlparse, urljoin
from playwright.async_api import async_playwright

# ------------------- CONFIG -------------------
# Set the target website URL here
TARGET_URL = "https://wear.23point5.com"  # Change this to any site you want
MAX_DEPTH = 3  # How deep to crawl internal links

# ------------------- CORE LOGIC -------------------
visited = set()
issues = []
DEVELOPMENT_MODE = True  # Set to False for full crawl in production
MAX_PAGES = 2 if DEVELOPMENT_MODE else float('inf')

async def enumerate_and_test_elements(page, url):
    page_issues = []
    await page.goto(url)
    await page.wait_for_load_state('networkidle')
    print(f"\nVisiting: {url}")

    # Gather all buttons, links, and forms
    buttons = await page.query_selector_all('button, [role=button], input[type=submit]')
    links = await page.query_selector_all('a[href]')
    forms = await page.query_selector_all('form')

    # Test buttons
    for btn in buttons:
        try:
            label = (await btn.inner_text()).strip() if await btn.inner_text() else None
            display_label = label or '[no label]'
            print(f"  Button: {display_label}")
            # Infer functionality: if type=submit or parent is form, call it 'Submits form', else 'Triggers action or navigation'
            btn_type = await btn.get_attribute('type')
            functionality = 'Submits form' if btn_type == 'submit' else 'Triggers action or navigation'
            # Get location (bounding box)
            try:
                box = await btn.bounding_box()
                location = f"x={int(box['x'])}, y={int(box['y'])}, w={int(box['width'])}, h={int(box['height'])}" if box else 'unknown'
            except Exception:
                location = 'unknown'
            # Try to click if visible/enabled
            if await btn.is_enabled() and await btn.is_visible():
                try:
                    await btn.click(timeout=1500)
                except Exception as e:
                    if 'translation missing' not in str(e):
                        page_issues.append({
                            'type': 'button',
                            'label': display_label,
                            'functionality': functionality,
                            'location': location,
                            'error': f"Button interaction failed: {e}"
                        })
            else:
                if 'translation missing' not in display_label:
                    page_issues.append({
                        'type': 'button',
                        'label': display_label,
                        'functionality': functionality,
                        'location': location,
                        'error': f"Button not enabled/visible."
                    })
        except Exception as e:
            if 'translation missing' not in str(e):
                page_issues.append({
                    'type': 'button',
                    'label': '[error]',
                    'functionality': 'Unknown',
                    'location': 'unknown',
                    'error': f"Button error: {e}"
                })

    # Test links
    for link in links:
        try:
            href = await link.get_attribute('href')
            label = (await link.inner_text()).strip() if await link.inner_text() else href
            if not href or href.startswith('javascript:'): continue
            print(f"  Link: {label} -> {href}")
            # Infer functionality: navigation if href is not blank
            functionality = f"Navigates to {href}" if href else 'Unknown'
            try:
                box = await link.bounding_box()
                location = f"x={int(box['x'])}, y={int(box['y'])}, w={int(box['width'])}, h={int(box['height'])}" if box else 'unknown'
            except Exception:
                location = 'unknown'
        except Exception as e:
            if 'translation missing' not in str(e):
                page_issues.append({
                    'type': 'link',
                    'label': '[error]',
                    'functionality': 'Unknown',
                    'location': 'unknown',
                    'error': f"Link error: {e}"
                })

    # Test forms
    for form in forms:
        try:
            print(f"  Form found.")
            # Functionality: Submits data
            functionality = 'Submits data to server'
            try:
                box = await form.bounding_box()
                location = f"x={int(box['x'])}, y={int(box['y'])}, w={int(box['width'])}, h={int(box['height'])}" if box else 'unknown'
            except Exception:
                location = 'unknown'
        except Exception as e:
            if 'translation missing' not in str(e):
                page_issues.append({
                    'type': 'form',
                    'label': '[form]',
                    'functionality': 'Submits data to server',
                    'location': 'unknown',
                    'error': f"Form error: {e}"
                })

    return page_issues, [await link.get_attribute('href') for link in links if await link.get_attribute('href')]

async def crawl(page, base_url, url, depth):
    if depth > MAX_DEPTH or url in visited or len(visited) >= MAX_PAGES:
        return
    visited.add(url)
    try:
        page_issues, links = await enumerate_and_test_elements(page, url)
        if page_issues:
            issues.append({"url": url, "issues": page_issues})
        # Crawl internal links
        for link in links:
            if len(visited) >= MAX_PAGES:
                break
            full_url = urljoin(base_url, link)
            if urlparse(full_url).netloc == urlparse(base_url).netloc:
                await crawl(page, base_url, full_url, depth + 1)
    except Exception as e:
        issues.append({"url": url, "issues": [f"Page error: {e}"]})

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False)
        page = await browser.new_page()
        await crawl(page, TARGET_URL, TARGET_URL, 0)
        await browser.close()

    print("\n--- QA CHECK SUMMARY ---")
    if not issues:
        print("No issues found!")
    else:
        print("\n======= QA ISSUES REPORT =======")
        for entry in issues:
            filtered_issues = [i for i in entry['issues'] if 'translation missing' not in str(i)]
            if not filtered_issues:
                continue
            print(f"\nPage: {entry['url']}")
            for issue in filtered_issues:
                print("  --- Element ---")
                print(f"    Type         : {issue.get('type', '[unknown]')}")
                print(f"    Label        : {issue.get('label')}")
                print(f"    Functionality: {issue.get('functionality', 'Unknown')}")
                print(f"    Location     : {issue.get('location', 'unknown')}")
                print(f"    Error        : {issue.get('error')}")

if __name__ == "__main__":
    asyncio.run(main())
