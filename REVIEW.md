# Project Review: Job Application Tracker

**Stack:** React 18 + Express/Node.js + PostgreSQL 15, fully containerized via Docker Compose. ~1.5K LOC across `client/` and `server/`.

## What's Good

- Single-command deployment: `docker compose up -d` builds and runs the full stack
- Multi-stage `Dockerfile` keeps the production image lean (only runtime deps)
- Healthcheck + `depends_on: service_healthy` ensures app waits for DB
- Bind-mounted data directory is visible to the host and easy to back up
- Parameterized SQL throughout — no obvious injection risks
- Migration system with tracking table is solid
- Helmet + compression + CORS wired up
- Mobile-first responsive design with collapsible sections
- `update.sh` now handles both docker compose v1 and v2, and works around the v1 `KeyError: 'ContainerConfig'` bug by doing `down` before `up`

## Bugs

1. **Stats counts are strings from `pg`** (`server/routes/jobs.js:289-300`) — `COUNT()` returns bigints serialized as strings. `parseInt()` in `client/src/components/Stats.js:5-7` masks it, but use `Number()` or `parseInt(x, 10)` for clarity (radix missing).

2. **`Date` never survives pg round-trip** — `client/src/components/JobDetails.js:106-108` checks `note.note_date instanceof Date`, but `pg` always returns DATE as a string. The branch is dead code; the `else` path always runs (works, but misleading).

3. **Pool startup test is fire-and-forget** (`server/pool.js:45-51`) — a missing/wrong `DATABASE_URL` only logs; the server keeps trying to listen. With `process.exit(1)` already in this file, the test feels redundant and confusing.

4. **No DB connection failure on `db.initialize()` in serverless path** (`server/index.js:82-96`) — if `initializeDatabase()` rejects, the response is generic 500. The `dbInitPromise` reset in the catch (`index.js:69`) can let two in-flight inits race in cold-start scenarios.

5. **CORS wide open** (`server/index.js:20`) — `app.use(cors())` with no origin allowlist. Fine when only running the same-origin frontend, but dangerous if any cross-origin client is ever added.

6. **Dead code in `server/index.js`** — the `if (process.env.VERCEL)` branch (`index.js:80-96`) and the "for local development and Railway" comment (`index.js:98`) are leftovers from the Vercel/Railway era. Project is Docker-only now; this branch never fires and the comment misleads readers.

## Security Concerns

1. **HTTP Basic Auth with default credentials** (`server/middleware/auth.js:13-14`) — falls back to `admin` / `changeme` if env vars missing. Auth only kicks in when `NODE_ENV === 'production'` (`server/index.js:25`), which the compose file sets, so the defaults can still apply on first boot if `.env` is missing `AUTH_USERNAME` / `AUTH_PASSWORD`. Should refuse to start without explicit creds.

2. **`helmet({ contentSecurityPolicy: false })`** (`server/index.js:16-18`) — comment says "for development" but this is in the always-on middleware. Inline scripts/styles won't be blocked. The frontend doesn't use inline scripts today, so this could safely be enabled.

3. **No rate limiting** on `/api/*` — auth or not, the app can be hammered. `express-rate-limit` is a 5-line addition.

4. **No input length validation** on backend (`server/routes/jobs.js`) — `company`, `position`, `description`, etc. accepted unbounded. Trivial DoS via repeated giant payloads.

5. **`.env` file present in working tree** with real credentials (`AUTH_USERNAME=hairyone`, `AUTH_PASSWORD=ni1el1`, `POSTGRES_PASSWORD=password123`). Not in git history, but make sure this directory isn't synced to any cloud backup (Dropbox/iCloud).

6. **`POSTGRES_PASSWORD` warning surfaces as a blank-string default** — when `.env` is missing, docker compose warns and the database starts with an empty password. The compose file has no required-variable guard. Add a `.env` existence check to `update.sh` (or document that `.env` must be created from `.env.example` before first run).

7. **Default `POSTGRES_PASSWORD=password123`** in `.env.example` — fine for local, but the README should be louder about changing it before any non-localhost exposure.

## Architecture / Maintainability

1. **Status list duplicated 6+ times** — adding a new status means editing 6 files. Single source of truth (a shared `statuses.js` or DB-driven enum) would help:
   - `server/db.js:51-52` (CHECK constraint)
   - `server/migrations/001_add_new_statuses.sql:9`
   - `server/routes/jobs.js:292-296` (stats SELECT)
   - `client/src/components/JobForm.js:73-83`
   - `client/src/components/Header.js:38-48`
   - `client/src/components/JobList.js:7-17` and `JobDetails.js:35-45` (color map)

2. **Status color map duplicated** between `JobList.js:7-17` and `JobDetails.js:35-45` — extract to a shared module.

3. **`App.js` is a god component** (`client/src/App.js`, 251 lines) — owns jobs, selected job, form, filters, stats, and ~10 CRUD handlers. Split into hooks (`useJobs`, `useJobDetails`, `useStats`) or context.

4. **Sequential re-fetch after every mutation** (`client/src/App.js:107-193`) — every contact/note/attachment add/update/delete triggers a full `api.getJob(selectedJob.id)` to refresh. Use optimistic updates or a targeted patch.

5. **No pagination** on `GET /api/jobs` — fine for tens of jobs, will hurt at thousands. Add `LIMIT/OFFSET` + `total` count.

6. **No debounce on search input** (`client/src/components/Header.js:14-19`) — every keystroke fires a request.

7. **No backend tests, no frontend tests** — `package.json` has no test script, and `src/` has zero `*.test.*` files.

8. **Postgres port `5432` is not published** in `docker-compose.yml` — good security, but means users can't run `psql` locally. Either expose it (with a strong password) or document the `docker exec` pattern (already in README).

9. **`google_drive_id` column unused** — `attachments.google_drive_id` is set in the API (`server/routes/attachments.js:30`) but never read by the client; the client just stores the URL. Either drop the column (migration) or actually use it (e.g., to generate thumbnails).

10. **`./data/postgres` ownership** — the README mentions the `sudo chown -R 999:999 ./data/postgres` workaround, but on a fresh clone the directory is created by Docker and owned by root. The bind mount works either way, but file-browser access (and rsync backups) will be awkward. Add a `.env`-driven `PUID`/`PGID` or document the chown step as part of setup.

## Resolved (since last review)

- ~~`docker-compose.yml` has app service commented out~~ → Removed; only `docker-compose.yml` remains, with the full stack.
- ~~`multer` and `googleapis` unused deps~~ → Removed from `package.json`.
- ~~`nodemon` and `concurrently` unused dev deps~~ → Removed.
- ~~Multiple setup paths (Docker / hybrid / native)~~ → Project is now Docker-only.
- ~~`update.sh` uses `docker-compose` v1 command without fallback~~ → Now detects v1/v2 and uses the right binary.
- ~~`update.sh` triggered the v1 `KeyError: 'ContainerConfig'` bug on rebuild~~ → Workaround: `down` then `up -d --build`. (Long-term fix is to install docker compose v2.)

## Recommended Priority

1. Centralize the status enum (DB + client + stats + colors).
2. Add backend input validation (e.g., `zod` or `express-validator`).
3. Add basic tests (server route smoke tests + a couple React Testing Library component tests).
4. Enable Helmet CSP for the served app.
5. Add rate limiting on `/api/*`.
6. Debounce search and add pagination.
7. Drop the dead Vercel branch in `server/index.js`.
8. Refuse to start in production without explicit auth credentials.

Overall: clean Docker-only stack with a solid foundation. The remaining issues are mostly polish, dead code removal, and the test gap.
