## scans

## model

```js
const mongoose = require("mongoose");

const ScanSchema = new mongoose.Schema(
  {
    query: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Query",
      required: true,
    },

    results: [
      {
        title: String,
        link: String,
        snippet: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Scan", ScanSchema);
```

# SERP API Query Endpoint

## Overview

This endpoint queries a Search Engine Results Page (SERP) API to retrieve search results based on a provided search term. It returns structured data including titles, links, snippets, and metadata for each search result.

## Query Parameters

| Parameter | Type   | Required | Description                                                       |
| --------- | ------ | -------- | ----------------------------------------------------------------- |
| `q`       | string | Yes      | The search term or query string (e.g., "facebook", "postman api") |

## Response Structure

The API returns a JSON object with the following structure:

```json
{
  "query": "string",           // Unique query identifier
  "results": [                 // Array of search results
    {
      "title": "string",       // Page title
      "link": "string",        // URL of the result
      "snippet": "string",     // Brief description/excerpt
      "_id": "string"          // Unique result identifier
    }
  ],
  "_id": "string",             // Document ID
  "createdAt": "string",       // Timestamp when query was created
  "updatedAt": "string",       // Timestamp when query was last updated
  "__v": number                // Version key
}

```

## Example Usage

**Request:**

```
GET http://localhost:4000/api/v1/scans?q=facebook

```

**Response:**

```json
{
  "query": "695157a2b0fe4b5a0befe2da",
  "results": [
    {
      "title": "Facebook - log in or sign up",
      "link": "https://www.facebook.com/",
      "snippet": "Create an account or log into Facebook...",
      "_id": "695157b83d8263e12321dc33"
    }
  ],
  "_id": "695157b83d8263e12321dc32",
  "createdAt": "2025-12-28T16:15:52.702Z",
  "updatedAt": "2025-12-28T16:15:52.702Z",
  "__v": 0
}
```

## Notes

- The `q` parameter is required for this endpoint to function
- Results are returned in an array format, typically containing multiple search results
- Each result includes metadata to help identify and track search entries

## get single scan results

# Get Scan Results

## Overview

This endpoint retrieves all scan results from the SERP API queries. It returns a comprehensive list of search results that have been collected and stored, including metadata about each scan and the associated search results.

## Request Details

**Method:** `GET`  
**Endpoint:** `http://localhost:4000/api/v1/scans/results`  
**Authentication:** None required  
**Request Body:** None

## Response Format

The endpoint returns a JSON object with the following structure:

### Success Response (200 OK)

```json
{
  "message": "Retrieved successfully",
  "data": [
    {
      "_id": "695157b83d8263e12321dc32",
      "query": "695157a2b0fe4b5a0befe2da",
      "results": [
        {
          "title": "Result Title",
          "link": "https://example.com",
          "snippet": "Description or snippet of the result...",
          "_id": "695157b83d8263e12321dc33"
        }
      ],
      "createdAt": "2025-12-28T16:15:52.702Z",
      "updatedAt": "2025-12-28T16:15:52.702Z",
      "__v": 0
    }
  ]
}
```

## Response Fields

| Field                      | Type              | Description                                                     |
| -------------------------- | ----------------- | --------------------------------------------------------------- |
| `message`                  | String            | Status message indicating the result of the operation           |
| `data`                     | Array             | Array of scan result objects                                    |
| `data[]._id`               | String            | Unique identifier for the scan result                           |
| `data[].query`             | String            | Reference ID to the original query that generated these results |
| `data[].results`           | Array             | Array of individual search results from the SERP API            |
| `data[].results[].title`   | String            | Title of the search result                                      |
| `data[].results[].link`    | String            | URL of the search result                                        |
| `data[].results[].snippet` | String            | Brief description or excerpt from the search result             |
| `data[].results[]._id`     | String            | Unique identifier for the individual search result              |
| `data[].createdAt`         | String (ISO 8601) | Timestamp when the scan was created                             |
| `data[].updatedAt`         | String (ISO 8601) | Timestamp when the scan was last updated                        |
| `data[].__v`               | Number            | Version key for the document                                    |

## Use Cases

- Retrieve all historical scan results for analysis
- Monitor and review search engine results over time
- Export data for reporting or further processing
- Verify that queries have been executed and results stored correctly

# Get Single Scan Result

## Overview

This endpoint retrieves a **specific scan result** by its unique scan ID. It returns the original query reference along with all SERP search results collected for that scan, including metadata and timestamps.

---

## Request Details

**Method:** `GET`  
**Endpoint:**

```

[http://localhost:4000/api/v1/scans/:id](http://localhost:4000/api/v1/scans/:id)

```

**Example:**

```

[http://localhost:4000/api/v1/scans/694e61c1e7446470460fb00c](http://localhost:4000/api/v1/scans/694e61c1e7446470460fb00c)

```

**Authentication:** None required
**Request Body:** None

---

## URL Parameters

| Parameter | Type   | Required | Description                               |
| --------- | ------ | -------- | ----------------------------------------- |
| `id`      | String | Yes      | Unique identifier of the scan to retrieve |

---

## Response Format

### Success Response (200 OK)

