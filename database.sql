-- ============================================================
--  Naomi Mbewe Portfolio — Database Setup
--  Run this in phpMyAdmin → SQL tab  (or via mysql CLI)
-- ============================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS naomi_portfolio
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE naomi_portfolio;

-- 2. Create the contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  first_name  VARCHAR(100)     NOT NULL,
  last_name   VARCHAR(100)     NOT NULL DEFAULT '',
  email       VARCHAR(255)     NOT NULL,
  subject     VARCHAR(255)     NOT NULL DEFAULT '',
  message     TEXT             NOT NULL,
  ip_address  VARCHAR(45)      DEFAULT NULL,   -- supports IPv6
  status      ENUM('new','read','replied')
              NOT NULL DEFAULT 'new',
  created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP
              ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  INDEX idx_email      (email),
  INDEX idx_status     (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ────────────────────────────────────────────────────────────
-- Optional: view all submissions ordered by newest first
-- SELECT * FROM contact_submissions ORDER BY created_at DESC;
-- ────────────────────────────────────────────────────────────
