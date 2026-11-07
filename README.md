# vinyl-store

REST API for an online vinyl records store, written in TypeScript with NestJS, MySQL and Stripe.

![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-payments-635BFF?style=flat-square&logo=stripe&logoColor=white)
[![CI](https://github.com/lubenkov/vinyl_store/actions/workflows/ci.yml/badge.svg?branch=final_project)](https://github.com/lubenkov/vinyl_store/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)

[![Live Demo](https://img.shields.io/badge/Live_Demo-Open_the_site-D69F55?style=for-the-badge&logo=vercel&logoColor=white)](https://vinyl-store-frontend-black.vercel.app)
[![API Docs](https://img.shields.io/badge/API_Docs-Open_Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](https://vinyl-store-api.vercel.app/api/docs)
[![Frontend](https://img.shields.io/badge/Frontend-vinyl__store__frontend-3178C6?style=for-the-badge&logo=github&logoColor=white)](https://github.com/lubenkov/vinyl_store_frontend)

## About

The backend of a vinyl record shop: a catalog with search, sorting and pagination, sign-in with
email or Google, reviews, purchases through Stripe, Discogs import, Telegram notifications and an
audit log of everything the admins do.

## Features

| Feature   | What it does                                                                                                       |
| :-------- | :----------------------------------------------------------------------------------------------------------------- |
| Catalog   | pagination, sorting and search; the sort and search columns are whitelisted, so a client cannot pass arbitrary SQL |
| Auth      | JWT with email and password (bcrypt hashes) or Google OAuth 2.0                                                    |
| Roles     | `AuthGuard` for signed-in users, `AdminGuard` for the `admin` role                                                 |
| Reviews   | score from 1 to 5, the author is taken from the token, not from the request body                                   |
| Purchases | the price is read from the database; Stripe creates a PaymentIntent, or `sk_test_dummy` records a demo purchase    |
| Discogs   | look up a release by Discogs ID and import it into the catalog                                                     |
| Telegram  | send a record card to a Telegram chat through the Bot API                                                          |
| Logs      | every create, update and delete is written to the `logs` table                                                     |

## How the code is organised

| File / directory          | Responsibility                                                 |
| :------------------------ | :------------------------------------------------------------- |
| `src/auth/`               | register and login, JWT issuing, Google strategy               |
| `src/users/`              | user profile                                                   |
| `src/vinyls/`             | catalog: search, sorting, pagination, reviews of a record      |
| `src/reviews/`            | reviews and their deletion                                     |
| `src/purchases/`          | Stripe payments and confirmation emails                        |
| `src/discogs/`            | Discogs search and import                                      |
| `src/telegram/`           | notifications to a Telegram chat                               |
| `src/logs/`               | audit log of write operations                                  |
| `src/models/`             | Sequelize models: `User`, `Vinyl`, `Review`, `Purchase`, `Log` |
| `src/common/`             | guards and the Winston logger                                  |
| `src/config/`             | configuration with Joi validation and the Sequelize factory    |
| `migrations/`, `seeders/` | tables and demo data from Discogs or static fixtures           |
| `tests/`                  | Jest unit and integration tests                                |

## API

Swagger UI with the full schema is available in two places:

- **Live demo:** <https://vinyl-store-api.vercel.app/api/docs>
- **Local development:** `http://localhost:3000/api/docs`

The demo deployment keeps Swagger on intentionally: `SWAGGER_ENABLED=true` is set in
production. Set `SWAGGER_ENABLED=false` for a real production deployment where the
schema should stay private.

All routes are mounted under the `/api` prefix, so the real URL is
`http://localhost:3000/api/<path>`. The table below lists the path after `/api`.

| Endpoint                         | Access | Description                                                                 |
| :------------------------------- | :----- | :-------------------------------------------------------------------------- |
| `GET /health`                    | public | service name and version                                                    |
| `POST /auth/register`            | public | register with email and password, returns a JWT                             |
| `POST /auth/login`               | public | log in with email and password, returns a JWT                               |
| `GET /auth/google`               | public | start the Google OAuth flow                                                 |
| `GET /auth/google/callback`      | public | Google redirect, hands the JWT to the frontend                              |
| `GET /auth/logout`               | public | clear the JWT cookie                                                        |
| `GET /users/profile`             | JWT    | current user profile, without the password hash                             |
| `PUT /users/profile`             | JWT    | update the profile                                                          |
| `DELETE /users/profile`          | JWT    | delete the account                                                          |
| `GET /vinyls`                    | public | catalog with `limit`, `offset`, `sortBy`, `order`, `searchBy`, `searchTerm` |
| `GET /vinyls/:id`                | public | one record together with its reviews                                        |
| `POST /vinyls`                   | admin  | add a record                                                                |
| `PUT /vinyls/:id`                | admin  | update a record                                                             |
| `DELETE /vinyls/:id`             | admin  | delete a record                                                             |
| `GET /vinyls/:id/reviews`        | public | reviews of a record, with pagination                                        |
| `POST /vinyls/:id/reviews`       | JWT    | leave a review; the author comes from the token                             |
| `DELETE /reviews/:id`            | admin  | delete a review                                                             |
| `POST /purchases`                | JWT    | buy a record (`vinylId` and `currency` only)                                |
| `GET /discogs/vinyls`            | admin  | Discogs release search feed (no query parameters)                           |
| `GET /discogs/vinyls/:id`        | admin  | a release by its Discogs ID                                                 |
| `GET /discogs/vinyls/:id/scores` | admin  | a release with its community rating                                         |
| `POST /discogs/vinyls/:id`       | admin  | import a release into the catalog                                           |
| `POST /telegram/sendVinyl`       | admin  | send a record card to the Telegram chat                                     |
| `GET /logs`                      | admin  | the audit log                                                               |

## Build and run

1. Install **Node.js 20** and **MySQL 8** (a local service, XAMPP or a Docker container).
2. Run `npm install`.
3. Copy `.env.example` to `.env` and fill in the values.
4. Create the database and apply the migrations:

```sql
CREATE DATABASE IF NOT EXISTS vinyl_store;
```

```bash
npm run db:migrate
npm run db:seed   # optional: Discogs when keys are set, otherwise static demo data
```

5. Start the app with `npm run start:dev` (watch mode) or `npm run build` + `npm run start:prod`.

The API is served at `http://localhost:3000/api`, Swagger UI at
`http://localhost:3000/api/docs`.

> **Note:** secrets live only in `.env`, which is git-ignored.

## Environment variables

| Variable                                                          | Description                                                                   |
| :---------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| `PORT`                                                            | HTTP port, `3000` by default                                                  |
| `DATABASE_HOST`, `DATABASE_PORT`                                  | MySQL host and port (`3306`)                                                  |
| `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`             | MySQL credentials and database name                                           |
| `DATABASE_SSL`                                                    | `true` for TiDB Cloud or another TLS-only MySQL                               |
| `DATABASE_POOL_MAX`                                               | Sequelize pool size, `5` by default (keep small on serverless)                |
| `JWT_SECRET`                                                      | secret used to sign access tokens, at least 32 characters                     |
| `STRIPE_SECRET_KEY`                                               | Stripe secret key; `sk_test_dummy` enables the demo purchase flow             |
| `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASS`                       | mailbox that sends payment confirmations                                      |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` | Google OAuth 2.0 credentials (callback ends with `/api/auth/google/callback`) |
| `FRONTEND_URL`                                                    | frontend origin for the Google OAuth redirect (`http://localhost:5173`)       |
| `CORS_ORIGINS`                                                    | comma-separated extra origins; `https://*.vercel.app` is supported            |
| `SWAGGER_ENABLED`                                                 | set `true` to expose `/api/docs` in production (off by default)               |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`                          | bot token and target chat; real values are required for the admin action      |
| `DISCOGS_KEY`, `DISCOGS_SECRET`                                   | Discogs consumer key and secret; real values are required for admin import    |

> `disabled` in `.env.example` is a placeholder: it skips the Discogs demo seeder, but the
> Telegram and Discogs admin actions still require real credentials.

## Deploy to Vercel

Vercel has zero-configuration NestJS support: it detects `src/main.ts`, runs the
build and turns the app into a single Vercel Function. The project is API-only;
the SPA is deployed as a separate Vercel project. This is intentionally not the
Render "one process + static frontend" scheme: the two projects stay independent.

### 1. Database: TiDB Cloud Starter

1. Create a free MySQL-compatible TiDB Cloud Starter cluster and copy its host,
   port (`4000`), user, password and database name.
2. Put the TiDB credentials into `.env` (or export them in your shell) and apply
   the schema from your machine:

```env
DATABASE_HOST=...
DATABASE_PORT=4000
DATABASE_USER=...
DATABASE_PASSWORD=...
DATABASE_NAME=vinyl_store
DATABASE_SSL=true
```

```bash
npm run db:migrate
npm run db:seed
```

The seeder uses Discogs when `DISCOGS_KEY`/`DISCOGS_SECRET` are real, otherwise
it inserts 24 static demo records. Do not run migrations in the Vercel build
step: the database is not guaranteed to be reachable at build time.

### 2. Backend project

Import this repository at <https://vercel.com/new>, keep the detected NestJS
preset and set the environment variables:

| Variable                                                                                | Value                                                                         |
| :-------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` | TiDB credentials                                                              |
| `DATABASE_SSL`                                                                          | `true`                                                                        |
| `DATABASE_POOL_MAX`                                                                     | `5`                                                                           |
| `JWT_SECRET`                                                                            | 48+ random bytes                                                              |
| `STRIPE_SECRET_KEY`                                                                     | `sk_test_dummy` for the demo flow, or a real `sk_test_...`                    |
| `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASS`                                             | real mailbox or placeholders; failures are logged and do not break a purchase |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                                              | Google OAuth client                                                           |
| `GOOGLE_CALLBACK_URL`                                                                   | `https://<backend>.vercel.app/api/auth/google/callback`                       |
| `FRONTEND_URL`                                                                          | `https://<frontend>.vercel.app`                                               |
| `CORS_ORIGINS`                                                                          | `https://<frontend>.vercel.app` (add preview origins if needed)               |
| `SWAGGER_ENABLED`                                                                       | `true` for this demo (Swagger is public); `false` for a private production API |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`                                                | real values; required for the admin Telegram action                           |
| `DISCOGS_KEY`, `DISCOGS_SECRET`                                                         | real values; required for Discogs import                                      |

`vercel.json` pins the function to `fra1`; change the region if the TiDB cluster
is in another region. Health check: `/api/health`. Swagger: `/api/docs` is on in
this demo because `SWAGGER_ENABLED=true`; keep it off in a real production setup.

In Google Cloud Console add the callback above and
`http://localhost:3000/api/auth/google/callback` for local development. The
frontend must set `VITE_API_URL=https://<backend>.vercel.app/api`.

### 3. First admin

Register normally, then promote the account from a MySQL client:

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

### Vercel notes

-   The function is stateless and may cold-start; the first request after a quiet
    period is slower. Fluid compute is enabled by default on new projects.
-   The in-memory rate limit for login/register, purchases and review writes is
    per function instance. It is a cheap brake, not a distributed WAF.
-   `STRIPE_SECRET_KEY=sk_test_dummy` returns `status: "demo"` and records the
    purchase without calling Stripe; real test keys create a PaymentIntent.
-   JWT access tokens live for 1 hour and have no refresh token yet.

## Scripts

| Command                                  | What it does                                     |
| :--------------------------------------- | :----------------------------------------------- |
| `npm run build`                          | compile the project to `dist/`                   |
| `npm run start:dev`                      | start in watch mode                              |
| `npm run lint`                           | ESLint over the repository                       |
| `npm run format`                         | Prettier: format the code                        |
| `npm test`                               | run the Jest suite                               |
| `npm run test:cov`                       | Jest with coverage                               |
| `npm run db:migrate` / `db:migrate:undo` | apply or roll back migrations                    |
| `npm run db:seed` / `db:seed:undo`       | fill the catalog from Discogs or remove the data |

## Tests

`npm test` runs 16 suites with 77 tests: services (business logic and error cases) and controllers
(the HTTP layer with mocked services). The security behaviour is covered too — the purchase price
comes from the database, a review cannot be posted on behalf of another user, and password hashes
never leave the service.

## License

MIT — see [LICENSE](./LICENSE).

<details>
<summary><b>🇷🇺 По-русски</b></summary>

<br>

Бэкенд интернет-магазина виниловых пластинок на NestJS, MySQL (Sequelize) и Stripe.
Каталог с поиском, сортировкой и пагинацией, вход по email и через Google, отзывы,
покупки через Stripe, импорт релизов из Discogs, уведомления в Telegram и журнал
действий администратора.

**Запуск:** `npm install` → скопировать `.env.example` в `.env` → `npm run db:migrate` →
`npm run start:dev`

**Тесты:** `npm test`

</details>
