---
name: operations-and-tuning
description: >-
  Use BEFORE indexing, migrating, pooling, or securing a database — indexing strategy, EXPLAIN,
  migrations & versioning, connection pooling, transactions & isolation levels, Postgres tuning
  basics, security (least-privilege, encryption, secret rotation), and backups/PITR. Triggers:
  'add an index', 'slow query', 'explain analyze', 'database migration', 'connection pool',
  'pgbouncer', 'isolation level', 'deadlock', 'postgres tuning', 'database backup'.
---

# Operations & tuning

A correct schema (`data-modeling`) still falls over under load without the right indexes, safe
migrations, bounded connections, and a restore you've actually tested. This skill keeps the
database **fast, safe, and available** in production. Principles are engine-neutral; concrete SQL
and config are Postgres.

## 1 — Indexing

An index trades **write cost and disk** for read speed. Add them deliberately, from the query list
(`data-modeling` §0), not reflexively.

- **B-tree is the default** and serves equality and range (`=`, `<`, `>`, `BETWEEN`, `ORDER BY`,
  `LIKE 'prefix%'`). Reach for others only when the workload calls: **GIN** for `jsonb`/arrays/
  full-text, **GiST** for geo/ranges, **BRIN** for huge naturally-ordered tables (append-only time
  series), **hash** rarely.
- **Composite column order is the whole game.** Put the columns used for **equality first, then the
  range/sort column**: an index on `(tenant_id, created_at)` serves `WHERE tenant_id = ? ORDER BY
  created_at` and `WHERE tenant_id = ?`, but *not* a query on `created_at` alone. Leftmost-prefix
  rule — the index is usable only from the left.
- **Covering index:** add non-filter columns with `INCLUDE` so the query is answered from the index
  alone (an *index-only scan*, no heap fetch). Great for hot read paths.
- **Index your foreign keys.** Postgres indexes the PK automatically but **not** the referencing FK
  column — an unindexed FK means slow joins *and* the parent's `DELETE`/`UPDATE` takes a full scan
  and heavier locks. This is a classic silent performance bug.
- **Partial index** for a hot subset (`WHERE deleted_at IS NULL`) — smaller, cheaper.
- **Over-indexing has a real cost:** every index is maintained on every `INSERT`/`UPDATE`/`DELETE`
  and bloats disk and cache. Drop unused ones (`pg_stat_user_indexes` shows `idx_scan = 0`).
  Build on live tables with `CREATE INDEX CONCURRENTLY` to avoid locking writes.

## 2 — Reading EXPLAIN / ANALYZE

Never guess why a query is slow — ask the planner. `EXPLAIN` shows the plan; `EXPLAIN (ANALYZE,
BUFFERS)` actually runs it and shows real timings and I/O.

- **Read bottom-up / inside-out:** the deepest node runs first. Watch **actual vs estimated rows** —
  a large mismatch means stale stats (`ANALYZE` the table) or a bad estimate, and it cascades into
  a bad plan.
- **Scan types, roughly worst→best for selective queries:** `Seq Scan` (reads whole table — fine
  for small tables or when returning most rows, a red flag on a large selective query) →
  `Bitmap Heap Scan` → `Index Scan` → `Index Only Scan`.
- **Join methods:** `Nested Loop` (great for few rows, disastrous when the row estimate is wrong),
  `Hash Join` (big unsorted sets), `Merge Join` (pre-sorted inputs).
- **Red flags:** a `Seq Scan` on a big table with a selective `WHERE`; row estimates off by
  orders of magnitude; a `Sort` or `Hash` spilling to disk (raise `work_mem` or add an index);
  huge `Buffers` reads for a small result.
- Fix the cause: add/reorder an index, `ANALYZE` for fresh stats, or rewrite the query — then
  re-run `EXPLAIN ANALYZE` to confirm the plan changed.

## 3 — Migrations & versioning

Schema changes are code: **versioned, forward-only, reviewed, and run automatically** — never a
hand-typed `ALTER` in prod.

- **Version every change** as an ordered, immutable migration file in the repo (Flyway, Liquibase,
  Alembic, Prisma Migrate, Rails, `golang-migrate` — pick one). The DB records which have run.
- **Forward-only.** Don't rely on `down` scripts to fix a bad prod deploy — roll *forward* with a
  new migration. Reversibility is for local dev.
