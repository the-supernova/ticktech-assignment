# TickTech Assignment

## Instructions for running the code

### 1. Clone the repository

```
git clone <REPO_URL>
```

### 2. Install the dependencies

```
npm install
```

As this API uses Redis, make sure you have Redis installed and running on your machine.
You can follow the instructions [here](https://redis.io/docs/getting-started/) to install Redis and run `redis-server` to start the server.

### 3. Run the server

For production:

```
npm run start:prod
```

For development:

```
npm run start:dev
```

For running multiple instances:

```
npm run start:multi
```

Now you can access the API at `http://localhost:4000`

### 4. Run the tests

```
npm run test
```

## API Documentation

### 1. Create a new user

```
POST /api/users
```

#### Request Body

```
{
    "username": "John Doe",
    "age": 17,
    "hobbies: ["Reading", "Coding"]
}
```

#### Response

```
Status: 201 Created
{
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "username": "John Doe",
    "age": 17,
    "hobbies: ["Reading", "Coding"]
}
```

### 2. Get a user by id

```
GET /users/:id
```

#### Response

```
Status: 200 OK
{
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "username": "John Doe",
    "age": 17,
    "hobbies: ["Reading", "Coding"]
}
```

### 3. Update a user by id

```
PUT /users/:id
```

#### Request Body

```
{
    "username": "John Doe",
    "age": 17,
    "hobbies: ["Reading", "Writing"]
}
```

#### Response

```
Status: 200 OK
{
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "username": "John Doe",
    "age": 17,
    "hobbies: ["Reading", "Writing"]
}
```

### 4. Delete a user by id

```
DELETE /users/:id
```

#### Response

```
Status: 204 No Content
```

### 5. Get all users

```
GET /users
```

#### Response

```
Status: 200 OK
[
    {
        "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
        "username": "John Doe",
        "age": 17,
        "hobbies: ["Reading", "Writing"]
    },
    {
        "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6e",
        "username": "Jane Doe",
        "age": 18,
        "hobbies: ["Dancing", "Coding"]
    }
]
```

