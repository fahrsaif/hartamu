import { db } from "$lib/db";

await db.sql`
--
-- Cleanup: Drop the previous 'todos' table entirely, as it is no longer needed.
--
DROP TABLE IF EXISTS todos;

--
-- Table 1: categories (Lookup table for expense types)
--
CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE,
    description TEXT
);

--
-- Table 2: expenses (Main table for recording transactions)
--
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

-- Optional: Create a few default categories for quick setup
INSERT INTO categories (name) VALUES 
('Groceries'),
('Utilities'),
('Rent'),
('Transportation'),
('Entertainment'),
('Salary');
`