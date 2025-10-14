# Recipe Web App

A simple recipe sharing application for small teams (up to 5 users).

## Features

- User authentication with email/password
- Create, view, and edit recipes
- Search recipes by title
- User-friendly interface with large inputs and clear labels
- All users can view and add recipes
- Only recipe creators can edit their own recipes

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Database:** Vercel Postgres
- **ORM:** Drizzle ORM
- **Authentication:** NextAuth.js
- **Styling:** Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18+ 
- A Vercel account (for database)
- npm or pnpm

### 1. Clone and Install

```bash
cd recipe-app
npm install
```

### 2. Set Up Database

1. Create a Vercel Postgres database at [vercel.com](https://vercel.com/dashboard)
2. Copy the database credentials

### 3. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database (from Vercel Postgres)
POSTGRES_URL=your_postgres_url
POSTGRES_PRISMA_URL=your_postgres_prisma_url
POSTGRES_URL_NON_POOLING=your_postgres_url_non_pooling

# Auth
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000

# Allowed users (comma-separated emails)
ALLOWED_EMAILS=user1@example.com,user2@example.com,user3@example.com
```

**Generate a secret key:**
```bash
openssl rand -base64 32
```

### 4. Run Database Migrations

```bash
npx drizzle-kit push
```

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Usage

### First Time Setup

1. Go to `/auth/signup`
2. Enter an email from the `ALLOWED_EMAILS` list
3. Create a password (minimum 8 characters)
4. Sign in with your credentials

### Creating a Recipe

1. Sign in to your account
2. Click "Add Recipe" on the home page
3. Fill in:
   - **Title** (required)
   - **Description** (optional)
   - **Ingredients** (optional, one per line)
   - **Instructions** (required, one step per line)
4. Click "Save Recipe"

### Editing a Recipe

- Only the recipe creator can edit their recipes
- Click "Edit" on the recipe detail page
- Make changes and save

### Searching Recipes

- Use the search box on the home page
- Searches recipe titles

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel dashboard
3. Add environment variables in Vercel project settings
4. Deploy

**Important:** Make sure to set all environment variables from `.env.local` in your Vercel project settings.

### Database Migrations on Vercel

Migrations run automatically when using `drizzle-kit push`. For production:

```bash
npx drizzle-kit push
```

## Managing Users

To add or remove authorized users, update the `ALLOWED_EMAILS` environment variable:

```bash
ALLOWED_EMAILS=user1@example.com,user2@example.com,newuser@example.com
```

Redeploy or restart the dev server for changes to take effect.

## Security Notes

- Passwords are hashed with bcrypt (10 rounds)
- Only emails in `ALLOWED_EMAILS` can sign up
- Sessions use secure JWT tokens
- Users can only edit their own recipes

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npx drizzle-kit push

# Generate database migrations
npx drizzle-kit generate

# Open Drizzle Studio (database GUI)
npx drizzle-kit studio
```

## Troubleshooting

### "Email not authorized" error
- Make sure the email is in the `ALLOWED_EMAILS` environment variable
- Check for typos or extra spaces

### Database connection errors
- Verify `POSTGRES_URL` is correct
- Make sure your Vercel Postgres database is active

### "Invalid credentials" error
- Double-check email and password
- Passwords are case-sensitive

### Can't edit recipe
- Only the recipe creator can edit their own recipes
- Make sure you're signed in as the correct user

## Project Structure

```
recipe-app/
├── app/
│   ├── api/          # API routes
│   ├── auth/         # Authentication pages
│   ├── recipe/       # Recipe pages
│   ├── new/          # New recipe page
│   └── page.tsx      # Home page
├── components/       # React components
├── lib/
│   └── db/           # Database config and schema
├── types/            # TypeScript types
├── auth.ts           # NextAuth configuration
├── middleware.ts     # Route protection
└── drizzle.config.ts # Drizzle configuration
```

## Support

For issues or questions, refer to the [PLAN.md](../PLAN.md) file for architecture details.
