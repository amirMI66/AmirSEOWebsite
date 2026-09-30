-- Table for contact-form leads (already created in the amir-seo-leads D1 database).
CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  website TEXT,
  service TEXT,
  message TEXT NOT NULL,
  country TEXT,
  user_agent TEXT
);
