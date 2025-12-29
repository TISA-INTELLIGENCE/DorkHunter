## Overview

This document describes the routing structure of the **DorkHunter** frontend application using **React Router DOM v6**. It includes all page routes, expected parameters, and associated API calls for each route.

## Table of Contents

1. [Home](#home)
2. [Results](#results)
3. [Scans](#scans)
4. [Scan Details](#scan-details)
5. [Queries](#queries)
6. [Query Details](#query-details)
7. [404 / NotFound](#404--notfound)

## Home

- **Path:** `/`
- **Component:** `Home.jsx`
- **Purpose:** Search page for entering queries.

### Behavior

- User submits a query  
  → `GET /api/v1/scans?q={query}`
- Navigates to `/results` with API response stored in `location.state`

### Example API Request

```http
GET http://localhost:4000/api/v1/scans?q=john%20hendricks
```

```json
{
  "query": "695209f047ba0bb310a5b7fb",
  "results": [
    {
      "title": "John Hendricks",
      "link": "https://en.wikipedia.org/wiki/John_Hendricks",
      "snippet": "...",
      "_id": "69520a07259c1c3898418d12"
    }
  ],
  "_id": "69520a07259c1c3898418d11",
  "createdAt": "2025-12-29T04:56:39.764Z"
}
```

## Results

- **Path:** `/results`
- **Component:** `Results.jsx`
- **Purpose:** Display search results returned from Home.

### Behavior

- Reads data from `useLocation().state`
- Iterates over `results`
- Renders clickable result links
- Handles missing state (page refresh) gracefully

## Scans

- **Path:** `/scans`
- **Component:** `Scans.jsx`
- **Purpose:** Display all previously executed scans.

### API Endpoint

```http
GET /api/v1/scans/results
```

### Behavior

- Fetches all scan records on mount
- Each scan card displays:

  - Query reference
  - Created date
  - Result count

- Each scan links to **Scan Details**

### Scan Details Link

```txt
/scans/:id
```

## Scan Details

- **Path:** `/scans/:id`
- **Component:** `ScanDetails.jsx`
- **Purpose:** Display full details for a single scan.

### API Endpoints

```http
GET    /api/v1/scans/:id
DELETE /api/v1/scans/:id
```

### Behavior

- Uses `useParams()` to extract `id`
- Fetches scan data by ID
- Renders all result entries
- Provides **Delete Scan** button
- On delete:

  - Redirects back to `/scans`

## Queries

- **Path:** `/queries`
- **Component:** `Queries.jsx`
- **Purpose:** List all previously submitted queries.

### API Endpoint

```http
GET /api/v1/queries
```

### Behavior

- Fetches all query records
- Displays:

  - Query text
  - Created date

- Each query links to **Query Details**

### Query Details Link

```txt
/queries/:query
```

## Query Details

- **Path:** `/queries/:query`
- **Component:** `QueryDetails.jsx`
- **Purpose:** Display details for a single query and its related scans.

### API Endpoint

```http
GET /api/v1/queries/:query
```

### Expected Behavior

- Uses `useParams()` to read query `id`
- Fetches query metadata
- Displays:

  - Original query string
  - Creation date
  - Associated scans (if populated)

- Each related scan links to:

  - `/scans/:scanId`

## 404 / NotFound

- **Path:** `*`
- **Component:** `NotFound.jsx`
- **Purpose:** Handle unknown routes.

### Behavior

- Displays **“Page Not Found”**

## Notes

- Uses **React Router DOM v6**
- Dynamic routes (`:id`) rely on `useParams()`
- API calls are made using `fetch()` inside:
