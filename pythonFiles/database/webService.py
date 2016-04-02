# -*- coding: utf-8 -*-

from flask import request
from flask import Flask
import json
import sqlite3
from flask import Response, jsonify
import databasesetting
import settings
app = Flask(__name__)
from datetime import date
import datetime
import time
import re
import xmltodict
from rauth import OAuth1Service
from rauth import OAuth1Session
from rauth.oauth import HmacSha1Signature
import json
import logging
import xmltodict
from time import strftime,localtime

import schedule


from flask import make_response, request, current_app, jsonify
from datetime import timedelta
from functools import update_wrapper

from flask_httpauth import HTTPBasicAuth
auth = HTTPBasicAuth()

DATA_FILE= 'data.txt'

LOCK_OFFSET = datetime.timedelta(days=1)



def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        f.required_methods = ['OPTIONS']
        return update_wrapper(wrapped_function, f)
    return decorator

@app.route('/api/getTeamFile', methods=['GET','OPTIONS'])
@crossdomain(origin='*',headers='autorizations')
def getTeamsFile():
    return open(DATA_FILE).read()


@app.route('/api/getTeamValues', methods=['GET','OPTIONS'])
@crossdomain(origin='*',headers='autorizations')
def getTeamValue():
    access_token_key= request.args.get('access_token_key')
    access_token_secret = request.args.get('access_token_secret')
    consumer_key = settings.consumer_key
    consumer_secret = settings.consumer_secret
    teamIDS = request.args.get('TeamIDS').split(',')
    print teamIDS
    teams = {}

    teams['Team'] = []
    date= strftime("%Y-%m-%d %H:%M:%S", time.localtime())

    teams['LastUpdate']= date
    #t ={"Team":[]}
    #teams.append(t)
    #print teams

    for teamID in teamIDS:
        print teamID
        session = OAuth1Session(consumer_key, consumer_secret, access_token=access_token_key, access_token_secret=access_token_secret)
        r = session.get('http://chpp.hattrick.org/chppxml.ashx', params={'file': 'players', 'version':'2.3', 'teamID':teamID})
        #print r.text
        xmldict = xmltodict.parse(r.text)
        jsonfile = json.loads(json.dumps(xmldict))
        #print jsonfile
        totalvalue = 0
        players = 0
        maxbuy = 0
        numberOfModerklubb = 0
        totalTSI = 0
        salary= 0
        for i in jsonfile['HattrickData']['Team']['PlayerList']['Player']:
            #print i['PlayerID']
            players +=1;
            #playerdetails= session.get('http://chpp.hattrick.org/chppxml.ashx', params={'file': 'playerdetails', 'version':'2.6','actionType':'view', 'playerID':i['PlayerID']})
            transferdetails= session.get('http://chpp.hattrick.org/chppxml.ashx', params={'file': 'transfersplayer', 'version':'1.1','playerID':i['PlayerID']})
            totalvalue += getLastTransfer(transferdetails)
            maxbuy = max (getLastTransfer(transferdetails),maxbuy)
            totalTSI += int(i['TSI'])
            salary += int(i['Salary'])
            if isPlayerNotTransfered(transferdetails):
                numberOfModerklubb +=1
            #print totalvalue
        jsonitem = {"TeamName": jsonfile['HattrickData']['Team']['TeamName']}
        jsonitem['Truppvarde'] = totalvalue
        jsonitem['Players'] = players
        jsonitem['MaxBuy'] = maxbuy
        jsonitem['AntalModerklubbsspelare'] = numberOfModerklubb
        jsonitem['TotalTSI'] = totalTSI
        jsonitem['Salary']= salary
        #print teams
        teams['Team'].append(jsonitem)

    #return Response(returnstring,status=200)
    resp = Response(json.dumps(teams), status=200,mimetype='application/json')
    with open(DATA_FILE, 'w') as outfile:
        json.dump(teams, outfile)


    return resp
