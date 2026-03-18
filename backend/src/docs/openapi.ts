export const openApiSpec = {
    openapi: "3.0.3",
    info: {
        title: "Backend Internship Assignment API",
        version: "1.0.0",
        description: "REST API with JWT authentication, role-based access, and task CRUD",
    },
    servers: [
        {
            url: "http://localhost:4000",
            description: "Local server",
        },
    ],
    tags: [
        { name: "Health", description: "Service health" },
        { name: "Auth", description: "Authentication endpoints" },
        { name: "Users", description: "User and role management" },
        { name: "Tasks", description: "Task CRUD operations" },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
            },
        },
        schemas: {
            ErrorResponse: {
                type: "object",
                properties: {
                    success: { type: "boolean", example: false },
                    message: { type: "string", example: "Validation failed" },
                },
            },
            RegisterRequest: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                    name: { type: "string", example: "John Doe" },
                    email: { type: "string", format: "email", example: "john@example.com" },
                    password: { type: "string", example: "secret123" },
                },
            },
            LoginRequest: {
                type: "object",
                required: ["email", "password"],
                properties: {
                    email: { type: "string", format: "email", example: "john@example.com" },
                    password: { type: "string", example: "secret123" },
                },
            },
            CreateTaskRequest: {
                type: "object",
                required: ["title"],
                properties: {
                    title: { type: "string", example: "Finish assignment" },
                    description: { type: "string", example: "Complete chunk 6 docs" },
                    status: {
                        type: "string",
                        enum: ["TODO", "IN_PROGRESS", "DONE"],
                        example: "TODO",
                    },
                },
            },
            UpdateTaskRequest: {
                type: "object",
                properties: {
                    title: { type: "string", example: "Updated title" },
                    description: { type: "string", example: "Updated description" },
                    status: {
                        type: "string",
                        enum: ["TODO", "IN_PROGRESS", "DONE"],
                        example: "DONE",
                    },
                },
            },
            UpdateUserRoleRequest: {
                type: "object",
                required: ["role"],
                properties: {
                    role: {
                        type: "string",
                        enum: ["USER", "ADMIN"],
                        example: "ADMIN",
                    },
                },
            },
        },
    },
    paths: {
        "/api/v1/health": {
            get: {
                tags: ["Health"],
                summary: "Health check",
                responses: {
                    "200": {
                        description: "API is running",
                    },
                },
            },
        },
        "/api/v1/auth/register": {
            post: {
                tags: ["Auth"],
                summary: "Register a new user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/RegisterRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "User registered" },
                    "400": { description: "Validation failed" },
                    "409": { description: "Email already exists" },
                },
            },
        },
        "/api/v1/auth/login": {
            post: {
                tags: ["Auth"],
                summary: "Login user",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/LoginRequest" },
                        },
                    },
                },
                responses: {
                    "200": { description: "Login successful" },
                    "401": { description: "Invalid credentials" },
                },
            },
        },
        "/api/v1/auth/me": {
            get: {
                tags: ["Auth"],
                summary: "Get current authenticated user",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Profile fetched" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/api/v1/users": {
            get: {
                tags: ["Users"],
                summary: "List all users (admin only)",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Users fetched" },
                    "403": { description: "Forbidden" },
                },
            },
        },
        "/api/v1/users/{userId}": {
            get: {
                tags: ["Users"],
                summary: "Get user by id (self or admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "userId",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": { description: "User fetched" },
                    "403": { description: "Forbidden" },
                    "404": { description: "User not found" },
                },
            },
        },
        "/api/v1/users/{userId}/role": {
            patch: {
                tags: ["Users"],
                summary: "Update user role (admin only)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "userId",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateUserRoleRequest" },
                        },
                    },
                },
                responses: {
                    "200": { description: "Role updated" },
                    "403": { description: "Forbidden" },
                    "404": { description: "User not found" },
                },
            },
        },
        "/api/v1/tasks": {
            post: {
                tags: ["Tasks"],
                summary: "Create task",
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/CreateTaskRequest" },
                        },
                    },
                },
                responses: {
                    "201": { description: "Task created" },
                    "400": { description: "Validation failed" },
                    "401": { description: "Unauthorized" },
                },
            },
            get: {
                tags: ["Tasks"],
                summary: "List tasks (admin sees all, user sees own)",
                security: [{ bearerAuth: [] }],
                responses: {
                    "200": { description: "Tasks fetched" },
                    "401": { description: "Unauthorized" },
                },
            },
        },
        "/api/v1/tasks/{taskId}": {
            get: {
                tags: ["Tasks"],
                summary: "Get task by id (owner or admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "taskId",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": { description: "Task fetched" },
                    "403": { description: "Forbidden" },
                    "404": { description: "Task not found" },
                },
            },
            patch: {
                tags: ["Tasks"],
                summary: "Update task (owner or admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "taskId",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: { $ref: "#/components/schemas/UpdateTaskRequest" },
                        },
                    },
                },
                responses: {
                    "200": { description: "Task updated" },
                    "403": { description: "Forbidden" },
                    "404": { description: "Task not found" },
                },
            },
            delete: {
                tags: ["Tasks"],
                summary: "Delete task (owner or admin)",
                security: [{ bearerAuth: [] }],
                parameters: [
                    {
                        name: "taskId",
                        in: "path",
                        required: true,
                        schema: { type: "string" },
                    },
                ],
                responses: {
                    "200": { description: "Task deleted" },
                    "403": { description: "Forbidden" },
                    "404": { description: "Task not found" },
                },
            },
        },
    },
} as const;
