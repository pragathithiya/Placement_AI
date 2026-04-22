CREATE TABLE IF NOT EXISTS placements (
    id TEXT PRIMARY KEY,
    image_path TEXT,
    company_name TEXT,
    extracted_data TEXT, -- JSON string
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    placement_id TEXT,
    role TEXT, -- 'user' or 'assistant'
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(placement_id) REFERENCES placements(id)
);