def isPlayerNotTransfered(transferdetails):
    xmldict = xmltodict.parse(transferdetails.text)

    jsonfile = json.loads(json.dumps(xmldict))

    transfers = jsonfile['HattrickData']['Transfers']

    if 'Transfer' in transfers:
        return False
    return True


def getLastTransfer(transferdetails):
    #print transferdetails.text
    xmldict = xmltodict.parse(transferdetails.text)

    jsonfile = json.loads(json.dumps(xmldict))

    transfers = jsonfile['HattrickData']['Transfers']
    value = 0
    if 'Transfer' in transfers:
        #print transfers
        transfer = transfers['Transfer']
        if type(transfer) is list:
            value = int(transfer[0]['Price'])
        else:

            value = int(transfer['Price'])
    return value
        #print type(transfers['Transfer'])
        #print "test" + str(len(transfers['Transfer']))
        #print jsonfile['HattrickData']['Transfers']['Transfer'][0]['Price']


@app.route('/api/getResultsFromHattrick', methods=['GET','OPTIONS'])
@crossdomain(origin='*',headers='autorizations')
def getResultsFromHattrick():
    access_token_key= request.args.get('access_token_key')
    access_token_secret = request.args.get('access_token_secret')
    consumer_key = settings.consumer_key
    consumer_secret = settings.consumer_secret
    chpp = OAuth1Service(
    consumer_key=consumer_key,
    consumer_secret=consumer_secret,
    request_token_url='https://chpp.hattrick.org/oauth/request_token.ashx',
    access_token_url='https://chpp.hattrick.org/oauth/access_token.ashx',
    authorize_url='https://chpp.hattrick.org/oauth/authorize.aspx',
    base_url='http://chpp.hattrick.org/chppxml.ashx',
    signature_obj=HmacSha1Signature)

    session = OAuth1Session(consumer_key, consumer_secret, access_token=access_token_key, access_token_secret=access_token_secret)
    #print access_token_key
    #print access_token_secret
    #The way we choose doesn't know about base_url, add the url
    r = session.get('http://chpp.hattrick.org/chppxml.ashx', params={'file': 'leaguefixtures', 'version':'1.2'})

    xmldict = xmltodict.parse(r.text)
    jsonfile =  json.loads(json.dumps(xmldict))
    logging.debug(jsonfile)
    for i in jsonfile['HattrickData']['Match']:



        if  'HomeGoals' in i:
            result = i['HomeGoals']+"-"+i['AwayGoals']
            putResult(i['MatchID'],result)
        elif isMatchPlayed(i['MatchID']):

            resp = session.get('http://chpp.hattrick.org/chppxml.ashx', params={'file': 'live', 'matchID': i['MatchID'], 'version':'1.8'})
            #print resp.text
            xmldictmatch = xmltodict.parse(resp.text)
            jsonfilematch = json.loads(json.dumps(xmldictmatch))
            #print i['MatchID']

            #print jsonfilematch['HattrickData']['MatchList']['Match']

            for match in jsonfilematch['HattrickData']['MatchList']['Match']:
                if match['MatchID'] == i['MatchID']:


                    homegoals = jsonfilematch['HattrickData']['MatchList']['Match'][0]['HomeGoals']
                    awaygoals = jsonfilematch['HattrickData']['MatchList']['Match'][0]['AwayGoals']
                    #print jsonfilematch
                    #print homegoals
                    #print awaygoals
                    result = homegoals+"-"+awaygoals
                    putResult(i['MatchID'],result)





    return Response("Matches collected from Hattrick",status=200)



@app.route('/api/matches', methods=['GET','OPTIONS'])
@crossdomain(origin='*',headers='authorization')
def getMatches():
    conn = sqlite3.connect(databasesetting.db_path)
    sql_command = "SELECT * from matches"
    response = conn.execute(sql_command)
    test = {'matches': [i for i in response.fetchall()]}

    resp = Response(json.dumps(test), status=200,mimetype='application/json')
    return resp


def getMatch(id):
    conn = sqlite3.connect(databasesetting.db_path)
    sql_command= "SELECT * from matches WHERE matchID = ?"
    params = ([id])
    response = conn.execute(sql_command,params)
    return response.fetchall()

