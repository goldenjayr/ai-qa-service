import requests
import datetime
import os

QA_SERVICE_URL = os.environ.get("QA_SERVICE_URL", "http://localhost:3000")
API_URL = f"{QA_SERVICE_URL}/api/issues"
print(API_URL)

def test_save_issue_via_api():
    data = {
        'flowName': 'Test Flow',
        'element': 'button',
        'pageUrl': 'https://example.com',
        'domSelector': '#test-button',
        'action': 'click',
        'expected': 'Button should submit form',
        'actual': 'Form submitted',
        'error': None,
        'consoleNetworkErrors': None,
        'screenshot': None,
        'severity': 'low',
        'timestamp': datetime.datetime.now().isoformat(),
        'stepsToReproduce': '["Go to page", "Click button"]',
    }
    response = requests.post(API_URL, json=data)
    print('Status code:', response.status_code)
    print('Response:', response.json())

if __name__ == "__main__":
    test_save_issue_via_api()
