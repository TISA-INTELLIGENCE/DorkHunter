## Overview

This document explains **how data moves** through the DorkHunter frontend from user input to API responses and UI rendering.  
It covers **Search**, **Scans**, and **Queries** data flows.

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

Notes:

- `useState` manages `query`, `loading`, and `error` in `Home.jsx`
- `navigate("/results", { state: data })` passes API response
- `Results.jsx` reads data via `useLocation().state`
- Page refresh on `/results` should be handled (redirect or refetch)

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

Notes:

- `useEffect` fetches scans on component mount
- `useState` stores `scans`, `loading`, and `error`
- Each scan card shows date, query reference, and result count

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
API Response: { \_id, query, results, createdAt }
|
v
Render scan details
|
v
Optional user action: Delete scan
|
v
API Request: DELETE /api/v1/scans/:id
|
v
Navigate back to /scans

```

Notes:

- `useParams()` extracts the scan ID
- Full results are rendered on this page
- Delete action should confirm intent before execution

## 4. Queries List Flow

```

[Queries.jsx mounted]
|
v
API Request: GET /api/v1/queries
|
v
API Response: { data: [query1, query2, ...] }
|
v
Render list of queries
|
v
Each query links to: /queries/:id

```

Notes:

- Queries represent **search terms**, not results
- Each query item displays:
  - Query string
  - Created date
- Queries are navigational entry points to related scans

## 5. Query Details Flow

```

[QueryDetails.jsx mounted]
|
v
Read ID from URL: useParams()
|
v
API Request: GET /api/v1/queries/:id
|
v
API Response:
{
\_id,
query,
createdAt,
scans: [scan1, scan2, ...]
}
|
v
Render query details
|
v
Each scan links to: /scans/:scanId

```

Notes:

- Query Details act as a **bridge** between queries and scans
- Scans may be populated or fetched separately
- Allows users to explore historical scans per query

## 6. Error & Loading Handling

- Loading state
  Display “Loading…” while API requests are pending

- Error state
  Display API or network error messages

- Empty state
  Display “No results found” when arrays are empty

## 7. Component Interaction Summary

| Component        | API Call                      | Resulting Action              |
| ---------------- | ----------------------------- | ----------------------------- |
| Home.jsx         | GET `/api/v1/scans?q={query}` | Navigate to `/results`        |
| Results.jsx      | None (uses state)             | Display search results        |
| Scans.jsx        | GET `/api/v1/scans/results`   | Display scans list            |
| ScanDetails.jsx  | GET `/api/v1/scans/:id`       | Display scan details          |
| ScanDetails.jsx  | DELETE `/api/v1/scans/:id`    | Navigate to `/scans`          |
| Queries.jsx      | GET `/api/v1/queries`         | Display queries list          |
| QueryDetails.jsx | GET `/api/v1/queries/:id`     | Display query + related scans |
