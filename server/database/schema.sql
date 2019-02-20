
CREATE DATABASE IF NOT EXISTS BloodTestDB;

USE BloodTestDB;

-- Create user that is used in the DBMS to avoid using root.
GRANT ALL PRIVILEGES ON BloodTestDB.*
    TO 'bloodTestAdmin'@localhost
    IDENTIFIED BY "Blood_admin1";


-- Clean database in case it has been modified manually.
DROP TABLE IF EXISTS Carer;
DROP TABLE IF EXISTS Test;
DROP TABLE IF EXISTS Patient;
DROP TABLE IF EXISTS Laboratory;
DROP TABLE IF EXISTS TokenControl;

CREATE TABLE Laboratory (
    lab_id INTEGER AUTO_INCREMENT,
    lab_name VARCHAR(255),
    lab_email VARCHAR(255),
    lab_phone VARCHAR(10),
    PRIMARY KEY (lab_id)
);

CREATE TABLE Patient (
    patient_no VARCHAR(10),
    patient_name VARCHAR(255) NOT NULL,
    patient_surname VARCHAR(255) NOT NULL,
    patient_email VARCHAR(255),
    patient_phone VARCHAR(10),
    lab_id INTEGER,
    PRIMARY KEY (patient_no),
    FOREIGN KEY (lab_id) REFERENCES Laboratory(lab_id)
);

CREATE TABLE Carer (
    carer_id INTEGER AUTO_INCREMENT,
    patient_no VARCHAR(10),
    carer_name VARCHAR(255),
    carer_email VARCHAR(255),
    carer_phone VARCHAR(10),
    relationship VARCHAR(100),
    PRIMARY KEY (carer_id),
    FOREIGN KEY (patient_no) REFERENCES Patient(patient_no),
    INDEX patient_no (patient_no)
);

CREATE TABLE Test (
    test_id INTEGER AUTO_INCREMENT,
    patient_no VARCHAR(10) NOT NULL,
    added DATE NOT NULL,
    first_due_date DATE NOT NULL,
    frequency VARCHAR(100) NOT NULL,
    lab_id INTEGER,
    completed_status ENUM("yes", "no", "in review") NOT NULL DEFAULT "no",
    completed_date DATE,
    notes TEXT,
    PRIMARY KEY (test_id),
    FOREIGN KEY (patient_no) REFERENCES Patient(patient_no),
    FOREIGN KEY (lab_id) REFERENCES Laboratory(lab_id)
);

CREATE TABLE TokenControl (
    token VARCHAR(50),
    table_name ENUM("Carer", "Laboratory", "Patient", "Test") NOT NULL,
    table_key VARCHAR(50) NOT NULL,
    expiration DATETIME NOT NULL,
    PRIMARY KEY (token)
);