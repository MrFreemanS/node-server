const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const urlencodedParser = bodyparser.urlencoded({extended: false});

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'api_db',
    multipleStatements: true
});

function conn() {
  mysqlConnection.connect((err) => {
    if (!err)
        console.log('DB connection succeded.');
    else
        console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});
}

conn();

//Get page
app.get('/page/:id', (req, res) => {

  var id = req.params.id*10;

  mysqlConnection.query('SELECT * FROM news WHERE news_id>? LIMIT 10',id, (err, rows, fields) => {
  if (!err)
    res.send(rows);
  else
    console.log(err);
  });
    //mysqlConnection.end();
});

//Get news
app.get('/page/', (req, res) => {

    mysqlConnection.query('SELECT * FROM news LIMIT 10', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    });
    //mysqlConnection.end();
});

//Get incident
app.get('/incident/:id', (req, res) => {
var id = req.params.id*10;
    mysqlConnection.query('SELECT * FROM inc WHERE inc_id>? LIMIT 10', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    });
    //mysqlConnection.end();
});

//Get incident
app.get('/incident/', (req, res) => {

    mysqlConnection.query('SELECT * FROM inc LIMIT 10', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    });
    //mysqlConnection.end();
});

//Get an news
app.get('/news/:id', (req, res) => {

    mysqlConnection.query('SELECT * FROM news WHERE news_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an news
app.delete('/news/:id', (req, res) => {

    mysqlConnection.query('DELETE FROM news WHERE news_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfully');
        else
            console.log(err);
    })
});

app.post("/login", urlencodedParser, function (request, response) {
    if(!request.body) return response.sendStatus(400);
    console.log(request.body);

    var sql = 'SELECT * FROM users WHERE login = ? and password = ?';
    var login = request.body.login;
    var password = request.body.password;
    conn(); mysqlConnection.query(sql, [login, password], function (err, result) {
      if (err) throw err;
      console.log(result);
      if(result.length == 0) return response.sendStatus(401);
      else {
        response.sendStatus(200);
      }
    });
});

app.listen(3012, () => console.log('Server runnig'));
