[![Deployment pipeline](https://github.com/germanjimenezz18/expenses-multiplatform/actions/workflows/pipeline.yml/badge.svg)](https://github.com/germanjimenezz18/expenses-multiplatform/actions/workflows/pipeline.yml)

# Expenses Multiplatform

A modern expense tracking application built with Next.js and a powerful stack of technologies.

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Reusable component library
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend
- **Hono** - Lightweight, ultrafast web framework
- **Drizzle ORM** - TypeScript ORM
- **Neon DB** - Serverless Postgres database
- **Clerk** - Authentication and user management
- **Plaid API** - Bank account integration

## Features

- 🔐 Authentication with Clerk
- 💳 Bank account integration with Plaid
- 📊 Transaction management
- 📈 Category tracking
- 🏦 Multiple account support
- 📱 Responsive design

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/expenses-multiplatform.git
cd expenses-multiplatform
```

2. Install dependencies:
```bash
npm install
```

3. Copy the environment variables:
```bash
cp .env.example .env
```

4. Configure your environment variables:
- Set up Clerk credentials
- Configure Neon DB connection
- Add Plaid API keys

5. Run database migrations:
```bash
npm run db:migrate
```

6. Start the development server:
```bash
npm run dev
```

## Database Schema

The application uses three main tables:
- `accounts` - Store bank and manual accounts
- `categories` - Manage expense categories
- `transactions` - Track all financial transactions

## API Routes

The application uses Hono for API routes:
- `/api/accounts` - Account management
- `/api/categories` - Category management
- `/api/transactions` - Transaction operations

## Testing

End-to-end testing is implemented with Cypress:
```bash
npm run cypress:open  # Interactive testing
npm run test:e2e     # Headless testing
```

## Deployment

The project includes a GitHub Actions pipeline for automated deployment:
- Linting
- Building
- E2E Testing (commented out in current config)

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License.

