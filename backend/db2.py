import sqlite3

#establish connection
conn=sqlite3.connect('nba.sqlite')

#need id of structure of data 
#cursor object-used to execute SQL statements on sqlite database

cursor = conn.cursor()
#define sql query to create table
sql_query = """CREATE TABLE IF NOT EXISTS posts (
    post_id integer PRIMARY KEY,
    body text NOT NULL,
    upvote integer DEFAULT 0,
    downvote integer DEFAULT 0,
    date text DEFAULT (strftime('%Y-%m-%d %H:%M', 'now')),
    user_id integer, 
    FOREIGN KEY(user_id) REFERENCES nbadatabase(id)
)"""


cursor.execute(sql_query)


