CREATE TABLE IF NOT EXISTS users
(
    id            INT AUTO_INCREMENT PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT         NOT NULL,
    member_id     INT          NULL REFERENCES members (id),
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);