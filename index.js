var express = require('express');
var bodyParser = require('body-parser')
var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
	res.send('Hello API');
});

app.listen(3012, function() {
	console.log('API app started');
});
