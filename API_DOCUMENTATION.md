# API Documentation

## Base URL
- Development: `http://localhost:8000`
- Production: `{APP_URL}`

## Authentication
The API uses Laravel Sanctum for authentication. Include the Sanctum token in the Authorization header.

## Endpoints

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST   | `/api/v1/login` | Authenticate user and return token | No |
| GET    | `/api/user` | Get current authenticated user | Yes |
| GET    | `/api/me` | Alias for `/api/user` | Yes |
| POST   | `/api/logout` | Logout user (invalidate token) | Yes |

### Users
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/api/v1/users` | List all users | Yes |
| POST   | `/api/v1/users` | Create a new user | Yes |
| GET    | `/api/v1/users/{id}` | Get specific user | Yes |
| PUT    | `/api/v1/users/{id}` | Update user | Yes |
| DELETE | `/api/v1/users/{id}` | Delete user | Yes |

### Clients
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET    | `/api/v1/clients` | List all clients | Yes |
| POST   | `/api/v1/clients` | Create a new client | Yes |
| GET    | `/api/v1/clients/{id}` | Get specific client | Yes |
| PUT    | `/api/v1/clients/{id}` | Update client | Yes |
| DELETE | `/api/v1/clients/{id}` | Delete client | Yes |

## Request/Response Examples

### Login
**Request:**
```json
POST /api/v1/login
{
  "email": "admin@example.com",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "sanctum_token_here",
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com"
  }
}
```

### Create Client
**Request:**
```json
POST /api/v1/clients
Content-Type: multipart/form-data

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "photo": [File]
}
```

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "photo_url": "http://localhost:8000/storage/clients/photo.jpg",
  "created_at": "2026-03-21T13:00:00.000000Z",
  "updated_at": "2026-03-21T13:00:00.000000Z"
}
```

## Error Responses
All errors follow this format:
```json
{
  "message": "Error description",
  "errors": {
    "field": ["Error message"]
  }
}
```

### Common Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Server Error

## Frontend Integration
Frontend services are located in `client/src/services/`:
- `authService.js` - Authentication endpoints
- `userService.js` - User management
- `clientService.js` - Client management

All services use the configured axios instance from `client/src/api/axios.js`.