---
description: "Use when designing a database schema, choosing a datastore, or configuring one for production — BEFORE writing DDL or tuning. Two skills: data-modeling (schema, normalization, keys, SQL-vs-NoSQL, ORM patterns) and operations-and-tuning (indexing, EXPLAIN, migrations, pooling, transactions, security, backups). Triggers: 'design a schema', 'data model', 'sql vs nosql', 'add an index', 'slow query', 'database migration', 'connection pool', 'isolation level', 'postgres tuning'."
argument-hint: "[optional task, or a skill: data-modeling | operations-and-tuning]"
---

**A database design or configuration task matches this command — load it before writing DDL,
picking a datastore, or tuning; do not work from memory.** First read the section index at
`${CLAUDE_PLUGIN_ROOT}/packs/database-design/INDEX.md`, then read the skill(s) the task needs:

- `data-modeling/SKILL.md` — designing a schema, normalization vs. denormalization, keys &
  constraints, SQL-vs-NoSQL selection, and ORM/query patterns.
- `operations-and-tuning/SKILL.md` — indexing & EXPLAIN, migrations & versioning, connection
  pooling, transactions & isolation, Postgres tuning, security, and backups/PITR.

If the user named a skill in the argument, focus on that one. Principles are engine-neutral;
Postgres is the worked example.

Then:
1. Confirm in one line which skill(s) you loaded.
2. Summarize the method in 3–5 bullets.
3. If the user provided a task below, start on it — inspect the existing schema/migrations before
   proposing changes.

User task / focus (optional): $ARGUMENTS
