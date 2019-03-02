-- ====================================================
-- Please refer to the database documentation
-- for more explaination about the schema.
--
-- N.B. This is the development schema only
--      as it deletes all data before being recreated.
-- ====================================================


CREATE DATABASE IF NOT EXISTS BloodTestDB;

USE BloodTestDB;

-- Create user that is used in the DBMS to avoid using root.
GRANT ALL PRIVILEGES ON BloodTestDB.*
    TO 'bloodTestAdmin'@localhost
    IDENTIFIED BY "Blood_admin1";


DROP TABLE IF EXISTS Test;
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS Carer;
DROP TABLE IF EXISTS Hospital;
DROP TABLE IF EXISTS TokenControl;
DROP TABLE IF EXISTS ActionLog;
DROP TABLE IF EXISTS LoginCredentials;

CREATE TABLE Hospital (
    hospital_id INTEGER AUTO_INCREMENT,
    hospital_name VARCHAR(255),
    hospital_email VARCHAR(100) NOT NULL,
    hospital_phone VARCHAR(15),
    PRIMARY KEY (hospital_id)
);

CREATE TABLE Carer (
    carer_id INTEGER AUTO_INCREMENT,
    carer_name VARCHAR(100),
    carer_surname VARCHAR(100),
    carer_email VARCHAR(100) NOT NULL,
    carer_phone VARCHAR(15),
    relationship VARCHAR(255),
    PRIMARY KEY (carer_id)
);

CREATE TABLE Patient (
    patient_no VARCHAR(20),
    patient_name VARCHAR(100) NOT NULL,
    patient_surname VARCHAR(100) NOT NULL,
    patient_email VARCHAR(100),
    patient_phone VARCHAR(15),
    hospital_id INTEGER,
    carer_id INTEGER,
    additional_info TEXT,
    PRIMARY KEY (patient_no),
    FOREIGN KEY (hospital_id) REFERENCES Hospital(hospital_id),
    FOREIGN KEY (carer_id) REFERENCES Carer(carer_id)
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
    PRIMARY KEY (test_id),
    FOREIGN KEY (patient_no) REFERENCES Patient(patient_no),
);

-- ================================
-- Tables below are do not store any core
-- data. They only provide additional functionality.
-- ================================

CREATE TABLE TokenControl (
    token VARCHAR(50),
    table_name ENUM("Carer", "Hospital", "Patient", "Test") NOT NULL,
    table_key VARCHAR(50) NOT NULL,
    expiration DATETIME NOT NULL,
    PRIMARY KEY (token)
);

CREATE TABLE LoginCredentials (
    username VARCHAR(100),
    hashed_password VARCHAR(100) NOT NULL,
    recovery_email VARCHAR(100) NOT NULL,
    PRIMARY KEY (username)
);

CREATE TABLE ActionLog (
    action_id INTEGER AUTO_INCREMENT,
    username VARCHAR(100) NOT NULL,
    action_timestamp DATETIME NOT NULL,
    action_type ENUM("insert", "update", "delete") NOT NULL,
    table_affected ENUM("Carer", "Hospital", "Patient", "Test") NOT NULL,
    entry_affected VARCHAR(50) NOT NULL,
    additional_info TEXT,
    PRIMARY KEY (action_id),
    FOREIGN KEY (username) REFERENCES LoginCredentials(username)
);