@auth.get_password
def get_pw(username):


    #print username
    conn = sqlite3.connect(databasesetting.db_path)
    sql_command ="SELECT user from users WHERE user=?"
    params = ([username])
    resp = conn.execute(sql_command,params)
    if len(resp.fetchall())>0:
        #print "hej på dig"
        sql_command = "SELECT password from users WHERE user=?"
        params = ([username])
        resp = conn.execute(sql_command,params)
        data  = resp.fetchall()
        #print data
        return data[0][0]
    #print "nu är jag här"
    return None

@app.route('/api/login',methods = ['GET'])
@crossdomain(origin='*',headers='authorization')
@auth.login_required
def index():

    resp = Response("Hello, %s!" % auth.username(), status=200,)
    return resp




@app.route('/api/SetPassword/<string:user>/<string:newpass>', methods = ['PUT'])
@crossdomain(origin='*',headers='authorization')
@auth.login_required
def setPass(user, newpass):
    sql_command = "UPDATE users SET password = ? WHERE user = ?"
    params = ([newpass, user])
    conn = sqlite3.connect(databasesetting.db_path)
    conn.execute(sql_command,params)
    conn.commit()
    conn.close()
    resp = Response("Password set")
    return resp



@app.route('/api/table', methods = ['GET'])
@crossdomain(origin='*',headers='authorization')

def getTable():
    matches = getMatches()
    matchesjson =  json.loads(matches.data)['matches']
    users  = json.loads(getUsers().data)['users']
    userdict = {}
    trepoang = {}
    enpoang={}
    for i in range(len(users)):
        userdict[users[i][0]] =0
        trepoang[users[i][0]] =0
        enpoang[users[i][0]] =0
    for match in matchesjson:
        result =(json.loads((getResult(match[0]).data))['result'])[0][0]
        if (result !=None):
            for i in range(len(users)):
                bet = getBet(users[i][0],match[0])

                betData =  json.loads(bet.data)['bet']
                if not (betData[0][0]==None):
                    points = getPoints(betData[0][0],result)
                    userdict[users[i][0]] +=points
                    if points ==3:
                        trepoang[users[i][0]] +=1
                    if points ==1:
                        enpoang[users[i][0]] +=1

    table = []
    for i in userdict:
        j={}

        table.append({'user':i,'points':userdict[i],'correct':trepoang[i],'sign':enpoang[i]})
    resp = jsonify(table=table)
    return resp

def getPlayedMatches():
    date =  datetime.datetime.now()
    #date =  datetime.datetime.now()+datetime.timedelta(days=7)
    return getMatchesBeforeDate(date)


def getLockedMatches():
    date = datetime.datetime.now()+LOCK_OFFSET
    #print str(date)
    return getMatchesBeforeDate(date)


def getMatchesBeforeDate(date):
    sql_command = '''SELECT * FROM matches WHERE matchDate < ?'''
    params = ([date])
    conn = sqlite3.connect(databasesetting.db_path)
    resp = conn.execute(sql_command,params)
    matches = resp.fetchall()
    #print matches
    return matches

@app.route('/api/officialBets',methods = ['GET'])
@crossdomain(origin='*',headers='authorization')
def getOfficialBets():
    #test#"2017-01-01 01:00:00"
    matches =  getLockedMatches()
    #print "lockedmatches: "+ str(matches)
    users  = json.loads(getUsers().data)['users']
    bets = []

    for match in matches:
        #print match
        jsonitem = {"MatchId": match[0]}
        jsonitem['HomeTeam'] = match[1]
        jsonitem['AwayTeam'] = match[2]
        jsonitem['date'] = match[3]
        jsonitem['result'] = match[4]
        jsonitem['omgång'] = match[5]


        bets.append(jsonitem)
        list = []
        for i in range(len(users)):
            user =  users[i][0]
            bet =  json.loads(getBet(user,match[0]).data)['bet'][0][0]

            comment = json.loads(getComment(user,match[0]).data)['comment'][0][0]
            listbet = {"user":user}
            listbet["bet"] = bet
            listbet['comment'] = comment

            listbet["point"] = getPoints(bet,(match[4]))
            list.append(listbet)
        jsonitem['users'] = list

    resp = Response(json.dumps(bets), status=200,mimetype='application/json')
    return resp

