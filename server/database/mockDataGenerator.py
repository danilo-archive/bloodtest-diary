'''
This script produces mock data that can be inserted into a database.

@author Luka Kralj
'''

from random import randint

file_header = """-- This is a generated file. Please, do not modify it manually.

USE BloodTestDB;

DELETE FROM Carer;
DELETE FROM Test;
DELETE FROM Patient;
DELETE FROM Laboratory;
DELETE FROM TokenControl;

"""

patient_header = "INSERT INTO Patient (patient_no, patient_name, patient_surname, patient_email, patient_phone, lab_id) VALUES "
carer_header = "INSERT INTO Carer (patient_no, carer_name, carer_email, carer_phone, relationship) VALUES "
lab_header = "INSERT INTO Laboratory (lab_id, lab_name, lab_email) VALUES "
test_header = "INSERT INTO Test (patient_no, added, first_due_date, frequency, lab_id, completed_status, completed_date) VALUES "

patient_numbers = []
for i in range(200):
    patient_numbers.append(randint(1, 1000000))

patient_numbers = list(set(patient_numbers))

phone_numbers = []
for i in range(300):
    phone_numbers.append(randint(7000000000, 7999999999))

phone_numbers = list(set(phone_numbers))

# Generate a tuple of [added, first_due_date, completed_date]
def generateDates():
    year = 2019
    month = randint(1,3)
    if (randint(0,3) == 0):
        year = 2018
        month = randint(10,12)

    
    day = randint(1,28)

    added = str(year) + pad(month) + pad(day)

    if (day <= 21):
        day += 7
    else:
        day += 7 - 28
        month += 1
        if (month == 13):
            month = 1
            year+=1
    
    first_due_date = str(year) + pad(month) + pad(day)

    if (randint(0,3) == 0):
        return [added, first_due_date, "NULL"] # patient haven't completed the test
    
    if (randint(0,2) == 0):
        return [added, first_due_date, first_due_date] # patient has completed the test on time
    
    if (day <= 18):
        day += 10
    else:
        day += 10 - 28
        month += 1
        if (month == 13):
            month = 1
            year+=1

    completed_date = str(year) + pad(month) + pad(day)

    return [added, first_due_date, completed_date]


# pad with a leading zero
def pad(num):
    if (num < 10):
        return "0" + str(num)
    return str(num)

#####################################################
patients = ""
for num in patient_numbers:
    num = str(num)
    patients += patient_header  \
        + "('" + num \
        + "', 'name" + num    \
        +  "', 'surname" + num    \
        + "', 'patient" + num + "@gmail.com', "

    if (len(phone_numbers) > 0):
        patients += "'" + str(phone_numbers.pop()) + "'"
    else:
        patients += "NULL"

    patients += ", " + str(randint(1,10)) + ");\n"

print("Generated patients...")
#####################################################
carers = ""
for i in range(100):
    i = str(i)
    pat_no = patient_numbers[randint(0, len(patient_numbers) - 1)]
    carers += carer_header  \
        + "(" + str(pat_no) \
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
labs = ""
for i in range(1,11):
    i = str(i)
    labs += lab_header  \
        + "(" + i \
        + ", 'lab" + i    \
        + "', 'lab" + i + "@gmail.com');\n"

print("Generated labs...")
#####################################################
tests = ""
for i in range(100):
    pat_no = patient_numbers[randint(0, len(patient_numbers) - 1)]
    dates = generateDates()
    tests += test_header  \
        + "(" + str(pat_no) \
        + ", " + dates[0]    \
        + ", " + dates[1]    \
        + ", 'weekly'"    \
        + ", " + str(randint(1,10))

    if (dates[2] == "NULL"):
        tests += ", 'no', NULL);\n"
    else:
        completed = ["yes", "in review"]
        tests += ", '" + completed[randint(0,len(completed) - 1)] + "', " + dates[2] + ");\n"

print("Generated tests...")
#####################################################

print("Writing to file...")

file = open("insert.sql", "w+")
file.write(file_header + labs + "\n" + patients + "\n" + carers + "\n" + tests)
file.close()

print("Success!")