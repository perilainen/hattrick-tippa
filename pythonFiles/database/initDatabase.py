import sqlite3
import databasesetting
import os.path

conn = sqlite3.connect(databasesetting.db_path)
curr = conn.cursor()

curr.execute("""DROP TABLE matches;""")


sql_command = """
CREATE TABLE matches (
matchID VARCHAR(20),
homeTeam VARCHAR(50),
AwayTeam VARCHAR(50),
MatchDate DATETIME,
result VARCHAR(20),
MatchRound VARCHAR(20));"""

curr.execute(sql_command)
curr.execute("""DROP TABLE users;""")


sql_command ="""
CREATE TABLE users (
user VARCHAR(20),
password VARCHAR(20));"""
curr.execute(sql_command)

curr.execute("""DROP TABLE results;""")

sql_command ="""
CREATE TABLE results (
user VARCHAR(20),
matchID VARCHAR(20),
result VARCHAR(20));"""

curr.execute(sql_command)

conn.commit()

conn.close()