def validateresult(stringResult):

    return re.match('^[0-9]+\-[0-9]+$',stringResult)


def getPoints(bet,result):
    #print "Bet: "+str((bet))
    #print "Result: "+str(type(result))
    if validateresult(str(bet)) and validateresult(str(result)):

        if bet == result:
            return 3
        signplace = str(bet).find("-")
        homegoalBet = str(bet)[0:signplace]
        awaygoalBet = str(bet)[signplace+1:]
        #print "homegoal: "+ homegoalBet
        betDiff =  int(homegoalBet)-int(awaygoalBet)

        signplaceresult = str(result).find("-")
        homegoalResult = str(result)[0:signplaceresult]
        awaygoalResult = str(result)[signplaceresult+1:]

        resultDiff = int(homegoalResult)-int(awaygoalResult)

        if((resultDiff==0==betDiff) or ((resultDiff>0) and (betDiff>0)) or ((resultDiff<0) and (betDiff<0))):
            return 1

    return 0

def getComment(user,matchID):
    conn = sqlite3.connect(databasesetting.db_path)
    sql_command = '''SELECT Comment from results WHERE user=? AND matchID=?'''
    params = ([user,matchID])
    #print params
    response = conn.execute(sql_command,params)

    return jsonify(comment=response.fetchall())


def getBet(user,matchID):
    conn = sqlite3.connect(databasesetting.db_path)
    sql_command = '''SELECT result from results WHERE user=? AND matchID=?'''
    params = ([user,matchID])
    #print params
    response = conn.execute(sql_command,params)

    return jsonify(bet=response.fetchall())


@app.route('/api/result/<string:matchID>', methods=['GET'])
def getResult(matchID):
    conn = sqlite3.connect(databasesetting.db_path)
    sql_command = '''SELECT result from matches WHERE matchID=?'''
    #print matchID
    params =([matchID])

    response = conn.execute(sql_command,params)
    resp = jsonify(result= response.fetchall())
    conn.close
    return resp

@app.route('/api/result/<string:matchID>/<string:result>',methods=['PUT'])
def putResult(matchID,result):
    conn = sqlite3.connect(databasesetting.db_path)
    sql_command = '''UPDATE matches SET result =? WHERE matchID=?'''
    params = ([result, matchID])
    #print params
    response  = conn.execute(sql_command,params)
    conn.commit()
    conn.close()
    return Response(status=200)

@app.route('/api/getBets/<string:user>', methods=['GET'])
@crossdomain(origin='http://localhost',headers='authorization')
@auth.login_required
def getBets(user):
    #if (not verifyPassword(user,password)):
    #    return Response("not allowed",status=401)
    conn = sqlite3.connect(databasesetting.db_path)
    sql_command = '''SELECT matchID, result, Comment from results WHERE user=?'''
    params = ([user])
    response = conn.execute(sql_command,params)

    results  = response.fetchall()


    bets = []

    for result in results:

        match = getMatch(result[0])[0]

        jsonitem = {"MatchId": match[0]}
        jsonitem['HomeTeam'] = match[1]
        jsonitem['AwayTeam'] = match[2]
        jsonitem['date'] = match[3]
        jsonitem['result'] = match[4]
        jsonitem['omgång'] = match[5]

        jsonitem['bet'] = result[1]
        if jsonitem['bet'] =='undefined':
            jsonitem['bet']=""
        jsonitem['comment'] = result[2]
        if jsonitem['comment']=='null':
            jsonitem['comment']=""

        jsonitem['played'] = isMatchPlayed(match[0])
        jsonitem['locked'] = isMatchLocked(match[0])
        jsonitem['locktime'] = getLockTime(match[0])

        bets.append(jsonitem)

    #resp = Response(json.dumps(bets), status=200,mimetype='application/json')
    #return resp



    resp = Response(json.dumps(bets),status=200,mimetype='application/json')
    return resp


