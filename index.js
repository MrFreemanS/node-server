var express = require('express');
var bodyParser = require('body-parser')

var app = express();

var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "myusername",
  password: "mypassword"
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
	res.send('Hello API');
});

app.get('/news/:id', function(req, res) {
	res.send('news '+req.params.id);
});
app.listen(3012, function() {
	console.log('API app started');
});
