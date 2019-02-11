
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

CREATE TABLE Laboratory (
    lab_id INTEGER,
    lab_name VARCHAR(255),
    lab_email VARCHAR(255),
    lab_phone VARCHAR(10),
    PRIMARY KEY (lab_id)
);

CREATE TABLE Patient (
    patient_no VARCHAR(10),
    patient_name VARCHAR(255) NOT NULL,
    patient_surname VARCHAR(255) NOT NULL,
    patient_email VARCHAR(255) DEFAULT NULL,
    patient_phone VARCHAR(10) DEFAULT NULL,
    prefered_lab INTEGER DEFAULT NULL,
    PRIMARY KEY (patient_no),
    FOREIGN KEY (prefered_lab) REFERENCES Laboratory(lab_id)
);

CREATE TABLE Carer (
    patient_no VARCHAR(10),
    carer_name VARCHAR(255) NOT NULL,
    carer_email VARCHAR(255) DEFAULT NULL,
    carer_phone VARCHAR(10) DEFAULT NULL,
    relationship VARCHAR(100) DEFAULT "unknown",
    PRIMARY KEY (patient_no, carer_name),
    FOREIGN KEY (patient_no) REFERENCES Patient(patient_no)
);

CREATE TABLE Test (
    test_id INTEGER AUTO_INCREMENT,
    patient_no VARCHAR(10) NOT NULL,
    first_due_date DATE NOT NULL,
    frequency VARCHAR(100) not NULL,
    laboratory INTEGER DEFAULT NULL,
    completed ENUM("yes", "no", "in review") NOT NULL DEFAULT "in review",
    notes TEXT DEFAULT NULL,
    PRIMARY KEY (test_id),
    FOREIGN KEY (patient_no) REFERENCES Patient(patient_no),
    FOREIGN KEY (laboratory) REFERENCES Laboratory(lab_id)
);