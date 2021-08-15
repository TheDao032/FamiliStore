set pg_env="C:\Program Files\PostgreSQL\12\bin"
%pg_env%\dropdb.exe -h localhost -p 5432 -U postgres -d FamilyStore_db
%pg_env%\createdb.exe -h localhost -p 5432 -U postgres -d FamilyStore_db
%pg_env%\psql.exe -h localhost -p 5432 -U postgres -d FamilyStore_db < FamilyStore_DB.sql
pause
