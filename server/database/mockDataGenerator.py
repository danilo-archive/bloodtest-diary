'''
This script produces mock data that can be inserted into a database.

@author Luka Kralj
'''

from random import randint

file_header = """-- This is a generated file. Please, do not modify it manually.

USE BloodTestDB;

DELETE FROM Test;
DELETE FROM Patient;
DELETE FROM Carer;
DELETE FROM Hospital;
DELETE FROM EditTokens;
DELETE FROM ActionLog;
DELETE FROM LoginCredentials;

INSERT INTO User VALUES ("admin","f0edc3ac2daf24876a782e9864e9596970a8b8717178e705cd70726b92dbfc58c8e8fb27f7082239969496d989ff65d0bb2fcc3bd91c3a0251fa221ca2cd88a5","yes","d50dbbbe33c2d3c545051917b6a60ccd577a1a3f1a96dfac95199e7b0de32841",'1268',"gmail@gmail.com");
INSERT INTO User VALUES ("admin1","f0edc3ac2daf24876a782e9864e9596970a8b8717178e705cd70726b92dbfc58c8e8fb27f7082239969496d989ff65d0bb2fcc3bd91c3a0251fa221ca2cd88a5","no","d50dbbbe33c2d3c545051917b6a60ccd577a1a3f1a96dfac95199e7b0de32841",'1268',"gmail@gmail.com");

"""

patient_header = "INSERT INTO Patient (patient_no, patient_name, patient_surname, patient_email, patient_phone, carer_id, hospital_id) VALUES "
carer_header = "INSERT INTO Carer (carer_id, carer_name, carer_email, carer_phone, relationship) VALUES "
hospital_header = "INSERT INTO Hospital (hospital_id, hospital_name, hospital_email) VALUES "
test_header = "INSERT INTO Test (patient_no, due_date, frequency, occurrences, completed_status, completed_date) VALUES "

patient_numbers = []
for i in range(500):
    patient_numbers.append("P" + str(randint(1, 1000000)))

patient_numbers = list(set(patient_numbers))

phone_numbers = []
for i in range(500):
    phone_numbers.append(randint(7000000000, 7999999999))

phone_numbers = list(set(phone_numbers))

# Generate a tuple of [due_date, completed_date]
def generateDates():
    year = 2019
    month = randint(1,3)
    if (randint(0,3) == 0):
        year = 2018
        month = randint(10,12)

    
    day = randint(1,28)

    due_date = str(year) + pad(month) + pad(day)

    if (randint(0,3) == 0):
        return [due_date, "NULL"] # patient hasn't completed the test
    
    if (randint(0,2) == 0):
        return [due_date, due_date] # patient has completed the test on time
    
    if (day <= 18):
        day += 10
    else:
        day += 10 - 28
        month += 1
        if (month == 13):
            month = 1
            year+=1

    completed_date = str(year) + pad(month) + pad(day)

    return [due_date, completed_date]


# pad with a leading zero
def pad(num):
    if (num < 10):
        return "0" + str(num)
    return str(num)


#####################################################
carers = ""
for i in range(1, 601):
    i = str(i)
    carers += carer_header  \
        + "(" + i \
        + ", 'carer" + i    \
        + "', 'carer" + i + "@gmail.com', "

    if (len(phone_numbers) > 0):
        carers += "'" + str(phone_numbers.pop()) + "'"
    else:
        carers += "NULL"

    rel = ["father", "mother", "uncle", "grandparent"]
    carers += ", '" + rel.pop(randint(0, len(rel) - 1)) + "');\n"

print("Generated carers...")
#####################################################
hospitals = ""
for i in range(1,601):
    i = str(i)
    hospitals += hospital_header  \
        + "(" + i \
        + ", 'hospital" + i    \
        + "', 'hospital" + i + "@gmail.com');\n"

print("Generated hospitals...")
#####################################################
patients = ""
for num in patient_numbers:
    patients += patient_header  \
        + "('" + num \
        + "', 'name" + num    \
        +  "', 'surname" + num

    if (randint(0,3) == 0):
        # no email, no phone
        patients += "', NULL, NULL, "

        # needs carer
        patients += str(randint(1,600)) + ", "
    else:
        patients += "', 'patient" + num + "@gmail.com', "
        if (len(phone_numbers) > 0):
            patients += "'" + str(phone_numbers.pop()) + "', "
        else:
            patients += "NULL, "

        # no carer
        patients += "NULL, "

    if (randint(0,6) == 0):
        # client's patient
        patients += "NULL);\n"
    else:
        patients += str(randint(1,600)) + ");\n"

print("Generated patients...")
#####################################################
tests = ""
for i in range(400):
    pat_no = patient_numbers[randint(0, len(patient_numbers) - 1)]
    dates = generateDates()
    tests += test_header  \
        + "('" + str(pat_no) \
        + "', " + dates[0] + ", "   

    rand = randint(0, 5)
    # decide frequency + occurrences
    if (rand == 0):
        tests += "NULL, 1"
    elif (rand == 1):
        tests += "'10-D', " + str(randint(3, 10))
    elif (rand == 2):
        tests += "'2-W', " + str(randint(2, 8)) 
    elif (rand == 3):
        tests += "'4-W', " + str(randint(2, 10))
    elif (rand == 4):
        tests += "'26-W', " + str(randint(2, 5))
    elif (rand == 5):
        tests += "'1-Y', " + str(randint(2, 4))

    if (dates[1] == "NULL"):
        tests += ", 'no', NULL);\n"
    else:
        completed = ["yes", "in review"]
        tests += ", '" + completed[randint(0,len(completed) - 1)] + "', " + dates[1] + ");\n"

print("Generated tests...")
#####################################################

print("Writing to file...")

file = open("insert.sql", "w+")
file.write(file_header + hospitals + "\n" + carers + "\n" + patients + "\n" + tests)
file.close()

print("Success!")