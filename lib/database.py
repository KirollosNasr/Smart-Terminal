from sqlite3 import connect;
from files import *;
from os.path import join;

class db :
	def __init__(self , path=None) :
		filePath = ""
		if path == None : 
			db._checkPath();
			filePath = join(ROOTPATH,FOLDERNAME,Time.getYear(),Time.getMonth(),Time.getDay()+".db") 
		else : filePath = path;
		self.conn = connect(filePath);
		self.cursor = self.conn.cursor();
		self._createTable();


	def _createTable(self) :
		self.conn.execute('''CREATE TABLE IF NOT EXISTS records (processname TEXT PRIMARY KEY, time REAL)''');

	def insert(self , data) :
		for item in data.keys() :
			self.conn.execute('''INSERT OR REPLACE INTO records (processname,time) VALUES (?,?)''',(item,data[item]));
		self.conn.commit();


	def get(self) :
		self.cursor.execute('''SELECT * FROM records''')
		data = {};
		for (p,t) in self.cursor.fetchall() :
			data[p] = t
		return data;


	def clear(self) : 
		self.conn.execute('''DELETE FROM records''');
		self.conn.commit();

	def close(self) : self.conn.close();self.cursor.close();

	@staticmethod
	def _checkPath() : rootFolder();subContent();logFile();

	@staticmethod
	def append(x , y , v) : return { k: x.get(k, v) + y.get(k, v) for k in set(x) | set(y) }



# d = db();
# d.insert({"kate":700 , "k3b":200 , "terminal":43 , "mine":0})
# print(d.get());
# d.clear();

