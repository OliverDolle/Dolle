---
name: engineering
description: Call before debugging a failure, structuring code for extension, designing a database schema or query, or ESP32 firmware work.
---

# Engineering — router

> Read only the reference(s) below that the task needs. Name which one in a line, then work from it.

| Reference | Read it when |
| --- | --- |
| `systematic-debugging` | A failing program, flaky test, or incident — **before** guessing at a fix. |
| `extensible-architecture` | Shaping a module, adding a feature to rigid code, or planning for plugins and seams. |
| `data-modeling` | Designing a schema or choosing a datastore. Start here when there is no schema yet. |
| `database-operations` | Indexing and `EXPLAIN`, migrations, pooling, transactions, security, backups — or a slow query or deadlock in production. |
| `esp32` | ESP32 firmware — toolchain, flashing and upload failures, dual-core FreeRTOS, GPIO strapping, brownout. |

Paths: `references/<name>.md`. A database that ships needs both database references — key choices
become index choices.

**Binds regardless:** reproduce before you fix, and confirm the root cause with a regression test
that fails first. Schema changes are expand/contract — never rename or drop a column in one deploy.
