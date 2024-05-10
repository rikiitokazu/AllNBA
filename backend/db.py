import sqlite3

#establish connection
conn=sqlite3.connect('nba.sqlite')

#need id of structure of data 
#cursor object-used to execute SQL statements on sqlite database

cursor = conn.cursor()
#define sql query to create table
sql_query = """CREATE TABLE IF NOT EXISTS nbadatabase (
    id integer PRIMARY KEY,
    email text NOT NULL,
    username text NOT NULL UNIQUE,
    password text NOT NULL
)"""

cursor.execute(sql_query)

cursor.execute("ALTER TABLE nbadatabase ADD score integer DEFAULT 0")