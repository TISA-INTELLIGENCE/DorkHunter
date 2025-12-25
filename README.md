## Dork Hunter

![alt text](./asset/logo.png)

DorkHunter is an advanced OSINT tool designed to simplify Google dorking and web reconnaissance. It helps users perform precise searches by removing ambiguity from Google results, providing structured and clear data outputs. Built with the MERN stack (MongoDB, Express, React, Node.js), this project streamlines the process for OSINT enthusiasts, security researchers, and investigators.

## Home

Welcome to DorkHunter! This project aims to make Google dorking easier and more efficient. By leveraging predefined dorks and structured workflows, it helps uncover hidden web data like subdomains, exposed files, and more, without the noise of standard search results.

For a basic understanding of Google dorking, check out this guide: [Google Dorking Tutorial](https://www.freecodecamp.org/news/google-dorking-how-to-find-hidden-information-on-the-web/).

## Requirements

### Functional Requirements

- Allow users to input domains or URLs for reconnaissance.
- Support predefined dork categories (e.g., subdomains, exposed files, admin panels, emails).
- Perform searches using Google or similar engines via APIs (e.g., SerpAPI or Google Custom Search).
- Display results in a structured table with links, snippets, and types.
- Export results to CSV, JSON, or PDF.
- Save scan history in a database for later reference.
- Handle rate limiting and user-agent rotation for stealthy operations.

## Sections

This documentation is organized into the following sections:

- **API Reference**: Covers how APIs are used in the project to simplify the search flow.
- **High Level Design**: Details the database design, models, and high-level architecture.
- **Index.md**: The entry point of the project, explaining overall organization.
- **Requirements**: Functional and non-functional requirements (as above).

For full docs, visit the [MkDocs site](https://njoxpy.github.io/DorkHunter/docs/) (built with MkDocs using the Read the Docs theme).

## Workflow

1. **Input**: User enters a domain (e.g., example.com) and selects dork types.
2. **Processing**: Backend applies dorks (e.g., `site:example.com -www` for subdomains) via search APIs.
3. **Results**: Structured output displayed in a table, with options to export or save.
4. **History**: Scans logged in MongoDB for review.

## Problem It Solves

Google searches often return ambiguous, unstructured results, making it hard to extract actionable OSINT insights. DorkHunter solves this by:

- Applying targeted dorks automatically.
- Parsing results into clear, structured formats (tables, exports).
- Reducing manual effort and noise.

Success Metrics:

- Users get clear, structured results without ambiguity.
- Tool handles real-world recon (e.g., subdomains, emails) faster than manual dorking.
- Measured by: Ability to export verifiable reports, user feedback on ease-of-use.

## Project Structure

```
DorkHunter/
├── asset/              # Static assets like logos, images
├── client/             # React frontend (UI components, pages)
├── docs/               # MkDocs documentation files (apireference.md, highleveldesign.md, index.md, requirements.md)
├── logic/              # Business logic scripts or utilities
├── README.md           # This file
└── temp.md             # Temporary notes or drafts
```

- **client/**: Contains React app for the UI (forms, tables, dashboards).
- **docs/**: MkDocs source for detailed sections.
- Backend (server) not shown, but assumes standard MERN structure with Express routes, controllers, services, and models.

## Installation

1. Clone the repo:

   ```
   git clone https://github.com/Njoxpy/DorkHunter.git
   cd DorkHunter
   ```

2. Install dependencies:

   - Frontend: `cd client && npm install`
   - Backend (if separate): `cd server && npm install`

3. Set up environment:

   - Create `.env` with API keys (e.g., `SERPAPI_KEY=your_key`, `MONGO_URI=mongodb://...`).

4. Run development:

   - Backend: `npm run dev` (using Nodemon).
   - Frontend: `npm run start`.

5. Build docs: `mkdocs build` (requires MkDocs installed via `pip install mkdocs`).

## Usage

1. Launch the app: Visit `http://localhost:5173` (frontend).
2. Enter a domain and select dorks.
3. Click "Scan" → View results table.
4. Export or save history.

Example: Scan "njox.dev" for subdomains → Gets blog.njox.dev, projects, tags.

## API Reference

(Placeholder – Detailed in docs/apireference.md)

- **/api/scan**: POST { domain, dorks } → Returns structured results.
- Uses SerpAPI or Google CSE for searches.

## High Level Design

(Placeholder – Detailed in docs/highleveldesign.md)

- **Architecture**: MERN stack with React UI → Express API → MongoDB storage.
- **Models**: Scan (domain, dorks, results, timestamp), User (for history).
- **Flow**: Input → API call → Parse results → Store → Display.

## About

This project was created by [Njoxpy](https://github.com/Njoxpy) to simplify OSINT workflows, especially for Google dorking in reconnaissance tasks.

Contributions welcome! Fork and PR.

Built with [MkDocs](https://www.mkdocs.org/) using the [Read the Docs](https://readthedocs.org/) theme.

## License

MIT License – See [LICENSE](LICENSE) for details.