- **Expand/contract (parallel change) for zero downtime** — never rename or drop a column in one
  step while old code still reads it:
  1. **Expand** — add the new column/table (nullable, backfilled); deploy code that writes both.
  2. **Migrate** — backfill in batches; switch reads to the new column.
  3. **Contract** — once no code references the old column, drop it in a later release.
- **Beware locking DDL.** On Postgres, adding a `NOT NULL` column with a non-constant default,
  adding an FK/`CHECK` that validates, or building an index all take strong locks on large tables.
  Use `ADD COLUMN` nullable then backfill, `CREATE INDEX CONCURRENTLY`, and `ADD CONSTRAINT ... NOT
  VALID` then `VALIDATE CONSTRAINT` separately. Set a short `lock_timeout` so a blocked migration
  fails fast instead of queueing every query behind it.
- Test each migration against production-like data volume; a migration that's instant on 1k rows
  can lock a 100M-row table for minutes.

## 4 — Connection pooling

Postgres backends are **processes**, not cheap threads — each connection costs memory and every
extra one adds scheduling contention. Thousands of app connections will crush a database that runs
best with dozens.

- **Pool in front of the DB.** App-side pools (HikariCP, `pgpool` in the driver) cap per-instance
  connections; a server-side pooler like **PgBouncer** multiplexes many client connections onto a
  few server ones — essential for serverless/many-instance fleets.
- **PgBouncer modes:** **`transaction`** (server connection returned to the pool at each
  transaction end) is the usual choice — highest reuse, but **no session-level features** (session
  `SET`, advisory locks, `LISTEN/NOTIFY`, some prepared-statement setups). `session` mode (one
  server conn per client session) is safe but reuses far less. `statement` is niche.
- **Size the pool small.** A good starting point is roughly **1.5–2× the number of DB CPU cores**
  (plus a small allowance), *not* hundreds. More connections than the DB can run concurrently just
  adds queueing and context-switch overhead — throughput goes *down*. Measure and tune.
- Set connection **max-lifetime** and **idle timeout** so stale/broken connections recycle; ensure
  `pool_size × app_instances ≤ Postgres max_connections` with headroom for admin/migrations.

## 5 — Transactions & isolation

A transaction is **all-or-nothing (atomic) and isolated** from concurrent ones. The isolation
*level* trades consistency for concurrency by allowing certain anomalies:

| Anomaly | Read Uncommitted | Read Committed | Repeatable Read | Serializable |
| --- | --- | --- | --- | --- |
| **Dirty read** (see uncommitted data) | possible | no | no | no |
| **Non-repeatable read** (row changes between reads) | possible | possible | no | no |
| **Phantom read** (new rows match a re-run query) | possible | possible | possible* | no |

- **Read Committed is Postgres's default** and the right choice for most OLTP — each statement sees
  a fresh snapshot of committed data. (Postgres has no true Read Uncommitted; it behaves as Read
  Committed. Its Repeatable Read is snapshot-based and already blocks phantoms\*, stronger than the
  SQL standard requires.)
- **Serializable** gives you "as if transactions ran one at a time" — but under contention it will
  **abort transactions with a serialization failure (`40001`)**, so any code using it *must* wrap
  the transaction in a **retry loop**. Use it for invariants that can't be expressed as a
  constraint (e.g. "no double-booking").
- **Keep transactions short.** A long-open transaction holds locks and blocks `VACUUM` from
  cleaning up dead rows (bloat). Never do network calls or user waits inside one.
- **Deadlocks** happen when two transactions grab locks in opposite order; Postgres detects and
  kills one (`40P01`). Prevent by **acquiring locks in a consistent order** and keeping
  transactions short; retry the victim.
- Use **explicit row locks** (`SELECT ... FOR UPDATE`) for read-modify-write; prefer optimistic
  concurrency (a `version`/`updated_at` check) for low-contention paths.

## 6 — Postgres config basics

Defaults are conservative for tiny machines. Set these to the hardware, then tune from
`pg_stat_statements` and slow-query logs:

