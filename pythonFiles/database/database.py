# -*- coding: utf-8 -*-

import json
import sqlite3
import databasesetting

conn = sqlite3.connect(databasesetting.db_path)


cursor = conn.cursor()

cursor.execute("""DROP TABLE matches;""")

with open("../matches.json") as data_file:
    data = json.load(data_file)

print data


for i in data['HattrickData']['Match']:
    print i
    print i['MatchID']
    print i['HomeTeam']['HomeTeamName']
    print i['AwayTeam']['AwayTeamName']

    print i['MatchDate']
    print i['MatchRound']

    #format_str = """INSERT INTO matches (matchID, homeTeam, AwayTeam, MatchDate, result, MatchRound)
    #VALUES ({match}, {HomeTeam}, {AwayTeam}, {MatchDate}, NULL,{Round});"""

    #sql_command = format_str.format(match=i['MatchID'], HomeTeam=i['HomeTeam']['HomeTeamID'], AwayTeam=i['AwayTeam']['AwayTeamName'],
    #                                MatchDate = i['MatchDate'], Round= i['MatchRound'])
    sql_command = '''INSERT INTO matches (matchID, homeTeam, AwayTeam, MatchDate, result, MatchRound) VALUES (?,?,?,?,NULL,?)'''
    params = (str(i['MatchID']),(i['HomeTeam']['HomeTeamName']),(i['AwayTeam']['AwayTeamName']),str(i['MatchDate']),str(i['MatchRound']))
    print sql_command
    print params
    print "test"
    cursor.execute(sql_command,params)
    print "test2"
conn.commit()
conn.close()