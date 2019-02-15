## How to populate a local database:

1. Open terminal as a root user (so you can access mySQL).
2. Setup DB schema by running: `[sudo] mysql -u root -p < path/server/database/schema.sql`
3. If the schema was sucessfully setup (no output), insert data by running: `[sudo] mysql -u root -p < path/server/database/insert.sql`

A new users is created that is used for access the database from within the app. This is to prevent accidental damanging of other databases that you might have on your computer. This user only has access to the our database (not root access to entire mySQL server).

Credentials:
- database name: BloodTestDB
- host: localhost
- username: bloodTestAdmin
- password: Blood_admin1 (numer one as the last character)
