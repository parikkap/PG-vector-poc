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
2. Run `docker-compose up` in this folder
3. Run `npx prisma migrate dev`
4. You should now have working database with pgvector support.

## NextJS

Run `npm run dev`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Prisma

1. Update update db connection string to .env.
2. Run `npx prisma db push` to update schema

Read more https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratchs

## Tailwind & DaisyUI

This project uses Tailwind and DaisyUI components for styling. DaisyUI is tailwind based UI library.

Read more: 
- [Tailwind]("https://tailwindcss.com/")
- [DaisyUI]("https://daisyui.com/docs")

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