- **`shared_buffers`** ≈ 25% of RAM (DB's own cache). **`effective_cache_size`** ≈ 50–75% of RAM
  (a *hint* to the planner about OS cache, not an allocation).
- **`work_mem`** per sort/hash node — raise cautiously; it's multiplied by concurrent operations,
  so a big value × many connections can exhaust RAM.
- **`maintenance_work_mem`** higher for faster `VACUUM`/index builds.
- **`max_connections`** modest; let a pooler (§4) fan out, don't crank this.
- **Autovacuum on, and tuned** — don't disable it. Dead tuples from updates/deletes cause bloat and
  bad plans; on high-churn tables lower `autovacuum_vacuum_scale_factor`. Enable `pg_stat_statements`
  to find the queries actually worth optimizing.
- **WAL/checkpoints:** raise `max_wal_size` to spread out checkpoints on write-heavy systems.

## 7 — Security

Least privilege, encrypt everywhere, rotate secrets — the DB holds the crown jewels.

- **Least-privilege roles:** the app connects as a role that can only `SELECT/INSERT/UPDATE/DELETE`
  the tables it needs — **never as a superuser or the table owner**. Separate roles for
  migrations (DDL), the app (DML), and read-only reporting/replicas. Grant on schemas/tables, not
  `ALL`.
- **TLS in transit:** require SSL for all client connections (`sslmode=require`/`verify-full`);
  don't send credentials or data in cleartext, ever — especially across a network boundary.
- **Encryption at rest:** enable volume/tablespace encryption (managed services do this
  transparently); consider column-level encryption for the most sensitive fields (PII, tokens).
- **Secret rotation, zero-downtime order:** **new → deploy → verify → retire** — create the new
  credential, deploy it (or dual-load both), verify the app is authenticating with the new one,
  *then* revoke the old. Never delete the old secret first. Prefer short-lived credentials from a
  secret manager / IAM auth over long-lived static passwords in env files.
- **No secrets in code or images** (see `devkit:containerization` — runtime injection, not `ENV`).
  Restrict network access to the DB (private subnet, security group / `pg_hba.conf`), and log
  connections and DDL for audit.

## 8 — Backups & PITR

Backups you haven't restored are a hope, not a plan. The only proof is a **timed restore drill**.

- **Two layers:** periodic **base backups** (`pg_basebackup`/`pg_dump`, or the managed-service
  snapshot) **plus continuous WAL archiving** — together they give **Point-In-Time Recovery**:
  restore to any moment (e.g. one second before a bad `DELETE`), not just the last nightly dump.
- **Define and honor RPO/RTO:** RPO = how much data you can lose (drives backup/WAL-ship
  frequency); RTO = how fast you must be back (drives restore method and rehearsal).
- **Test restores on a schedule** into a scratch environment and time them — verify the data is
  complete and the restore fits inside RTO. A backup job that silently failed for months is the
  default failure mode.
- **Store backups off-host and off-region**, encrypted; keep tiered retention (daily/weekly/
  monthly) per your compliance needs.
- **Replicas are not backups.** A streaming replica gives HA/read-scaling but faithfully replicates
  a `DROP TABLE` — you still need point-in-time backups for human error and corruption.

## 9 — Ops checklist

- [ ] Every hot query has a supporting index; composite column order matches equality-then-range.
- [ ] Foreign-key columns are indexed; unused indexes dropped; live builds use `CONCURRENTLY`.
- [ ] Slow queries diagnosed with `EXPLAIN (ANALYZE, BUFFERS)`, not guesses; stats fresh.
- [ ] Migrations are versioned, forward-only, expand/contract, and lock-tested at prod scale.
- [ ] A pooler caps connections; pool size ≈ 1.5–2× DB cores, within `max_connections`.
- [ ] Isolation level is deliberate; Serializable paths have a retry loop; transactions are short.
- [ ] Key config (`shared_buffers`, `work_mem`, autovacuum) set to hardware; `pg_stat_statements` on.
- [ ] App role is least-privilege; TLS required; encryption at rest on; secrets rotated new→retire.
- [ ] Base backups + WAL archiving give PITR; a restore has been drilled and timed against RTO.

## Related

- `data-modeling` — the sibling skill: the schema, keys, and FKs this one indexes, migrates, and
  locks. Read it first if the schema isn't settled.
- `devkit:cloud-infrastructure` — provisions the managed DB (backups, IAM/OIDC auth, secret store,
  networking) as IaC; this skill decides the config it should hold.
- `devkit:containerization` — runs Postgres locally for dev and injects credentials at runtime, not
  in image layers.
- `devkit:kubernetes` — where the app runs against the DB; prefer a managed service over
  self-hosting stateful Postgres in-cluster.
