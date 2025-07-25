# User Roles API Documentation (Basic CRUD)

## Endpoints

### 1. Create User Role Assignment

**POST** `/user-roles`

**Body:**

```json
{
  "userId": 1,
  "roleId": 2,
  "scope": "all"
}
```

**Response:**

```json
{
  "id": 1,
  "scope": "all",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "role": {
    "id": 2,
    "name": "manager",
    "description": "Manager role"
  }
}
```

### 2. Get All User Role Assignments

**GET** `/user-roles`

**Response:**

```json
[
  {
    "id": 1,
    "scope": "all",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z",
    "user": {
      "id": 1,
      "email": "user@example.com"
    },
    "role": {
      "id": 2,
      "name": "manager",
      "description": "Manager role"
    }
  }
]
```

### 3. Get User Role Assignment by ID

**GET** `/user-roles/:id`

**Response:**

```json
{
  "id": 1,
  "scope": "all",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T00:00:00.000Z",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "role": {
    "id": 2,
    "name": "manager",
    "description": "Manager role"
  }
}
```

### 4. Update User Role Assignment

**PATCH** `/user-roles/:id`

**Body:**

```json
{
  "scope": "limited"
}
```

**Response:**

```json
{
  "id": 1,
  "scope": "limited",
  "created_at": "2024-01-01T00:00:00.000Z",
  "updated_at": "2024-01-01T12:00:00.000Z",
  "user": {
    "id": 1,
    "email": "user@example.com"
  },
  "role": {
    "id": 2,
    "name": "manager",
    "description": "Manager role"
  }
}
```

### 5. Delete User Role Assignment

**DELETE** `/user-roles/:id`

**Response:**

```json
{
  "message": "UserRole assignment has been removed successfully"
}
```

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "User already has this role assigned",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/user-roles"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "User with ID 1 not found",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/user-roles"
}
```
