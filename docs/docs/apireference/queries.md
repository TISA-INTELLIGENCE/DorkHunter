## API Reference for Queries

- This docs contains the quick overview about queries.

## Model

```js
const mongoose = require("mongoose");
const QuerySchema = new mongoose.Schema(
  {
    query: {
      type: String,
      required: true,
      index: true,
    },

    engine: {
      type: String,
      default: "google",
    },

    location: String,
  },
  {
    timestamps: true,
  }
);

const Query = mongoose.model("Query", QuerySchema);
module.exports = Query;
```

# Get All Queries

## Overview

This endpoint retrieves all queries stored in the system. It returns a list of query objects with their associated metadata including the search query text, search engine used, and timestamps.

## Request Details

- **Method:** `GET`
- **Endpoint:** `http://localhost:4000/api/v1/queries/`
- **Authentication:** Not specified
- **Request Body:** None required

## Response Format

### Success Response (200 OK)

The API returns a JSON object with the following structure:

```json
{
  "message": "string",
  "data": [array of query objects],
  "success": "boolean"
}

```

### Response Fields

| Field     | Type    | Description                                             |
| --------- | ------- | ------------------------------------------------------- |
| `message` | string  | Status message indicating the result of the operation   |
| `data`    | array   | Array of query objects                                  |
| `success` | boolean | Success flag indicating if the operation was successful |

### Query Object Structure

Each query object in the `data` array contains:

| Field       | Type              | Description                               |
| ----------- | ----------------- | ----------------------------------------- |
| `_id`       | string            | Unique identifier for the query           |
| `query`     | string            | The actual search query text              |
| `engine`    | string            | Search engine used (e.g., "google")       |
| `createdAt` | string (ISO 8601) | Timestamp when the query was created      |
| `updatedAt` | string (ISO 8601) | Timestamp when the query was last updated |
| `__v`       | number            | Version key (MongoDB internal field)      |

## Example Response

```json
{
  "message": "Retrieved successfully",
  "data": [
    {
      "_id": "69501e43b8f9458806e6dc86",
      "query": "site:njox.dev -www",
      "engine": "google",
      "createdAt": "2025-12-27T17:58:27.954Z",
      "updatedAt": "2025-12-27T17:58:27.954Z",
      "__v": 0
    },
    {
      "_id": "69501d27fa1454d5867a2b5e",
      "query": "mdudu",
      "engine": "google",
      "createdAt": "2025-12-27T17:53:43.468Z",
      "updatedAt": "2025-12-27T17:53:43.468Z",
      "__v": 0
    },
    {
      "_id": "69500d4004418250e341b949",
      "query": "godbless nyagawa",
      "engine": "google",
      "createdAt": "2025-12-27T16:45:52.151Z",
      "updatedAt": "2025-12-27T16:45:52.151Z",
      "__v": 0
    }
  ],
  "success": true
}
```

## Notes

- The response returns all queries in the system without pagination
- Queries are ordered by their creation time (most recent first in the example)
- The `success` field appears to have a typo in the API response (should be "success")

# Get Single Query

Retrieves a single query record by its unique identifier from the queries database.

## Request Details

- **Method:** `GET`
- **Endpoint:** `/api/v1/queries/{queryId}`
- **Base URL:** `http://localhost:4000`

## Path Parameters

| Parameter | Type   | Required | Description                                                    |
| --------- | ------ | -------- | -------------------------------------------------------------- |
| `queryId` | string | Yes      | The unique identifier of the query to retrieve (e.g., "mdudu") |

## Response Format

### Success Response (200 OK)

```json
{
  "message": "Retrieved successfully",
  "data": {
    "_id": "69501d27fa1454d5867a2b5e",
    "query": "mdudu",
    "engine": "google",
    "createdAt": "2025-12-27T17:53:43.468Z",
    "updatedAt": "2025-12-27T17:53:43.468Z",
    "__v": 0
  },
  "success": true
}
```

### Response Fields

| Field            | Type              | Description                                    |
| ---------------- | ----------------- | ---------------------------------------------- |
| `message`        | string            | Status message indicating successful retrieval |
| `data`           | object            | The query object containing all query details  |
| `data._id`       | string            | MongoDB ObjectId of the query record           |
| `data.query`     | string            | The query identifier/name                      |
| `data.engine`    | string            | Search engine used (e.g., "google")            |
| `data.createdAt` | string (ISO 8601) | Timestamp when the query was created           |
| `data.updatedAt` | string (ISO 8601) | Timestamp when the query was last updated      |
| `data.__v`       | number            | Version key (MongoDB internal)                 |
| `success`        | boolean           | Indicates if the operation was successful      |

## Notes

- This endpoint retrieves query records that have been previously stored in the system
- The `queryId` in the URL path should match the `query` field in the stored record
- Returns a 200 status code on successful retrieval

# Delete Query

This endpoint deletes a specific query from the system based on the query string provided in the request body.

## Request Details

**Method:** `DELETE`  
**Endpoint:** `http://localhost:4000/api/v1/queries/`  
**Content-Type:** `application/json`

## Request Body

The request requires a JSON body with the following parameter:

| Parameter | Type   | Required | Description                    |
| --------- | ------ | -------- | ------------------------------ |
| `query`   | string | Yes      | The query string to be deleted |

### Example Request Body

```json
{
  "query": "njox"
}
```

## Response

### Success Response (200 OK)

Returns a success message along with the deleted query object.

#### Response Fields

| Field     | Type    | Description                                |
| --------- | ------- | ------------------------------------------ |
| `message` | string  | Status message indicating operation result |
| `data`    | object  | The deleted query object                   |
| `success` | boolean | Success flag (note: typo in API response)  |

#### Query Object Fields

| Field       | Type   | Description                          |
| ----------- | ------ | ------------------------------------ |
| `_id`       | string | Unique identifier for the query      |
| `query`     | string | The search query string              |
| `engine`    | string | Search engine used (e.g., "google")  |
| `createdAt` | string | ISO 8601 timestamp of query creation |
| `updatedAt` | string | ISO 8601 timestamp of last update    |
| `__v`       | number | Version key (MongoDB internal field) |

### Example Response

```json
{
  "message": "Deleted successfully",
  "success": true,
  "data": {
    "_id": "694e61c0e7446470460fb00a",
    "query": "njox",
    "engine": "google",
    "createdAt": "2025-12-26T10:21:52.538Z",
    "updatedAt": "2025-12-26T10:21:52.538Z",
    "__v": 0
  }
}
```
