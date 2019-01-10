const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const urlencodedParser = bodyparser.urlencoded({extended: false});

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: '192.168.1.107',
    user: 'api_user1',
    password: '12345678',
    database: 'api_db',
    port: '3306',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
  if (!err)
      console.log('DB connection succeded.');
  else
      console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

//Get news page
app.get('/page/:startPoint', (req, res) => {

var startPoint = req.params.startPoint;
var endPoint;
if (startPoint<=1) {
  startPoint = 0;
  endPoint = 10;
}
else {
  endPoint= startPoint*10;
  startPoint = endPoint - 10;
}

var sql = 'SELECT * FROM news ORDER BY news_id ASC LIMIT ?,?';
  mysqlConnection.query(sql,[startPoint,endPoint], (err, rows, fields) => {
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


app.get('/inc_page/:startPoint', (req, res) => {

var startPoint = req.params.startPoint;
var endPoint;
if (startPoint<=1) {
  startPoint = 0;
  endPoint = 10;
}
else {
  endPoint= startPoint*10;
  startPoint = endPoint - 10;
}

var sql = 'SELECT * FROM inc ORDER BY inc_id ASC LIMIT ?,?';
  mysqlConnection.query(sql,[startPoint,endPoint], (err, rows, fields) => {
  if (!err)
    res.send(rows);
  else
    console.log(err);
  });
  //mysqlConnection.end();
});

//Get an incidient
app.get('/incidient/:id', (req, res) => {

    mysqlConnection.query('SELECT * FROM inc WHERE inc_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.get('/search/:searchString', (req, res) => {
    var sql= 'SELECT * FROM news WHERE news_txt LIKE ?';
    console.log(searchString);
    mysqlConnection.query(sql, [req.params.searchString], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.post("/login", urlencodedParser, function (request, response) {
    if(!request.body)
      return response.sendStatus(400);
    var sql = 'SELECT * FROM users WHERE user_name =  ? and user_password =  ?';
    var login = request.body.login;
    var password = request.body.password;
    //console.log(login);
    //console.log(password);
    mysqlConnection.query(sql, [login, password], function (err, result) {
      if (err) throw err;

      console.log(result[0].user_type);

      if (result.length != 0 && result[0].user_type == 1)
        return response.sendStatus(200);
      else {
        response.sendStatus(401);
      }
    });
});



app.listen(3012, () => console.log('Server runnig'));
