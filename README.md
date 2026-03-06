<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ pnpm install
```

## Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

## Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ pnpm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

# 📦 Lost & Found API

A **Lost & Found backend system** built with **Node.js, Prisma ORM, and PostgreSQL**.  
Users can create posts for lost or found items, comment on posts, and react to them.

---

# 🚀 Features

- User authentication system
- Role based user system
- Create **Lost** or **Found** posts
- Nested comments (replies to comments)
- Post reactions (Like / Sad)
- Soft delete support
- Prisma ORM with PostgreSQL
- Clean relational schema

---

# 🛠 Tech Stack

- Node.js
- Prisma ORM
- PostgreSQL
- TypeScript / JavaScript

---

# 📂 Database Schema Overview

## User

Represents a registered user.

| Field     | Type     | Description     |
| --------- | -------- | --------------- |
| id        | Int      | Primary key     |
| email     | String   | Unique email    |
| password  | String   | Hashed password |
| name      | String   | User name       |
| phone     | String   | Optional phone  |
| roleId    | Int      | Role reference  |
| createdAt | DateTime | Created time    |
| updatedAt | DateTime | Updated time    |

Relations:

- User belongs to **Role**
- User can create **Posts**
- User can create **Comments**
- User can add **Reactions**

---

## Role

Defines the user role.

Example roles:

- Admin
- User
- Moderator

| Field     | Type     |
| --------- | -------- |
| id        | Int      |
| name      | String   |
| createdAt | DateTime |
| updatedAt | DateTime |

---

## Post

Represents a **Lost or Found item post**.

| Field       | Type     | Description      |
| ----------- | -------- | ---------------- |
| id          | Int      | Primary key      |
| title       | String   | Post title       |
| description | String   | Item description |
| type        | PostType | LOST or FOUND    |
| creatorId   | Int      | User reference   |
| deletedAt   | DateTime | Soft delete      |
| createdAt   | DateTime | Created time     |
| updatedAt   | DateTime | Updated time     |

Relations:

- Post belongs to **User**
- Post has **Comments**
- Post has **Reactions**

---

## Comment

Supports **nested comments (replies)**.

| Field     | Type           |
| --------- | -------------- |
| id        | Int            |
| postId    | Int            |
| authorId  | Int            |
| parentId  | Int (optional) |
| content   | String         |
| depth     | Int            |
| deletedAt | DateTime       |
| createdAt | DateTime       |
| updatedAt | DateTime       |

Features:

- Comment replies
- Threaded conversation
- Soft delete

---

## Reaction

Users can react to posts.

| Field     | Type         |
| --------- | ------------ |
| id        | Int          |
| type      | ReactionType |
| postId    | Int          |
| userId    | Int          |
| createdAt | DateTime     |

Constraints:

- One reaction per user per post

# 🧾 Example Environment File

Create a `.env` file in the root of the project and add the following configuration.

```env
# --------------------------------
# APP DETAILS
# --------------------------------
NODE_ENV=development
PORT=4055
SERVER_URL=http://localhost:4050/
API_NAME=/api
API_VERSION=/v1
COMPANY_SUPPORT_EMAIL=support@lost-and-found.ae

# --------------------------------
# JWT CREDENTIALS
# --------------------------------
JWT_SECRET=32charactersLongSecretHere
JWT_EXPIRY=24

# --------------------------------
# POSTGRES CREDENTIALS
# --------------------------------
POSTGRES_CONTAINER_NAME=postgres-lost-and-found-dev
POSTGRES_PORT=5439
POSTGRES_USER=root
POSTGRES_PASSWORD=rootpassword

# --------------------------------
# PROJECT NAME
# --------------------------------
PROJECT_NAME=lost-and-found

# --------------------------------
# DATABASE CONNECTION
# --------------------------------
DATABASE_URL="postgresql://root:rootpassword@localhost:5432/lost-and-found?schema=public"

# --------------------------------
# PGADMIN CREDENTIALS
# --------------------------------
PG_ADMIN_CONTAINER_NAME=pgadmin-lost-and-found-dev
PG_ADMIN_EMAIL=admin@example.com
PG_ADMIN_PASSWORD=adminpassword
PG_ADMIN_PORT=5058
PG_ADMIN_EXPOSE_PORT=80

# --------------------------------
# DOCKER CONTAINERS
# --------------------------------
DOCKER_DEVELOPMENT_CONTAINER_NAME=lost-and-found-dev
DOCKER_STAGING_CONTAINER_NAME=lost-and-found-stag
DOCKER_PRODUCTION_CONTAINER_NAME=lost-and-found-prod
```

⚠️ **Note**

- Do not commit your `.env` file to GitHub.
- Add `.env` inside your `.gitignore`.

Example:

```
.env
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## 📬 Stay in Touch

- 👨‍💻 Author: **Abdul Fatah Chandio**
- 🌐 GitHub: https://github.com/AbdulFatahChandio
- 📦 Project Repository: https://github.com/AbdulFatahChandio/Lost-and-found-Internship

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
