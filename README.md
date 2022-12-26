Equalex is a web app built using NextJS to track your investment portfolio performance.

## Technologies used

- [Next.js](https://nextjs.org/) as the React framework
- [Prisma](https://www.prisma.io/) as the ORM for migrations and database access
- [PostgreSQL](https://www.postgresql.org) as the database
- [TypeScript](https://www.typescriptlang.org/)  as the programming language
- [Ant Design](https://ant.design/) for UI components

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database development

The database schema is located in `[prisma/schema.prisma](prisma/schema.prisma)`.

To map your data model to the database schema, you need to use the prisma migrate CLI commands:

```bash
npx prisma migrate dev --name {migrationName}
```

Because Prisma Client is tailored to your own schema, you need to update it every time your Prisma schema file is changing by running the following command:

```bash
npx prisma generate
```

You can also add dummy data to the db using prisma studio running

```bash
npx prisma studio
```
