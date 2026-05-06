# WASCO Fixed Project

## 1. Create PostgreSQL database
In pgAdmin create/connect to database:

```sql
CREATE DATABASE wasco_main;
```

Then open Query Tool on `wasco_main` and run:

```sql
-- Open and execute: server/sql/postgres_schema.sql
```

## 2. Backend

```cmd
cd C:\Users\karabelo\Downloads\wasco-fixed-complete\wasco\server
npm install
npm start
```

Test:

```text
http://localhost:5000/api/health
```

## 3. Frontend

Open another CMD:

```cmd
cd C:\Users\karabelo\Downloads\wasco-fixed-complete\wasco\client
npm install
npm run dev
```

Open:

```text
http://localhost:5173
```

## Role login behavior

- Normal customer email -> customer dashboard
- Email containing `@wasco.admin` -> administrator dashboard
- Email containing `@wasco.manager` -> branch manager dashboard

Example admin registration email:

```text
admin@wasco.admin
```

Example manager registration email:

```text
manager@wasco.manager
```

## Fixed behavior

- Header hidden on dashboards.
- Footer visible on dashboards and public pages.
- Sidebar shows current user name and role.
- Customer, manager and admin see only their own role pages.
- Managers see only real customers, not admins/managers.
- Payment updates bill status immediately.
- Reports use real PostgreSQL data and usage segment view.
- Footer title strokes removed.
