---
name: data-modeling
description: >-
  Use BEFORE designing a database schema or choosing a datastore — modeling entities/relationships,
  normalization vs denormalization, keys & constraints, SQL vs NoSQL selection by access pattern,
  and ORM/query patterns. Triggers: 'design a schema', 'data model', 'normalize', 'sql vs nosql',
  'choose a database', 'er diagram', 'foreign key'.
---

# Data modeling

A schema is a set of **promises the database enforces about your data**. Model those promises
before you write DDL: get the entities, relationships, and constraints right and most bugs become
impossible; get them wrong and every query and migration pays for it. Engine-neutral rules below;
concrete SQL is Postgres, and ports cleanly to other relational engines.

## 0 — Model to access patterns first

You do not model "the domain" in the abstract — you model **the queries the app will actually
run**. Before drawing tables, list the read/write paths from the app spec: what gets fetched on
each screen, by which key, how often, how fresh it must be, how it grows.

- **Relational default:** write the *normalized* truth once and let queries join. This is the right
  starting point for almost everything — flexible, correct, and it doesn't guess wrong about future
  queries.
- **NoSQL / denormalized:** shape storage around a *known, narrow* set of access patterns (one
  document per screen, one partition per query). Powerful when the patterns are fixed and huge in
  volume; painful the day a new query cuts across the shape.
- Write down the top 5–10 queries and the expected row counts. That list decides normalization,
  keys, indexes (see `operations-and-tuning`), and SQL-vs-NoSQL — not taste.

## 1 — Entities, relationships & the ER model

Identify **entities** (nouns the system remembers: user, order, product), their **attributes**,
and the **relationships** between them. Relationships have a *cardinality* that dictates the
physical design:

| Relationship | Physical implementation |
| --- | --- |
| **One-to-one** | FK (unique) on either table, or fold into one table if always fetched together. |
| **One-to-many** | FK on the *many* side pointing at the *one*. The default relationship. |
| **Many-to-many** | A **junction table** (`order_id`, `product_id`) with its own PK; never a comma-list column. |
| **Self-referencing** | FK to the same table (`manager_id → employees.id`) for trees/graphs. |

