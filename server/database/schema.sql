-- ====================================================
-- Please refer to the database documentation
-- for more explaination about the schema.
--
-- N.B. This is the development schema only
--      as it deletes all data before being recreated.
--
-- @author Luka Kralj
-- ====================================================


CREATE DATABASE IF NOT EXISTS BloodTestDB;

USE BloodTestDB;

-- Create user that is used in the DBMS to avoid using root.

CREATE USER IF NOT EXISTS 'bloodTestAdmin'@'localhost'
    IDENTIFIED WITH mysql_native_password BY "Blood_admin1";
GRANT ALL PRIVILEGES ON BloodTestDB.*
    TO 'bloodTestAdmin'@'localhost';


DROP TABLE IF EXISTS Test;
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS Carer;
DROP TABLE IF EXISTS Hospital;
DROP TABLE IF EXISTS EditTokens;
DROP TABLE IF EXISTS AccessTokens;
DROP TABLE IF EXISTS ActionLog;
DROP TABLE IF EXISTS User;

CREATE TABLE Hospital (
    hospital_id INTEGER AUTO_INCREMENT,
    hospital_name VARCHAR(255),
    hospital_email VARCHAR(100),
    hospital_phone VARCHAR(15),
    PRIMARY KEY (hospital_id)
);

CREATE TABLE Carer (
    carer_id INTEGER AUTO_INCREMENT,
    carer_name VARCHAR(100),
    carer_surname VARCHAR(100),
    carer_email VARCHAR(100),
    carer_phone VARCHAR(15),
    relationship VARCHAR(255),
    PRIMARY KEY (carer_id)
);

CREATE TABLE Patient (
    patient_no VARCHAR(20),
    patient_name VARCHAR(100),
    patient_surname VARCHAR(100),
    patient_email VARCHAR(100),
    patient_phone VARCHAR(15),
    hospital_id INTEGER,
    carer_id INTEGER,
    additional_info TEXT,
    patient_colour VARCHAR(10),
    isAdult ENUM("yes", "no") NOT NULL DEFAULT "yes",
    PRIMARY KEY (patient_no),
    FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id) ON DELETE SET NULL,
    FOREIGN KEY (carer_id) REFERENCES Carer(carer_id) ON DELETE SET NULL
);

CREATE TABLE Test (
    test_id INTEGER AUTO_INCREMENT,
    patient_no VARCHAR(20) NOT NULL,
    due_date DATE NOT NULL,
    frequency VARCHAR(10),
    occurrences INTEGER NOT NULL DEFAULT 1,
    completed_status ENUM("yes", "no", "in review") NOT NULL DEFAULT "no",
    completed_date DATE,
    notes TEXT,
    test_colour VARCHAR(10),
    last_reminder DATE,
    reminders_sent INTEGER DEFAULT 0,
    PRIMARY KEY (test_id),
    FOREIGN KEY (patient_no) REFERENCES Patient(patient_no) ON DELETE CASCADE
);

CREATE TABLE User (
    username VARCHAR(100),
    hashed_password VARCHAR(255) NOT NULL,
    isAdmin ENUM("yes", "no") NOT NULL DEFAULT "no",
    salt VARCHAR(255) NOT NULL,
    iterations INTEGER NOT NULL,
    recovery_email VARCHAR(100) NOT NULL,
    PRIMARY KEY (username)
);

-- ================================
-- Tables below are do not store any core
-- data. They only provide additional functionality.
-- ================================

CREATE TABLE EditTokens (
    token VARCHAR(100),
    table_name ENUM("Carer", "Hospital", "Patient", "Test", "User") NOT NULL,
    table_key VARCHAR(50) NOT NULL,
    expiration DATETIME NOT NULL,
    PRIMARY KEY (token)
);

CREATE TABLE AccessTokens (
    token VARCHAR(255),
    username VARCHAR(100) NOT NULL,
    expiration DATETIME NOT NULL,
    PRIMARY KEY (token),
    FOREIGN KEY (username) REFERENCES User(username)
);

CREATE TABLE ActionLog (
    action_id INTEGER AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    action_timestamp DATETIME(3) NOT NULL,
    action_type ENUM("insert", "update", "delete", "other") NOT NULL,
    table_affected ENUM("Carer", "Hospital", "Patient", "Test", "User") NOT NULL,
    entry_affected VARCHAR(50) NOT NULL,
    additional_info TEXT,
    PRIMARY KEY (action_id),
    FOREIGN KEY (username) REFERENCES User(username)
);
