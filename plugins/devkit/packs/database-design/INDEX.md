---
name: database-design
description: Section index for designing and running a database well. Two skills — data-modeling (get the schema and datastore choice right: entities, normalization, keys, SQL vs NoSQL, ORM/query patterns) and operations-and-tuning (keep it fast, safe, and available: indexing, EXPLAIN, migrations, pooling, transactions, security, backups). Engine-neutral principles with Postgres as the worked example. Read data-modeling before you have a schema; add operations-and-tuning once it runs in production.
---

# Database design — section index

This section is the **tool-agnostic craft** of designing a database and keeping it healthy in
production. The principles are engine-neutral; where concrete SQL or config is shown, **Postgres
is the single worked example** — the ideas port to MySQL, SQL Server, and most relational engines,
and much of the modeling half applies to NoSQL too.

It has two skills that stack: **`data-modeling`** gets the *shape* right — what the tables are,
how they relate, which datastore fits the access pattern. **`operations-and-tuning`** keeps that
schema *fast, safe, and available* once real traffic and real data hit it. Read the one(s) the
task needs — you don't have to read both.

## Skills in this section

| Skill | Read it for | File |
| --- | --- | --- |
| **Data modeling** | Designing a schema or choosing a datastore — modeling entities and relationships, normalization (1NF–3NF) and when to denormalize, keys/constraints/data types/nullability, the SQL-vs-NoSQL selection matrix, and ORM/query patterns (N+1, unbounded reads, pagination). Start here when there is no schema yet. | `data-modeling/SKILL.md` |
| **Operations & tuning** | Making a schema perform and survive in production — indexing strategy and reading `EXPLAIN`, migrations & versioning (expand/contract for zero downtime), connection pooling, transactions & isolation levels, Postgres config basics, security (least-privilege, encryption, secret rotation), and backups/PITR with restore drills. | `operations-and-tuning/SKILL.md` |

Paths are relative to this section folder (`${CLAUDE_PLUGIN_ROOT}/packs/database-design/`).

## How to use this section

- **Designing a new schema or picking a datastore:** read `data-modeling`. That's usually enough
  to get a first schema that won't need re-cutting in a month.
- **The database is going to production** (real users, real data volume, migrations over time):
  also read `operations-and-tuning` — modeling decisions and operational decisions constrain each
  other (a key choice becomes an index choice; a relationship becomes a foreign key becomes a lock
  concern), so the two skills are meant to be read together for anything that ships.
- **Debugging a live problem** (slow query, deadlock, a migration that locked the table, a pool
  that ran dry): go straight to `operations-and-tuning` and the relevant section.

## How this section relates to the rest of devkit

- **`devkit:app-prompt`** sits *in front* of this work: the app spec fixes the entities, access
  patterns, and non-functional targets (scale, consistency, retention) that `data-modeling` §0
  turns into a schema and a datastore choice. Model to the spec, not to a blank page.
- **`devkit:cloud-infrastructure`** *provisions the database service* (managed Postgres/RDS/Cloud
  SQL, networking, IAM, secrets, backups-as-infra) via IaC. This section decides *what* to run and
  *how* to configure it; that section stands the service up and wires credentials in through the
  secret store rather than into code.
- **`devkit:containerization`** runs Postgres as a local dev dependency — its Compose example
  (named volume for data, `pg_isready` healthcheck, readiness gating) is the standard way to get a
  database next to the app for development. Never bind-mount a DB data dir on macOS/Windows.
- **`devkit:kubernetes`** is where the *application* runs against a managed database. Prefer a
  managed DB service over self-hosting stateful Postgres in-cluster; if you must run it in K8s, use
  a StatefulSet + operator and treat backups/PITR from `operations-and-tuning` §8 as mandatory.

## How the two skills relate

**data-modeling** (shape the data → choose the datastore → keys & constraints → query patterns) →
**operations-and-tuning** (index those queries → migrate the schema safely → pool connections →
pick isolation → secure and back up). The key/relationship decisions in the first skill are
exactly the index and foreign-key decisions in the second — design them knowing they'll be
enforced and tuned later.
