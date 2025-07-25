# Roles API Documentation

## Endpoints

### 1. Create Role

**POST** `/roles`

**Body:**

```json
{
  "name": "manager",
  "description": "Manager role with limited permissions"
}
```

**Response:**

```json
{
  "id": 1,
  "name": "manager",
  "description": "Manager role with limited permissions",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z"
}
```

### 2. Get All Roles

**GET** `/roles`

**Query Parameters:**

- `page`: number (optional) - Page number for pagination
- `limit`: number (optional) - Items per page
- `search`: string (optional) - Search in name or description
- `sortBy`: string (optional) - Field to sort by (default: created_at)
- `sortOrder`: ASC | DESC (optional) - Sort order (default: DESC)

**Response (without pagination):**

```json
[
  {
    "id": 1,
    "name": "admin",
    "description": "Administrator role",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "rolePermissions": [...],
    "userRoles": [...]
  }
]
```

**Response (with pagination):**

```json
{
  "data": [...],
  "total": 50,
  "page": 1,
  "limit": 10
}
```

### 3. Get Role by ID

**GET** `/roles/:id`

**Response:**

```json
{
  "id": 1,
  "name": "admin",
  "description": "Administrator role",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "rolePermissions": [
    {
      "id": 1,
      "permission": {
        "id": 1,
        "action": "create",
        "resource": "users",
        "scope": true
      }
    }
  ],
  "userRoles": [...]
}
```

### 4. Search Role by Name

**GET** `/roles/search?name=admin`

**Response:**

```json
{
  "id": 1,
  "name": "admin",
  "description": "Administrator role",
  ...
}
```

### 5. Get Users with Role

**GET** `/roles/:id/users`

**Response:**

```json
[
  {
    "userRoleId": 1,
    "scope": "all",
    "assignedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 6. Get Permissions for Role

**GET** `/roles/:id/permissions`

**Response:**

```json
[
  {
    "permissionId": 1,
    "action": "create",
    "resource": "users",
    "scope": true,
    "assignedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### 7. Update Role

**PATCH** `/roles/:id`

**Body:**

```json
{
  "name": "updated-manager",
  "description": "Updated description"
}
```

**Response:**

```json
{
  "id": 1,
  "name": "updated-manager",
  "description": "Updated description",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z"
}
```

### 8. Delete Role

**DELETE** `/roles/:id`

**Response:**

```json
{
  "message": "Role manager has been deleted successfully"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Role name already exists",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/roles"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Role with ID 1 not found",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/roles/1"
}
```

### 422 Unprocessable Entity

```json
{
  "statusCode": 422,
  "message": "Cannot delete role that is assigned to users",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/roles/1"
}
```