```json
{
  "message": "Retrieved successfully",
  "success": true,
  "data": {
    "_id": "694e61c1e7446470460fb00c",
    "query": "694e61c0e7446470460fb00a",
    "results": [
      {
        "title": "Godbless Njox Nyagawa - Full Stack Developer",
        "link": "https://njox.dev/",
        "snippet": "Hi, I'm Godbless Nyagawa(Njox). Full Stack Developer driven by curiosity and discipline...",
        "_id": "694e61c1e7446470460fb00d"
      }
    ],
    "createdAt": "2025-12-26T10:21:53.421Z",
    "updatedAt": "2025-12-26T10:21:53.421Z",
    "__v": 0
  }
}
```

---

## Response Fields

### Root Level

| Field     | Type    | Description                                  |
| --------- | ------- | -------------------------------------------- |
| `message` | String  | Status message of the request                |
| `success` | Boolean | Indicates whether the request was successful |
| `data`    | Object  | Scan result object                           |

### Scan Object (`data`)

| Field       | Type              | Description                        |
| ----------- | ----------------- | ---------------------------------- |
| `_id`       | String            | Unique identifier for the scan     |
| `query`     | String            | Reference ID of the original query |
| `results`   | Array             | List of SERP search results        |
| `createdAt` | String (ISO 8601) | Time the scan was created          |
| `updatedAt` | String (ISO 8601) | Time the scan was last updated     |
| `__v`       | Number            | Document version key               |

### Search Result Object (`data.results[]`)

| Field     | Type   | Description                             |
| --------- | ------ | --------------------------------------- |
| `title`   | String | Title of the search result              |
| `link`    | String | URL of the result                       |
| `snippet` | String | Short description or excerpt            |
| `_id`     | String | Unique identifier for the search result |

---

## Error Responses

### Scan Not Found (404)

```json
{
  "message": "Scan not found",
  "success": false
}
```

### Invalid ID Format (400)

```json
{
  "message": "Invalid scan ID",
  "success": false
}
```

---

## Use Cases

- Retrieve detailed results for a specific OSINT scan
- Analyze SERP data linked to a single query
- Validate stored scan data
- Display scan results in dashboards or reports

---

## Notes

- This endpoint returns **one scan only**
- Use `/api/v1/scans/results` to retrieve **all scans**
- Designed for OSINT tools like **DorkHunter**

# Delete Scan Result

## Overview

This endpoint **permanently deletes a specific scan result** using its unique scan ID.  
Upon successful deletion, the API returns the **deleted scan document**, including its query reference and all associated SERP results.

---

## Request Details

**Method:** `DELETE`  
**Endpoint:**

```

[http://localhost:4000/api/v1/scans/:id](http://localhost:4000/api/v1/scans/:id)

```

**Example:**

```
[http://localhost:4000/api/v1/scans/694e61c1e7446470460fb00c](http://localhost:4000/api/v1/scans/694e61c1e7446470460fb00c)
```

**Authentication:** None required
**Request Body:** None

---

## URL Parameters

| Parameter | Type   | Required | Description                             |
| --------- | ------ | -------- | --------------------------------------- |
| `id`      | String | Yes      | Unique identifier of the scan to delete |

---

## Response Format

### Success Response (200 OK)

```json
{
  "message": "Deleted successfully",
  "sucess": true,
  "data": {
    "_id": "694e61c1e7446470460fb00c",
    "query": "694e61c0e7446470460fb00a",
    "results": [
      {
        "title": "Godbless Njox Nyagawa - Full Stack Developer",
        "link": "https://njox.dev/",
        "snippet": "Hi, I'm Godbless Nyagawa(Njox). Full Stack Developer driven by curiosity and discipline...",
        "_id": "694e61c1e7446470460fb00d"
      }
    ],
    "createdAt": "2025-12-26T10:21:53.421Z",
    "updatedAt": "2025-12-26T10:21:53.421Z",
    "__v": 0
  }
}
```

---

## Response Fields

### Root Level

| Field     | Type    | Description                               |
| --------- | ------- | ----------------------------------------- |
| `message` | String  | Status message confirming deletion        |
| `sucess`  | Boolean | Indicates whether deletion was successful |
| `data`    | Object  | The deleted scan document                 |

> ⚠️ **Note:** The field is spelled `sucess` (not `success`) in the current response.

---

### Deleted Scan Object (`data`)

| Field       | Type              | Description                                   |
| ----------- | ----------------- | --------------------------------------------- |
| `_id`       | String            | Unique identifier of the deleted scan         |
| `query`     | String            | Reference ID of the original query            |
| `results`   | Array             | List of SERP results associated with the scan |
| `createdAt` | String (ISO 8601) | Time the scan was originally created          |
| `updatedAt` | String (ISO 8601) | Time the scan was last updated                |
| `__v`       | Number            | Document version key                          |

---

### Search Result Object (`data.results[]`)

| Field     | Type   | Description                      |
| --------- | ------ | -------------------------------- |
| `title`   | String | Title of the search result       |
| `link`    | String | URL of the result                |
| `snippet` | String | Short description or excerpt     |
| `_id`     | String | Unique identifier for the result |

---

## Error Responses

### Scan Not Found (404)

```json
{
  "message": "Scan not found",
  "success": false
}
```

### Invalid Scan ID (400)

```json
{
  "message": "Invalid scan ID",
  "success": false
}
```

---

## Use Cases

- Remove outdated or incorrect OSINT scan results
- Clean up stored SERP data
- Enforce data retention policies
- Allow users to manage their scan history

---
