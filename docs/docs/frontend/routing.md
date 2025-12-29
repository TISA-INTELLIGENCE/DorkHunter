## Overview

This document describes the routing structure of the **DorkHunter** frontend application using **React Router DOM**. It includes all page routes, the expected parameters, and associated API calls for each route.

## Table of Contents

1. [Home](#home)
2. [Results](#results)
3. [Scans](#scans)
4. [Scan Details](#scan-details)
5. [404 / NotFound](#404--notfound)

## Home

- **Path:** `/`
- **Component:** `Home.jsx`
- **Purpose:** Search page for entering queries.
- **Behavior:**

  - User submits a query → `GET /api/v1/scans?q={query}`
  - Navigates to `/results` page with the API response stored in `state`.

**Example API Request:**

```http
GET http://localhost:4000/api/v1/scans?q=john%20hendricks
```

**Response Structure:**

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
- **Purpose:** Display search results from the API.
- **Behavior:**

  - Receives `state` from navigation (from Home).
  - Iterates through `results` and renders clickable links.

## Scans

- **Path:** `/scans`
- **Component:** `Scans.jsx`
- **Purpose:** List all previous scans.
- **API Endpoint:** `GET /api/v1/scans/results`
- **Behavior:**

  - Fetches all scan records.
  - Each scan card shows creation date and summary of results.
  - Each scan includes a **link to Scan Details**: `/scans/:id`

**Example API Request:**

```http
GET http://localhost:4000/api/v1/scans/results
```

**Response Structure:**

```json
{
  "data": [
    {
      "_id": "6952083747ba0bb310a5b789",
      "query": "6952083347ba0bb310a5b787",
      "results": [ ... ],
      "createdAt": "2025-12-29T04:48:55.887Z"
    }
  ]
}
```

## Scan Details

- **Path:** `/scans/:id`
- **Component:** `ScanDetails.jsx`
- **Purpose:** Display detailed results for a single scan.
- **API Endpoint:** `GET /api/v1/scans/:id`
- **Behavior:**

  - Fetches scan data by `id`.
  - Displays full results.
  - Provides **Delete Scan** button calling:

    - `DELETE /api/v1/scans/:id`

**Example API Request:**

```http
GET http://localhost:4000/api/v1/scans/6952083747ba0bb310a5b789
```

**Delete API Request:**

```http
DELETE http://localhost:4000/api/v1/scans/6952083747ba0bb310a5b789
```

## 404 / NotFound

- **Path:** `*`
- **Component:** `NotFound.jsx`
- **Purpose:** Fallback route for unknown paths.
- **Behavior:** Displays “Page Not Found” message.

## Notes

- All frontend navigation is handled using **React Router DOM v6**.
- Routes using `:id` are **dynamic** and require `useParams()` to read the value.
- API calls are made from frontend using `fetch()` in `useEffect` or event handlers.
- Errors should be handled gracefully and displayed to the user.
