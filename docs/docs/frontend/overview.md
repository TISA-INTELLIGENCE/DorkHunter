## Project Name

**DorkHunter** — A web application that simplifies advanced Google dork searches and tracks past scan results.

## Purpose

The frontend’s main goal is to provide an **interactive interface** for:

1. Performing Google dork searches.
2. Displaying search results with links and snippets.
3. Storing and viewing historical scans.
4. Viewing detailed scan results.

## Tech Stack

- **Frontend Framework:** React (v18+)
- **Routing:** React Router DOM (v6)
- **State Management:** React Hooks (`useState`, `useEffect`)
- **Styling:** Tailwind CSS (minimal, functional)
- **HTTP Requests:** Fetch API

## Folder Structure

```
src/
├─ components/
│  ├─ Home.jsx
│  ├─ Results.jsx
│  ├─ Scans.jsx
│  ├─ ScanDetails.jsx
│  └─ NotFound.jsx
├─ App.jsx
├─ index.jsx
├─ App.css
└─ api/
   └─ api.js (optional fetch helper)
```

## Routing Overview

| Route        | Component       | Purpose                                 |
| ------------ | --------------- | --------------------------------------- |
| `/`          | Home.jsx        | Search input page                       |
| `/results`   | Results.jsx     | Displays search results                 |
| `/scans`     | Scans.jsx       | Lists previous scans                    |
| `/scans/:id` | ScanDetails.jsx | Shows detailed results of a single scan |
| `*`          | NotFound.jsx    | 404 fallback page                       |

## Component Overview

### Home.jsx

- Handles user input for search queries.
- Sends query to API: `GET /api/v1/scans?q={query}`
- Navigates to `/results` with API response.

### Results.jsx

- Displays search results for the submitted query.
- Receives data from navigation state or props.

### Scans.jsx

- Fetches and displays a list of all scans from: `GET /api/v1/scans/results`
- Each scan includes a **link** to detailed view: `/scans/:id`

### ScanDetails.jsx

- Fetches detailed scan data by ID: `GET /api/v1/scans/:id`
- Displays results and a **delete button**: `DELETE /api/v1/scans/:id`

### NotFound.jsx

- Displayed for invalid routes.
- Shows a simple “Page Not Found” message.

## Data Flow (Summary)

1. User inputs query on **Home**.
2. API call made to `GET /api/v1/scans?q={query}`.
3. Data passed to **Results** component via `navigate(state)` or props.
4. **Scans** fetches historical scans and links to **ScanDetails**.
5. **ScanDetails** fetches full scan details and optionally deletes the scan.
