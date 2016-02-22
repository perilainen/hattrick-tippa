# -*- coding: utf-8 -*-

import json

with open("../json/omgångar.json") as data_file:
    data = json.load(data_file)


print data


import xmltodict, json
import io
from json import dumps

with open('../xml/matches.xml') as fd:
    doc = xmltodict.parse(fd.read())
print doc
infile ='../xml/matches.xml'



#o = xmltodict.parse( infile.read() )
outfile = io.open("matches.json", 'wb')

json.dump( doc , outfile )

with open("text", "w") as file:
    dumps(doc, file)
file.close()


print doc['HattrickData']['Match']
#o = xmltodict("../xml/matches.xml")

#json.dumps(o)
#with open("../xml/matches.xml") as data_file:
