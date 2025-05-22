# Express.js API with Supabase and JWT Authentication

This is a RESTful API built with Express.js, Supabase, and Prisma ORM. It includes JWT authentication, role-based access control, and comprehensive error handling.

## Features

- RESTful API with Express.js
- JWT authentication
- Role-based access control
- Prisma ORM for database operations
- Supabase integration
- Error handling and validation
- Logging with Winston
- Rate limiting for API security

## Prerequisites

- Node.js (v14 or later)
- Supabase account
- PostgreSQL database

## Getting Started

1. Clone the repository
2. Install dependencies
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and update the environment variables
   ```bash
   cp .env.example .env
   ```
4. Setup Supabase by clicking the "Connect to Supabase" button in the top right corner
5. Run the migrations
   ```bash
   npx prisma migrate dev
   ```
6. Generate Prisma client
   ```bash
   npx prisma generate
   ```
7. Start the development server
   ```bash
   npm run dev
   ```

## Environment Variables

Make sure to set the following environment variables in your `.env` file:

```
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mydb
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/updateme` - Update user profile
- `PUT /api/auth/updatepassword` - Update password

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID (Admin only)
- `PUT /api/users/:id` - Update user role (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

### Posts

- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get all published posts
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post (Author or Admin only)
- `DELETE /api/posts/:id` - Delete post (Author or Admin only)
- `GET /api/posts/my` - Get current user's posts

## Project Structure

```
├── prisma/
│   └── schema.prisma
├── src/
│   ├── config/
│   │   ├── db.config.js
│   │   └── logger.config.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   └── post.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validator.middleware.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   └── post.routes.js
│   ├── utils/
│   │   └── appError.js
│   └── index.js
├── supabase/
│   └── migrations/
│       ├── create_users_table.sql
│       └── create_posts_table.sql
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## License

This project is licensed under the ISC License.