- Draw the **ER diagram** (entities as boxes, relationships as lines with crow's-foot cardinality)
  before DDL — it exposes missing junction tables and ambiguous cardinality fast.
- A repeating group ("phone1, phone2, phone3", a CSV column) is a hidden one-to-many. Give it its
  own table.
- Name the relationship's meaning, not just the tables: `orders.shipped_to_address_id` beats
  `orders.address_id` when an order also has a billing address.

## 2 — Normalization (1NF–3NF), and when to denormalize

Normalize by default; it removes the **update/insert/delete anomalies** that come from storing a
fact in more than one place.

| Form | Rule | Fix |
| --- | --- | --- |
| **1NF** | Atomic values; no repeating groups or arrays-as-columns. | Split repeating columns into rows/child table. |
| **2NF** | 1NF + no non-key column depends on *part* of a composite key. | Move partial-dependency columns to their own table. |
| **3NF** | 2NF + no non-key column depends on another non-key column (no transitive deps). | Extract the transitively-dependent columns (e.g. `zip → city` becomes a `zipcodes` table). |

Rule of thumb: **every non-key column depends on the key, the whole key, and nothing but the key.**
3NF is the target for OLTP.

**Denormalize only when measured** — never preemptively. A duplicated column is a data-integrity
liability you take on to buy read speed:

- First try an index, a covering index, or a materialized view (`operations-and-tuning` §1).
- If you must duplicate, own the consistency: keep the copy in sync with a trigger, a scheduled
  refresh, or in the same transaction — and write down that it's derived.
- Legitimate cases: a cached aggregate (`order.line_item_count`), a wide read model for a hot
  dashboard, analytics/OLAP star schemas. All are optimizations, justified by a profile.

## 3 — Keys, constraints, data types, nullability

The database — not the app — is the last line of defense for data integrity. Push invariants down.

- **Primary key:** every table gets one. Prefer a **surrogate** key (`bigint` identity or UUID)
  over a natural key that might change; if UUID, prefer **UUIDv7/ULID** (time-ordered) over v4 to
  avoid index fragmentation and page splits on insert.
- **Foreign keys:** declare them. They enforce referential integrity and document the graph. Choose
  `ON DELETE` deliberately — `RESTRICT`/`NO ACTION` (default, safest), `CASCADE` (only for true
  ownership like order→line_items), or `SET NULL`. Cascades that fan out wide are a footgun.
- **Constraints over app checks:** `NOT NULL`, `UNIQUE`, `CHECK (price >= 0)`, and enum-via-`CHECK`
  or a lookup table catch bad data no matter which code path writes it.
- **Data types — be precise:**

| Need | Use | Avoid |
| --- | --- | --- |
| Money | `numeric(12,2)` (exact) | `float`/`real` (rounding errors) |
| Timestamp | `timestamptz` (UTC, tz-aware) | naive `timestamp`, epoch ints |
| Identifier | `bigint` identity / UUIDv7 | `int` (32-bit overflow at ~2.1B) |
| Enum-ish | lookup table or `CHECK` | free-text status strings |
| Text | `text` (Postgres: no penalty) | over-tight `varchar(n)` guesses |
| Structured blob | `jsonb` (queryable, indexable) | `json`/opaque text |

- **Nullability is a modeling decision:** `NULL` means "unknown/not applicable," not "empty" or
  "zero." Default to `NOT NULL` and add nullability only where absence is meaningful. Remember
  `NULL` breaks equality (`= NULL` is never true) and is skipped by most aggregates.

## 4 — SQL vs NoSQL: paradigm selection matrix

Pick by *access pattern and consistency need*, not hype. Default to relational; reach for NoSQL
when a specific dimension forces it.

| Dimension | Relational (Postgres/MySQL) | Document (Mongo/DynamoDB) | Key-value (Redis) | Wide-column (Cassandra) |
| --- | --- | --- | --- | --- |
| **Query shape** | Ad-hoc joins, flexible filters | Fetch/store whole doc by key | Get/set by key | Known queries, huge fan-out |
| **Consistency** | Strong ACID, multi-row txns | Tunable; per-doc atomic | Mostly none | Tunable, eventual-leaning |
| **Scale model** | Vertical + read replicas; sharding is work | Horizontal, built-in | Horizontal | Horizontal, write-heavy |
| **Schema** | Fixed, migrated | Flexible per doc | None | Column families |
| **Best at** | Transactions, reporting, integrity | Hierarchical docs, varied shapes | Cache, sessions, rate limits | Time-series, event logs at scale |

- **Default to Postgres.** It also does JSON (`jsonb`), full-text, geo (PostGIS), and queue-like
  workloads — you rarely need a second store early, and "just add Postgres extensions" beats
  operating another database.
- **Don't run a distributed DB to dodge modeling.** NoSQL trades joins and ad-hoc queries for
  scale; you pay it back by pre-designing every access pattern. Only worth it when scale or data
  shape genuinely demands it.
- **Polyglot is a cost.** Every extra datastore is more ops, more consistency seams, more failure
  modes. Add one only when a real requirement (cache latency, event volume) justifies it.

## 5 — ORM & query patterns

The ORM is a convenience over SQL, not a replacement for understanding it. The failure modes are
predictable:

- **N+1 queries:** loading a list then lazily loading each row's relation = 1 + N round trips.
  Fix with an eager join / batched load (`JOIN`, `select_related`/`prefetch`, `include`). This is
  the single most common ORM performance bug — check the query log.
- **Unbounded reads:** `SELECT *` with no `LIMIT` over a growing table. Always cap result sets; it
  works fine at 100 rows in dev and melts at 10M in prod.
- **Pagination:** offset pagination (`LIMIT n OFFSET m`) degrades as the offset grows (the DB scans
  and discards m rows). Prefer **keyset/cursor** pagination (`WHERE id > :last ORDER BY id LIMIT n`)
  for large or infinite lists.
- **Select only what you need:** avoid `SELECT *`; wide rows and unused columns defeat covering
  indexes and bloat transfer.
- **Know the generated SQL.** Log it in dev; if you can't predict the SQL an ORM call emits, you
  can't index or reason about it. Drop to raw SQL for complex reporting queries.
- **Transactions belong to a unit of work**, not per-statement — wrap multi-write operations so
  they commit or roll back together (isolation details in `operations-and-tuning` §5).

## 6 — Naming conventions

Pick one convention and never mix. Consistency matters more than the specific choice.

- **Tables:** lowercase `snake_case`, plural (`orders`, `line_items`). Postgres folds unquoted
  identifiers to lowercase — avoid `CamelCase` that forces quoting everywhere.
- **Columns:** `snake_case`; foreign keys as `<referent_singular>_id` (`customer_id`).
- **Keys/indexes:** predictable names (`pk_orders`, `fk_orders_customer`, `ix_orders_created_at`,
  `uq_users_email`) so they're greppable and migration diffs read clearly.
- **Booleans:** `is_`/`has_` prefix (`is_active`). **Timestamps:** `_at` suffix (`created_at`,
  `deleted_at`). **Counts/amounts:** unit in the name where ambiguous (`amount_cents`,
  `timeout_ms`).
- **No reserved words** (`user`, `order`, `group`) as bare identifiers; either avoid or accept
  quoting everywhere.

## 7 — Schema review checklist

- [ ] Every table has a primary key; surrogate unless a natural key is truly stable.
- [ ] Every relationship is a real FK with a deliberate `ON DELETE` action.
- [ ] Normalized to 3NF; every denormalized/duplicated column is justified and kept in sync.
- [ ] No repeating groups, CSV columns, or arrays-standing-in-for a child table.
- [ ] Types are precise: `numeric` for money, `timestamptz` for time, `bigint`/UUIDv7 for ids.
- [ ] `NOT NULL` everywhere absence is meaningless; `CHECK`/`UNIQUE` enforce invariants in the DB.
- [ ] The top queries from §0 are expressible without contortions (and will be indexable).
- [ ] Naming is one consistent convention; no reserved-word identifiers.
- [ ] Datastore choice traces to an access pattern in §4, not to preference.
- [ ] No unbounded reads or N+1s in the ORM layer; large lists use keyset pagination.

## Related

- `operations-and-tuning` — the sibling skill: turns this schema into indexes, migrations, pooling,
  transactions, security, and backups. The keys and FKs you chose here are the indexes and lock
  boundaries you tune there.
- `devkit:app-prompt` — produces the entities, access patterns, and non-functional targets this
  skill models against. Model to that spec, not a blank page.
- `devkit:cloud-infrastructure` — provisions the managed database service and injects credentials
  via the secret store.
- `devkit:containerization` — runs Postgres as a local dev dependency (named volume + `pg_isready`
  healthcheck).
