## Overview

This document explains **how data moves** through the DorkHunter frontend from user input to API responses and UI rendering.

## 1. Search Flow

```
[User Input: Home.jsx]
          |
          v
   API Request: GET /api/v1/scans?q={query}
          |
          v
   API Response: { query, results }
          |
          v
   Navigate to /results (pass data via state)
          |
          v
[Results.jsx]
  - Render list of results
  - Each result: title, snippet, link
```

**Notes:**

- `useState` manages `query` and loading state in Home.jsx
- `navigate("/results", { state: data })` passes API response
- Results.jsx reads `location.state` to render results

## 2. Scan History Flow

```
[Scans.jsx mounted]
          |
          v
   API Request: GET /api/v1/scans/results
          |
          v
   API Response: { data: [scan1, scan2, ...] }
          |
          v
   Render list of scans
          |
          v
   Each scan links to: /scans/:id
```

**Notes:**

- `useEffect` fetches scans on component mount
- `useState` stores scans, loading, and error states
- Users can click a scan to view details

## 3. Scan Details Flow

```
[ScanDetails.jsx mounted]
          |
          v
   Read ID from URL: useParams()
          |
          v
   API Request: GET /api/v1/scans/:id
          |
          v
   API Response: { _id, query, results, createdAt, updatedAt }
          |
          v
   Render scan details
          |
          v
   Optional: DELETE /api/v1/scans/:id
          |
          v
   On success: remove scan from list or navigate back
```

**Notes:**

- `useParams()` gets dynamic scan ID from URL
- Loading and error states handled via `useState`
- Delete button triggers `fetch` with `method: "DELETE"`

## 4. Error & Loading Handling

- **Loading State:** Display “Loading…” while API request is in progress
- **Error State:** Display API error or network error messages
- **Empty Results:** Display “No results found” if data is empty

## 5. Component Interaction Summary

| Component       | Action / API Call             | Next Component / Effect  |
| --------------- | ----------------------------- | ------------------------ |
| Home.jsx        | GET `/api/v1/scans?q={query}` | Navigate to `/results`   |
| Results.jsx     | None (receives state)         | Display results          |
| Scans.jsx       | GET `/api/v1/scans/results`   | Display scans list       |
| ScanDetails.jsx | GET `/api/v1/scans/:id`       | Display scan details     |
| ScanDetails.jsx | DELETE `/api/v1/scans/:id`    | Update scans or navigate |
