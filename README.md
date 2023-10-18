This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Postgres with docker

1. Install docker and docker-compose
2. You might need to pull fist the normal postgres image `docker pull postgres`
3. Run `docker pull [ankane/pgvector]`(https://hub.docker.com/r/ankane/pgvector)
4. Run `docker-compose up`
5. Connect to db with `docker-compose run db psql -h db -U postgres`
6. In postgres run `CREATE DATABASE vector_db;` and `CREATE EXTENSION vector;`
7. TBC... We should have a script that does all this or ORM if someone supports PGVECTOR

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Prisma

1. Update update db connection string to .env.
2. Run `npx prisma db push` to update schema

Read more https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratchs

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
