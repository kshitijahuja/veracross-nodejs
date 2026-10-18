
# Veracross Data API v3 — Node.js

Node.js library to make API calls to the v3 of the Veracross API.


## Getting Started

As a first step, ensure that you create an OAuth app in Veracross. Read more here:
https://api-docs.veracross.com/docs/docs/ZG9jOjMzNzcxODA-general-principles

You will then be able to access credentials like `client_id` and `client_secret` that are used to make API calls.


## Setup

1. Clone the repository.
2. Install dependencies:
   ```
   npm install
   ```
3. Copy `.env.sample` to `.env` and fill in your credentials:
   ```
   CLIENT_ID=your_client_id_here
   CLIENT_SECRET=your_client_secret_here
   SCHOOL_ROUTE=your_school_route_here
   ```


## Usage

Require the library and create a client using your credentials from `.env`:

```js
require('dotenv').config();
const Client = require('./veracross');

const vc = new Client(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.SCHOOL_ROUTE
);
```

### Methods

| Method | Description | Expected Response |
|---|---|---|
| `vc.list(scope, path, params)` | Fetch all records (paginated) | Array of records |
| `vc.read(scope, path)` | Fetch a single record by ID | Single record object |
| `vc.create(scope, path, payload)` | Create a new record | `201` |
| `vc.update(scope, path, payload)` | Update an existing record | `204` |
| `vc.delete(scope, path)` | Delete a record | `204` |

All methods are `async` and should be called with `await`.


## Examples

Five example files are included — one per call type:

- `example-list.js` — list records (with optional params)
- `example-read.js` — read a single record by ID
- `example-create.js` — create a new record
- `example-update.js` — update an existing record
- `example-delete.js` — delete a record

Run any example with:
```
node example-list.js
```


## Notes

- Scopes must match the operation (e.g. `students:list`, `students:read`). Ensure the OAuth app in Veracross has been granted the required scopes.
- Pagination is handled automatically in `list` calls (1000 records per page).
- Rate limiting is handled automatically — the client will sleep when the rate limit is nearly reached.


If you have any questions, reach out at help@academicdatasolutions.com or via https://academicdatasolutions.com

Disclaimer: This library is provided for demo purposes and is only intended to help get started with your projects. We are not responsible for any errors or omissions, or for the results obtained from the use of this information. All information is provided "as is", with no guarantees whatsoever.
