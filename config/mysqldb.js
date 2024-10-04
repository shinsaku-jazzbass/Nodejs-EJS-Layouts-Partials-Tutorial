const mysql = require('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
	host : 'localhost',
	database : 'testing',
	user : 'root',
	password : process.env.DATABASE_PASS
});

connection.connect(function(error){
	if(error)
	{
		throw error;
	}
	else
	{
		console.log('MySQL Database is connected Successfully!!');
	}
});

module.exports = connection;
