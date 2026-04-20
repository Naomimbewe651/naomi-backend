const mysql = require('mysql2/promise');

async function setup() {
  const connection = await mysql.createConnection('mysql://root:NBlGjkwytrtaiTmPKnFaGwQEAJcpEAIH@switchyard.proxy.rlwy.net:28862/railway');
  
  await connection.query(`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
      first_name  VARCHAR(100)     NOT NULL,
      last_name   VARCHAR(100)     NOT NULL DEFAULT '',
      email       VARCHAR(255)     NOT NULL,
      subject     VARCHAR(255)     NOT NULL DEFAULT '',
      message     TEXT             NOT NULL,
      ip_address  VARCHAR(45)      DEFAULT NULL,
      status      ENUM('new','read','replied') NOT NULL DEFAULT 'new',
      created_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);

  console.log('✅ Table created successfully!');
  await connection.end();
}

setup().catch(e => console.log('❌ Error:', e.message));