import sqlite3

import databasesetting

conn = sqlite3.connect(databasesetting.db_path)
curr = conn.cursor()


sql_command ="""
alter table results add column Comment TEXT"""

curr.execute(sql_command)

conn.commit()

conn.close()