def getUsers():
    conn = sqlite3.connect(databasesetting.db_path)
    sql_command = '''SELECT user from users'''

    response = conn.execute(sql_command)

    return jsonify(users=response.fetchall())

@app.route('/api/createUser/<string:user>/<string:password>',methods=['POST'])
def createUser(user,password):
    conn = sqlite3.connect(databasesetting.db_path)
    sql_command = '''SELECT * FROM users WHERE user=?'''
    params = ([user])

    response = conn.execute(sql_command,params)

    if len(response.fetchall())>0:
        conn.close()
        resp = Response("user already exists",status=409)
        return resp
    conn.close()
    saveUser(user,password)
    resp = Response("user created", status=200)
    return resp
@app.route('/api/user/<string:user>', methods =['DELETE'])
def deleteUser(user):
    conn = sqlite3.connect(databasesetting.db_path)
    sql_command = '''DELETE FROM users WHERE user = ?'''
    params = ([user])
    conn.execute(sql_command,params)
    conn.commit()
    conn.close()

def saveUser(user,password):
    conn = sqlite3.connect(databasesetting.db_path)
    sql_command = '''INSERT INTO users (user,password) VALUES(?,?)'''
    params = ([user, password])
    curs = conn.cursor()

    curs.execute(sql_command,params)

    sql_command = '''SELECT matchID from matches'''

    resp = conn.execute(sql_command)
    allMatches = resp.fetchall()

    for match in allMatches:
        currmatch = match[0]
        sql_command = '''INSERT INTO results (user,matchID,result) VALUES (?,?,NULL)'''
        params = ([user,currmatch])
        curs.execute(sql_command,params)
    conn.commit()
    conn.close()


def verifyPassword(user,password):
    conn =sqlite3.connect(databasesetting.db_path)
    sql_command = '''SELECT password FROM users WHERE user=? AND password=?'''
    params = ([user, password])
    resp = conn.execute(sql_command,params)

    #print resp.fetchone()
    if resp.fetchall()==[]:
        conn.close()
        return False
    conn.close()
    return True

@app.route('/api/placeBet/<string:user>/<string:password>/<string:matchID>/<string:result>',methods=['PUT'])
@crossdomain(origin='*',headers='authorization')
def placeBet(user,password,matchID,result):
    comment = request.args.get('comment')

    if (not verifyPassword(user,password)):
        return Response("not allowed",status=401)
    if (isMatchPlayed(matchID)):
        return Response("not allowed",status=401)

    sql_command = '''UPDATE results SET result =?, Comment=? WHERE matchID=? AND user=?'''

    conn = sqlite3.connect(databasesetting.db_path)
    params = ([result,comment, matchID,user])
    resp = conn.execute(sql_command,params)
    #print resp.fetchall()
    conn.commit()
    conn.close()
    return Response("bet placed",status=200)


def isMatchPlayed(matchID):
    matches = getPlayedMatches()
    matchids= []
    for match in matches:
        matchids.append(int(match[0]))
    return int(matchID) in matchids



def isMatchLocked(matchID):
    matches = getLockedMatches()
    matchids= []
    for match in matches:
        matchids.append(int(match[0]))
    return int(matchID) in matchids

def getLockTime(matchID):
    sql_command='''SELECT matchDate FROM matches WHERE matchID = ?'''
    params = [matchID]
    conn = sqlite3.connect(databasesetting.db_path)

    resp = conn.execute(sql_command,params)
    datein = resp.fetchall()[0][0]
    #print datein
    date= datetime.datetime.strptime(datein, '%Y-%m-%d %H:%M:%S')

    conn.close
    #print
    return str(date-LOCK_OFFSET)











if __name__=='__main__':
    logging.basicConfig(filename='webService.log', level=logging.DEBUG)

    logging.info('Started')

    app.run(debug=True)
