CREATE TABLE IF NOT EXISTS countries
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL
);

CREATE TABLE IF NOT EXISTS wine_types
(
    id   INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(20) NULL
);

CREATE TABLE IF NOT EXISTS grapes
(
    id    INT AUTO_INCREMENT PRIMARY KEY,
    name  TEXT NULL,
    color ENUM ('blå', 'grön') NULL,
    CONSTRAINT grapes_pk UNIQUE (name) USING HASH
);

CREATE TABLE IF NOT EXISTS members
(
    id        INT AUTO_INCREMENT PRIMARY KEY,
    given     TEXT NULL,
    surname   TEXT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS wine_tastings
(
    id           INT AUTO_INCREMENT PRIMARY KEY,
    title        VARCHAR(128)                         NULL,
    notes        LONGTEXT                             NULL,
    tasting_date DATE                                 NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS wines
(
    id             INT AUTO_INCREMENT PRIMARY KEY,
    country_id     INT                                  NOT NULL,
    name           VARCHAR(256)                         NOT NULL,
    wine_type_id   INT                                  NULL,
    systembolaget  INT                                  NULL,
    volume         INT                                  NULL,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP   NULL,
    vintage_year   INT                                  NULL,
    is_non_vintage TINYINT(1) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS wine_grapes
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    wine_id    INT           NOT NULL,
    grape_id   INT           NOT NULL,
    percentage DECIMAL(5, 2) NULL,
    CONSTRAINT wine_grapes_ibfk_1 FOREIGN KEY (wine_id) REFERENCES wines (id),
    CONSTRAINT wine_grapes_ibfk_2 FOREIGN KEY (grape_id) REFERENCES grapes (id)
);

CREATE INDEX grape_id ON wine_grapes (grape_id);
CREATE INDEX wine_id ON wine_grapes (wine_id);

CREATE TABLE IF NOT EXISTS wine_tasting_hosts
(
    wine_tasting_id INT NOT NULL,
    member_id       INT NOT NULL,
    PRIMARY KEY (wine_tasting_id, member_id)
);

CREATE TABLE IF NOT EXISTS wine_tasting_wines
(
    id              INT AUTO_INCREMENT PRIMARY KEY,
    wine_tasting_id INT           NOT NULL,
    wine_id         INT           NOT NULL,
    position        INT           NULL,
    purchase_price  INT           NULL,
    average_score   DECIMAL(4, 2) NULL,
    CONSTRAINT wine_tasting_wines_ibfk_1 FOREIGN KEY (wine_tasting_id) REFERENCES wine_tastings (id),
    CONSTRAINT wine_tasting_wines_ibfk_2 FOREIGN KEY (wine_id) REFERENCES wines (id)
);

CREATE INDEX wine_tasting_wines_wine_id ON wine_tasting_wines (wine_id);
CREATE INDEX wine_tasting_wines_wine_tasting_id ON wine_tasting_wines (wine_tasting_id);

CREATE TABLE IF NOT EXISTS scores
(
    id         INT AUTO_INCREMENT PRIMARY KEY,
    tasting_id INT           NOT NULL,
    member_id  INT           NOT NULL,
    position   INT           NOT NULL,
    score      DECIMAL(4, 1) NOT NULL
);