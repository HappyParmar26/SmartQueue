# SmartQueue Backend API Guide

This document is the frontend integration guide for the SmartQueue backend.

## Base Setup

- API base path: `/api/v1`
- Server entry: `server.js`
- Express app: `src/app.js`
- Auth is cookie-based. The backend sets an `httpOnly` cookie named `token` on login/register.
- For browser requests, the frontend must send credentials so the cookie is included.

## Authentication

### User Roles

- `user` for citizens
- `admin` for office staff and administrators

### Standard Auth Flow

1. Register or log in.
2. Backend sets the `token` cookie.
3. Send later requests with credentials enabled.
4. `auth.middleware` reads the cookie and attaches `req.user`.

### Common Response Shape

Most endpoints return one of these patterns:

```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

or

```json
{
  "success": true,
  "count": 3,
  "data": []
}
```

Errors usually return:

```json
{
  "success": false,
  "message": "..."
}
```

## Citizen APIs

### Auth

| Method | Route | Access | Notes |
| --- | --- | --- | --- |
| POST | `/api/v1/citizen/auth/register` | Public | Creates a user and sets auth cookie |
| POST | `/api/v1/citizen/auth/login` | Public | Login with email or phone plus password |
| GET | `/api/v1/citizen/auth/logout` | Public | Clears the auth cookie |

#### Register Body

Required:

- `name`
- `phone`
- `email`
- `password`

Optional:

- `role`
- `office_id`
- `dob`
- `gender`
- `aadhaar_last4`
- `priority`
- `preferences`

#### Login Body

Required:

- `email`
- `phone`
- `password`

### Offices

| Method | Route | Access | Notes |
| --- | --- | --- | --- |
| POST | `/api/v1/citizen/offices/create` | Internal use | Seeds an office in the database |
| GET | `/api/v1/citizen/offices/` | Public | List all offices |
| GET | `/api/v1/citizen/offices/:id` | Public | Get one office |
| GET | `/api/v1/citizen/offices/:id/slots` | Public | Get slots for one office |

### Prediction

| Method | Route | Access | Notes |
| --- | --- | --- | --- |
| POST | `/api/v1/citizen/predict/hour` | Public | Predict hourly wait time |
| GET | `/api/v1/citizen/predict/day` | Public | Predict daily wait time |
| GET | `/api/v1/citizen/predict/week` | Public | Predict weekly wait time |

Required body fields used by the controller:

- `office_id`
- `department`
- `datetime`

Response includes `predicted_wait_time` when successful.

Note: the current backend implementation reads these values from the request body even on the GET routes. If you integrate these endpoints from the frontend before the backend is normalized, coordinate with the backend team so the request shape matches the deployed behavior.

### Tokens

| Method | Route | Access | Notes |
| --- | --- | --- | --- |
| POST | `/api/v1/citizen/tokens/book` | Authenticated user | Book a token |
| POST | `/api/v1/citizen/tokens/` | Authenticated user | Same handler as booking |
| GET | `/api/v1/citizen/tokens/` | Authenticated user | List current citizen tokens |
| GET | `/api/v1/citizen/tokens/my-tokens` | Authenticated user | Alias of list endpoint |
| GET | `/api/v1/citizen/tokens/:id` | Authenticated user | Get one token by id |
| GET | `/api/v1/citizen/tokens/:id/live` | Authenticated user | Get live queue state for a token |
| DELETE | `/api/v1/citizen/tokens/:id` | Authenticated user | Cancel a token |
| POST | `/api/v1/citizen/tokens/:id/cancel` | Authenticated user | Cancel a token |

#### Book Token Body

Required:

- `office_id`
- `service_id`
- `service_name`
- `slot_id`
- `date`
- `hour`
- `slot_time`

Optional:

- `is_priority`
- `is_walkin`
- `priority_reason`
- `counter_id`
- `counter_number`

#### Token Response Notes

- `GET /my-tokens` returns `{ success, count, data }`.
- Live state returns the token plus an `office_snapshot` and `live` object.

## Admin APIs

Admin routes require a valid auth cookie and `role: admin`.

### Departments

| Method | Route | Access | Notes |
| --- | --- | --- | --- |
| POST | `/api/v1/admin/departments/` | Admin | Create a department |

Required body:

- `office_id`
- `department_name`

Optional:

- `description`
- `is_active`

### Counters

| Method | Route | Access | Notes |
| --- | --- | --- | --- |
| POST | `/api/v1/admin/counters/create` | Admin | Create a counter |
| GET | `/api/v1/admin/counters/` | Admin | List counters for the admin office |
| PATCH | `/api/v1/admin/counters/:id` | Admin | Update a counter |

Required body for create:

- `office_id`
- `counter_number`
- `counter_name`
- `service_id`
- `staff_id`

### Queue Management

All routes below are under `/api/v1/admin` and are admin-only.

| Method | Route | Notes |
| --- | --- | --- |
| GET | `/dashboard` | Dashboard totals plus live snapshot |
| GET | `/queue` | Full live queue snapshot |
| POST | `/queue/call-next` | Calls the next eligible token |
| POST | `/tokens/walkin` | Creates a walk-in token |
| PATCH | `/queue/:id/skip` | Skips a token temporarily |
| PATCH | `/queue/:id/serve` | Marks a token served |
| PATCH | `/queue/:id/transfer` | Moves a token to another queue |
| GET | `/counters` | List counters for the admin office |
| PATCH | `/counters/:id` | Update a counter |
| GET | `/analytics` | Daily queue metrics |
| GET | `/ai-insights` | Simple AI-style queue recommendation |
| GET | `/slots` | List slots for the admin office |
| PATCH | `/slots/:id` | Update a slot |

#### Admin Query / Body Notes

- `office_id` is required for most admin reads.
- `date` is optional; if omitted, the backend uses the current local date.
- `service_id` is optional on queue reads and actions.
- `counter_id` or `counter_number` can be supplied when calling the next token or creating walk-ins.

## Public APIs

| Method | Route | Access | Notes |
| --- | --- | --- | --- |
| GET | `/api/v1/public/display/:office_id` | Public | Public waiting-room display snapshot |
| GET | `/api/v1/public/offices/:office_id/live` | Public | Office live queue snapshot |

Query params:

- `service_id` optional
- `date` optional

## Internal APIs

These are for backend services and ML sync jobs, not for normal frontend usage.

| Method | Route | Access | Notes |
| --- | --- | --- | --- |
| POST | `/api/v1/internal/slots/generate` | Internal | Generate office slots for a date |
| POST | `/api/v1/internal/observations/sync` | Internal | Sync observation records to the DB |

## Live Queue Snapshot

The queue snapshot returned by `/admin/queue`, `/admin/dashboard`, and public live endpoints contains:

- `office_id`
- `date`
- `summary` with counts for waiting, called, serving, priority, and offline
- `counters`
- `waiting_tokens`
- `called_tokens`
- `serving_tokens`
- `all_tokens`

Each token includes a `live` object with:

- `live_position`
- `tokens_ahead`
- `queue_score`

and an `estimated_wait_minutes` field.

## Socket Events

The backend uses Socket.IO.

### Joining Rooms

- Connect with `officeId` or `tokenId` in the handshake query, or emit `join`, `join:office`, or `join:token`.
- Offices join room `office:<officeId>`.
- Tokens join room `token:<tokenId>`.

### Emitted Events

| Event | Room | When |
| --- | --- | --- |
| `queue:updated` | `office:<officeId>` | Queue state changes |
| `token:updated` | `token:<tokenId>` | A token changes |
| `counter:updated` | `office:<officeId>` | Counter state changes |
| `public:display:updated` | `office:<officeId>` | Public display refresh |

## Frontend Notes

- Use `withCredentials: true` in axios or fetch equivalent.
- After login, do not expect the token in JSON; it is stored in an `httpOnly` cookie.
- Most admin endpoints infer `office_id` from the logged-in user, but several still accept it in the body or query string.
- For live screens, prefer the socket events over polling where possible.

## Environment Variables

The backend expects these environment variables:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `PREDICTION_SERVICE_URL`
- `NODE_ENV`

## Quick Example

### Login

```http
POST /api/v1/citizen/auth/login
Content-Type: application/json

{
  "email": "citizen@example.com",
  "phone": "9999999999",
  "password": "secret123"
}
```

### Book Token

```http
POST /api/v1/citizen/tokens/book
Content-Type: application/json

{
  "office_id": "66f0c2b7f9d1f1a1f1234567",
  "service_id": "66f0c2b7f9d1f1a1f2345678",
  "service_name": "Passport Verification",
  "slot_id": "66f0c2b7f9d1f1a1f3456789",
  "date": "2026-06-11",
  "hour": 10,
  "slot_time": "10:00",
  "is_priority": false,
  "is_walkin": false
}
```

### Get Live Office Queue

```http
GET /api/v1/public/offices/66f0c2b7f9d1f1a1f1234567/live?date=2026-06-11
```
