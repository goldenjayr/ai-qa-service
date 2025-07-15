# AI QA Service Dashboard

A modern dashboard for monitoring application quality, service health, and user experience flows, built with **React**, **TypeScript**, and **Vite**.

---

## Overview

This application provides a holistic view of your application's backend services and user experience (UX) flows. It is designed for engineering and product teams to:

- Monitor service health, uptime, latency, and error rates
- Investigate incidents with root cause analysis and historical trends
- Review AI-generated summaries and recommendations for each service
- Track UX funnel performance, conversion rates, and friction points
- Access operational and security reports

> **Note:** The app uses mock data for all dashboards and details, making it ideal for demos, prototyping, and front-end development.

---

## Features

- **Dashboard:** At-a-glance health for core services and UX flows
- **Service List & Detail:** Deep dive into each service's health, history, and AI analysis
- **UX Flows:** Visualize conversion funnels, drop-offs, and friction points
- **Reports:** Browse and review operational, security, and performance reports
- **AI Insights:** Summaries and recommendations powered by mock AI analysis
- **Developer Friendly:** Built with React, TypeScript, Vite, and TailwindCSS for rapid iteration

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- [uv](https://github.com/astral-sh/uv) (ultra-fast Python package manager and runner)

### Installation

```bash
npm install
```

### Setting up `uv`

Install `uv` globally (recommended):

```bash
curl -Ls https://astral.sh/uv/install.sh | bash
```

Or see the [official uv installation guide](https://github.com/astral-sh/uv#installation) for other methods.

---

## Running Python Audits with `uv`

This project uses `uv` to run the Python audit script (`daily_web_audit.py`) for maximum speed and reproducibility.

- **To run the audit script manually:**

  ```bash
  uv run daily_web_audit.py
  ```

- **To set up the daily PM2 job (recommended):**

  ```bash
  npm run setup:pm2-audit
  ```

  This will schedule the script to run daily using PM2 and `uv`.

- **To adjust the schedule:**

  Edit the cron expression in `setup-pm2-daily-web-audit.sh` or re-run the setup script.

---


### Setting up uv

Install uv globally (recommended):
```bash
curl -Ls https://astral.sh/uv/install.sh | bash
```
Or see the [official uv installation guide](https://github.com/astral-sh/uv#installation) for other methods.

### Running Python Audits with uv

This project uses `uv` to run the Python audit script (`daily_web_audit.py`) for maximum speed and reproducibility.

- To run the audit script manually:
  ```bash
  uv run daily_web_audit.py
  ```

- To set up the daily PM2 job (recommended):
  ```bash
  npm run setup:pm2-audit
  ```
  This will schedule the script to run daily using PM2 and uv.

- To adjust the schedule, edit the cron expression in `setup-pm2-daily-web-audit.sh` or re-run the setup script.

### Running Locally
```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Project Structure
- `src/components/` — React UI components
- `src/data/mockData.ts` — All mock data for services, reports, and UX flows
- `src/types/types.ts` — Shared TypeScript types
- `src/App.tsx` — Main app logic and routing

## Developer Notes
- All type imports use `import type` with explicit `.ts` extensions for Vite compatibility.
- Mock data is formatted for readability and easy editing.
- No backend or real API integration; all data is static and local.
- For production use, replace mock data and expand types as needed.

## License
MIT (or specify your license here)

---
*Last updated: July 4, 2025*
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
