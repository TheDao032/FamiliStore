set pg_env="C:\Program Files\PostgreSQL\12\bin"
%pg_env%\pg_dump.exe -h loclahost -p 5432 -U postgres -d FamilyStore_db > FamilyStore_DB.sql
pause
