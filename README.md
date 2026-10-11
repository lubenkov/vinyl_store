# vinyl-store

REST API for an online vinyl records store, written in TypeScript with NestJS, MySQL and Stripe.

![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-payments-635BFF?style=flat-square&logo=stripe&logoColor=white)
[![CI](https://github.com/lubenkov/vinyl_store/actions/workflows/ci.yml/badge.svg?branch=final_project)](https://github.com/lubenkov/vinyl_store/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](./LICENSE)

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
| Purchases | the price is read from the database, a Stripe PaymentIntent is created and a confirmation email is sent            |
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
| `migrations/`, `seeders/` | tables and demo data from Discogs                              |
| `tests/`                  | Jest unit and integration tests                                |

## API

Swagger UI with the full schema is available at `http://localhost:3000/api`.

| Endpoint                         | Access | Description                                                                 |
| :------------------------------- | :----- | :-------------------------------------------------------------------------- |
| `GET /health`                    | public | service name and version                                                    |
| `POST /auth/register`            | public | register with email and password, returns a JWT                             |
| `POST /auth/login`               | public | log in with email and password, returns a JWT                               |
| `GET /auth/google`               | public | start the Google OAuth flow                                                 |
| `GET /auth/google/callback`      | public | Google redirect, sets the JWT cookie                                        |
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
| `GET /discogs/vinyls`            | public | search releases on Discogs                                                  |
| `GET /discogs/vinyls/:id`        | public | a release by its Discogs ID                                                 |
| `GET /discogs/vinyls/:id/scores` | public | a release with its community rating                                         |
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
npm run db:seed   # optional: 50 demo records from Discogs
```

5. Start the app with `npm run start:dev` (watch mode) or `npm run build` + `npm run start:prod`.

The API is served at `http://localhost:3000`, Swagger UI at `http://localhost:3000/api`.

> **Note:** secrets live only in `.env`, which is git-ignored.

## Environment variables

| Variable                                                          | Description                                    |
| :---------------------------------------------------------------- | :--------------------------------------------- |
| `PORT`                                                            | HTTP port, `3000` by default                   |
| `DATABASE_HOST`, `DATABASE_PORT`                                  | MySQL host and port (`3306`)                   |
| `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`             | MySQL credentials and database name            |
| `JWT_SECRET`                                                      | secret used to sign access tokens              |
| `STRIPE_SECRET_KEY`                                               | Stripe secret key, `sk_test_...` for test mode |
| `EMAIL_SERVICE`, `EMAIL_USER`, `EMAIL_PASS`                       | mailbox that sends payment confirmations       |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL` | Google OAuth 2.0 credentials                   |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`                          | bot token and target chat                      |
| `DISCOGS_KEY`, `DISCOGS_SECRET`                                   | Discogs API consumer key and secret            |

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

`npm test` runs 15 suites with 70 tests: services (business logic and error cases) and controllers
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
