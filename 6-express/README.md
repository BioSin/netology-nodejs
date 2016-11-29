### RPC calls

*User list* `{ "jsonrpc": "2.0", "method": "all", "id": 1 }`

*Find user by ID* `{ "jsonrpc": "2.0", "method": "get", "params": { "id": 2 }, "id": 1 }`

*Create new user* `{ "jsonrpc": "2.0", "method": "post", "params": { "name": "New name", "score": 100 }, "id": 1 }`

*Update user* `{ "jsonrpc": "2.0", "method": "put", "params": { "id": 3, "name": "New name", "score": 101 }, "id": 1 }`

*Delete user* `{ "jsonrpc": "2.0", "method": "delete", "params": { "id": 3 }, "id": 1 }`
