CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(255) NOT NULL CHECK(username <> ''),
    email VARCHAR(255) UNIQUE NOT NULL CHECK(email <> ''),
    password VARCHAR(255) NOT NULL CHECK(password <> ''),
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);