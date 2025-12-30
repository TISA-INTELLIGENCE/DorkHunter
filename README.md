## Dork Hunter

![alt text](asset/logo.png)

> **An OSINT tool to simplify Google dorking** — turning ambiguous search results into clear, structured reconnaissance data.

DorkHunter is an advanced OSINT tool designed to simplify Google dorking and web reconnaissance. It helps users perform precise searches by removing ambiguity from Google results and providing structured data outputs. Built with the **MERN stack** (MongoDB, Express, React, Node.js), this project streamlines the process for OSINT enthusiasts, security researchers, and investigators.

## Features

- **Targeted Recon:** Input domains or URLs for deep reconnaissance.
- **Predefined Dorks:** Support for categories like subdomains, exposed files, admin panels, and emails.
- **API Integration:** Leverages powerful search APIs (e.g., SerpAPI or Google Custom Search).
- **Structured UI:** Results are displayed in a searchable table with direct links and snippets.
- **Data Export:** Export your findings to **CSV, JSON, or PDF**.
- **Scan History:** Automatically save scan history to MongoDB for later reference.
- **Stealth Mode:** Built-in handling for rate limiting and user-agent rotation.

## Project Structure

```text
DorkHunter/
├── asset/              # Static assets (logos, images)
├── client/             # React frontend (Vite)
├── logic/              # Backend Express API & business logic
├── docs/               # Documentation source (MkDocs)
└── LICENSE             # MIT License
```

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/Njoxpy/DorkHunter.git
cd DorkHunter
```

### 2. Setup Backend (Logic)

```bash
cd logic
npm install
# Create a .env file in the logic folder
# Add: MONGO_URI, SERPAPI_KEY, PORT
npm run dev

```

### 3. Setup Frontend (Client)

```bash
cd ../client
npm install
# Create a .env file in the client folder
# Add: VITE_API_URL=http://localhost:5000
npm run dev

```

### 4. Build Documentation (Optional)

```bash
cd ../docs
pip install -r requirements.txt
mkdocs serve

./deploy.sh
```

## Workflow

1. **Input:** User enters a domain (e.g., `example.com`) and selects specific dork types.
2. **Processing:** The backend applies advanced dork queries (e.g., `site:example.com -www`) via search APIs.
3. **Results:** Structured output is displayed in the UI with filtering capabilities.
4. **History:** Every scan is logged for future security audits.

## API Reference

Detailed documentation is available in `docs/apireference.md`.

- `POST /api/scan`: Initiates a new dorking session.

---

## About

Created by [Njoxpy](https://github.com/Njoxpy) to simplify reconnaissance tasks. Contributions are welcome! Feel free to fork the repo and submit a Pull Request.

Built with [MkDocs](https://www.mkdocs.org/) using the [Read the Docs](https://readthedocs.org/) theme.

## License

This project is licensed under the **MIT License** – see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.
