import { db } from "$lib/db";
import '@tabler/core/dist/js/tabler.min.js';

await db.sql`
CREATE TABLE IF NOT EXISTS wallets (
    wallet_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL UNIQUE, -- e.g., 'Main Checking', 'Cash', 'Credit Card'
    type        TEXT,                    -- e.g., 'Bank', 'Cash', 'Credit'
    initial_balance REAL DEFAULT 0.00,
    current_balance REAL DEFAULT 0.00,   -- Balance calculated by app logic (optional field, often calculated)
    created_at  TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now'))
);

CREATE TABLE IF NOT EXISTS categories (
    category_id INTEGER PRIMARY KEY AUTOINCREMENT,
    type        TEXT    NOT NULL CHECK (type IN ('Expense', 'Income')), -- Enforces type to be 'Expense' or 'Income'
    name        TEXT    NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE IF NOT EXISTS expenses (
    expense_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    wallet_id       INTEGER NOT NULL, -- NEW FOREIGN KEY
    category_id     INTEGER NOT NULL,
    date            TEXT    NOT NULL, -- Stored as ISO 8601 text format (YYYY-MM-DD HH:MM:SS)
    amount          REAL    NOT NULL, -- Use REAL for decimal amounts
    description     TEXT,
    
    created_at      TEXT DEFAULT (strftime('%Y-%m-%d %H:%M:%S', 'now')),
    
    -- Foreign Key Constraints
    FOREIGN KEY (category_id)
        REFERENCES categories (category_id)
        ON DELETE RESTRICT, 
        
    FOREIGN KEY (wallet_id)
        REFERENCES wallets (wallet_id)
        ON DELETE RESTRICT -- Prevents deleting a wallet if expenses are still linked
);
`