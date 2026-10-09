# API Reference

Base URL: `http://localhost:3000` (development)

## Health

### `GET /api/health`

Returns service status.

**Response:**
```json
{ "status": "ok", "timestamp": "2024-01-15T12:00:00.000Z" }
```

---

## Chat

### `POST /api/chat`

Send a message to the AI assistant. Returns SSE stream.

**Request:**
```json
{
  "messages": [
    { "role": "user", "content": "What is the balance of GBX...?" }
  ]
}
```

**Response (SSE stream):**
```
data: {"type":"text","content":"Looking up account..."}
data: {"type":"tool_call","name":"get_account_summary"}
data: {"type":"text","content":"The account holds 100 XLM..."}
data: {"type":"done"}
```

---

## Accounts

### `GET /api/accounts/:id`

Get Stellar account details and balances.

**Parameters:**
- `id` (path) — Stellar account address (G..., 56 chars)

**Response:**
```json
{
  "accountId": "GBX...",
  "balances": [
    { "assetType": "native", "balance": "100.0000000" }
  ],
  "sequence": "12345",
  "subentryCount": 2,
  "homeDomain": "example.com"
}
```

**Errors:**
- `400` — Invalid address
- `404` — Account not found
- `502` — Horizon API error

### `GET /api/accounts/:id/transactions`

Get transaction history for an account.

**Parameters:**
- `id` (path) — Stellar account address
- `limit` (query, optional) — Number of transactions (1-200, default 10)
- `order` (query, optional) — `asc` or `desc` (default `desc`)
- `cursor` (query, optional) — Pagination cursor

**Response:**
```json
{
  "records": [
    {
      "hash": "abc123...",
      "ledger": 100,
      "createdAt": "2024-01-15T12:00:00Z",
      "sourceAccount": "GBX...",
      "successful": true,
      "explorerUrl": "https://stellar.expert/explorer/public/tx/abc123..."
    }
  ],
  "nextCursor": "cursor_token"
}
```

---

## Watchlists

### `GET /api/watchlists`

List authenticated user's watchlists. Requires auth.

### `POST /api/watchlists`

Create a new watchlist. Requires auth.

**Request:**
```json
{
  "name": "My Watchlist",
  "description": "Monitoring these accounts"
}
```

### `GET /api/watchlists/:id`

Get watchlist with items. Requires auth.

### `PATCH /api/watchlists/:id`

Update watchlist. Requires auth.

**Request:**
```json
{
  "name": "Updated Name",
  "description": "Updated description",
  "is_public": true
}
```

### `DELETE /api/watchlists/:id`

Delete watchlist. Requires auth.

### `POST /api/watchlists/:id/items`

Add item to watchlist. Requires auth.

**Request:**
```json
{
  "item_type": "account",
  "target": "GBX...",
  "label": "My account"
}
```

### `DELETE /api/watchlists/:id/items?itemId=:itemId`

Remove item from watchlist. Requires auth.

---

## Auth

### `POST /api/auth/login`

Send magic link email for authentication.

**Request:**
```json
{ "email": "user@example.com" }
```

### `GET /api/auth/user`

Get current authenticated user.

**Response:**
```json
{ "user": { "id": "uuid", "email": "user@example.com" } }
```