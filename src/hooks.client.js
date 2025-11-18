import { db } from "$lib/db";
import '@tabler/core/dist/js/tabler.min.js';

await db.sql`
CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS expenses (
    expense_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id     INTEGER NOT NULL,
    date            TEXT    NOT NULL, -- Stored as ISO 8601 text format (YYYY-MM-DD HH:MM:SS)
    amount          REAL    NOT NULL, -- Use REAL for decimal amounts
    description     TEXT,
    
    -- Optional: useful for tracking when the record was created
    created_at      TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
    
    -- Foreign Key Constraint
    FOREIGN KEY (category_id)
        REFERENCES categories (category_id)
        ON DELETE RESTRICT -- Prevents deleting a category if expenses are still linked
);
`