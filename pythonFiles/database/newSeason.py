import sqlite3
import databasesetting
import json
conn = sqlite3.connect(databasesetting.db_path)
curr = conn.cursor()

#try:

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


with open("../matches.json") as data_file:
    data = json.load(data_file)

print data


for i in data['HattrickData']['Match']:


    sql_command = '''INSERT INTO matches (matchID, homeTeam, AwayTeam, MatchDate, result, MatchRound) VALUES (?,?,?,?,NULL,?)'''
    params = (str(i['MatchID']),(i['HomeTeam']['HomeTeamName']),(i['AwayTeam']['AwayTeamName']),str(i['MatchDate']),str(i['MatchRound']))

    curr.execute(sql_command,params)
#conn.commit()




curr.execute("""DROP TABLE results;""")

sql_command ="""
CREATE TABLE results (
user VARCHAR(20),
matchID VARCHAR(20),
result VARCHAR(20),
comment TEXT);"""

curr.execute(sql_command)

sql_command = '''SELECT user from users'''

users = curr.execute(sql_command)
allusers = users.fetchall()
print users
print allusers

for user in allusers:
    curruser = user[0]
    sql_command = '''SELECT matchID from matches'''

    resp = conn.execute(sql_command)
    allMatches = resp.fetchall()

    for match in allMatches:

        currmatch = match[0]
        sql_command = '''INSERT INTO results (user,matchID,result) VALUES (?,?,NULL)'''
        params = ([curruser,currmatch])
        curr.execute(sql_command,params)


conn.commit()

conn.close()