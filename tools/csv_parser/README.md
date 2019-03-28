## HOW TO USE THE PARSER
One csv file has been created for each table in the database. The format of these csv must follow this rules:
1. the first row contains the table name in the first column and the names of the name of each field of such column;
2. do NOT leave any blank space between the first line of the csv file and the row mentioned in point 1;
3. insert the database entries as rows under the respective column;
4. avoid leaving blank rows between the last entry-row (the type fo row specified in point 3) and the line mentioned in point 1, as this will result into an empty entry in the database.

**EX**
| |1|2|3|4|
|:----:|:----:|:-----------:|:-------------:|:---------:|
|A|Hospital|hospital_id| hospital_name |    hospital_email 	|
|B|        |     1     |  'hospital1'  |'hospital1@gmail.com'|
|C|        |     2     |  'hospital2'  |'hospital2@gmail.com'|

After all the csv have been filled in, if these files are located in the same folder as  *sql-insertion-config.sql*, just call `node sql-insertion-config.js`, otherwise redefine the path changing the value of *PATH_CSV_FILES* contained in *sql-insertion-config.sql* specifying the correct path, and eventually call  `node sql-insertion-config.js`.