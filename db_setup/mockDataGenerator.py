'''
This script produces mock data that can be inserted into a database.

@author Luka Kralj
'''

from random import randint

patient_header = "INSERT INTO Patient (patient_no, name, surname, email, phone) VALUES "
carer_header = "INSERT INTO Carer (patient_no, carer_name, email, phone, relationship) VALUES "
lab_header = "INSERT INTO Laboratory (lab_id, name, email) VALUES "
test_header = "INSERT INTO Test (patient_no, first_due_date, frequency, laboratory, completed) VALUES "

patient_numbers = []
for i in range(200):
    patient_numbers.append(randint(0, 1000000))

patient_numbers = list(set(patient_numbers))

phone_numbers = []
for i in range(300):
    phone_numbers.append(randint(7000000000, 7999999999))

phone_numbers = list(set(phone_numbers))

def generateDate():
    year = "2018"
    if (randint(0,3) == 0):
        year = "2019"

    month = str(randint(1,13))
    if (len(month) == 1):
        month = "0" + month

    day = str(randint(1,28))
    if (len(day) == 1):
        day = "0" + day

    return year + month + day


#####################################################
patients = ""
for num in patient_numbers:
    num = str(num)
    patients += patient_header  \
        + "(" + num \
        + ", name" + num    \
        +  ", surname" + num    \
        + ", patient" + num + "@gmail.com, "

    if (len(phone_numbers) > 0):
        patients += str(phone_numbers.pop())
    else:
        patients += "NULL"

    patients += ")\n"
#####################################################
carers = ""
for i in range(100):
    i = str(i)
    pat_no = patient_numbers[randint(0, len(patient_numbers) - 1)]
    carers += carer_header  \
        + "(" + str(pat_no) \
        + ", carer" + i    \
        + ", carer" + i + "@gmail.com, "

    if (len(phone_numbers) > 0):
        carers += str(phone_numbers.pop())
    else:
        carers += "NULL"

    rel = ["father", "mother", "uncle", "grandparent"]
    carers += ", " + rel.pop(randint(0, len(rel) - 1)) + ")\n"
#####################################################
labs = ""
for i in range(10):
    i = str(i)
    labs += lab_header  \
        + "(" + i \
        + ", lab" + i    \
        + ", lab" + i + "@gmail.com)\n"
#####################################################
tests = ""
for i in range(100):
    pat_no = patient_numbers[randint(0, len(patient_numbers) - 1)]
    tests += test_header  \
        + "(" + str(pat_no) \
        + ", " + generateDate()    \
        + ", weekly"    \
        + ", " + str(randint(0,9))

    completed = ["yes", "no", "in review"]
    tests += ", " + completed[randint(0,len(completed) - 1)] + ")\n"
#####################################################

file = open("insert.sql", "w+")
file.write(patients + "\n" + carers + "\n" + labs + "\n" + tests)
file.close()
