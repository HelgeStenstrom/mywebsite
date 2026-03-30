CREATE TABLE countries
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
);

CREATE TABLE grapes
(
    id    INTEGER PRIMARY KEY AUTOINCREMENT,
    name  TEXT UNIQUE,
    color TEXT
);

CREATE TABLE members
(
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    given     TEXT,
    surname   TEXT,
    is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE wine_types
(
    id   INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT
);

CREATE TABLE wine_tastings
(
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    title        TEXT,
    notes        TEXT,
    tasting_date TEXT NOT NULL,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE wines
(
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    country_id     INTEGER NOT NULL,
    name           TEXT    NOT NULL,
    wine_type_id   INTEGER,
    systembolaget  INTEGER,
    volume         INTEGER,
    created_at     DATETIME DEFAULT CURRENT_TIMESTAMP,
    vintage_year   INTEGER,
    is_non_vintage INTEGER  NOT NULL DEFAULT 0
);

CREATE TABLE wine_grapes
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    wine_id    INTEGER NOT NULL,
    grape_id   INTEGER NOT NULL,
    percentage REAL,
    FOREIGN KEY (wine_id) REFERENCES wines (id),
    FOREIGN KEY (grape_id) REFERENCES grapes (id)
);

CREATE INDEX wine_grapes_grape_id ON wine_grapes (grape_id);
CREATE INDEX wine_grapes_wine_id ON wine_grapes (wine_id);

CREATE TABLE wine_tasting_hosts
(
    wine_tasting_id INTEGER NOT NULL,
    member_id       INTEGER NOT NULL,
    PRIMARY KEY (wine_tasting_id, member_id)
);

CREATE TABLE wine_tasting_wines
(
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    wine_tasting_id INTEGER NOT NULL,
    wine_id         INTEGER NOT NULL,
    position        INTEGER,
    purchase_price  INTEGER,
    average_score   REAL,
    FOREIGN KEY (wine_tasting_id) REFERENCES wine_tastings (id),
    FOREIGN KEY (wine_id) REFERENCES wines (id)
);

CREATE INDEX wine_tasting_wines_wine_id ON wine_tasting_wines (wine_id);
CREATE INDEX wine_tasting_wines_wine_tasting_id ON wine_tasting_wines (wine_tasting_id);

CREATE TABLE scores
(
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    tasting_id INTEGER NOT NULL,
    member_id  INTEGER NOT NULL,
    position   INTEGER NOT NULL,
    score      REAL    NOT NULL
);