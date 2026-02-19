-- we don't know how to generate root <with-no-name> (class Root) :(

# CREATE DATABASE hartappat;
# USE hartappat;

create table TastingParticipation
(
    id      int auto_increment
        primary key,
    member  int null,
    tasting int null
)
    comment 'Vem som deltog i vilken provning' engine = InnoDB;

create table countries
(
    id   int auto_increment
        primary key,
    name varchar(40) not null
)
    engine = InnoDB;

create table dictionary
(
    en varchar(32) null,
    sv varchar(32) null
)
    engine = InnoDB;

create table grapes
(
    id    int auto_increment
        primary key,
    name  text                 null,
    color enum ('blå', 'grön') null,
    constraint grapes_pk
        unique (name) using hash
)
    engine = InnoDB;

create table members
(
    id      int auto_increment
        primary key,
    given   text null,
    surname text null
)
    engine = InnoDB;

create table tasting
(
    id    int auto_increment
        primary key,
    title varchar(128) null,
    notes longtext     null,
    date  date         null
)
    comment 'En vinprovning, med deltagare, viner, kommentarer' engine = InnoDB;

create table wines
(
    id            int auto_increment
        primary key,
    country       int          not null,
    Name          varchar(256) not null,
    winetype      int          null,
    systembolaget int          null,
    volume        int          null comment 'Voume in ml'
)
    engine = InnoDB;

create table winetypes
(
    id int auto_increment
        primary key,
    sv varchar(20) not null,
    en varchar(20) not null
)
    engine = InnoDB;

