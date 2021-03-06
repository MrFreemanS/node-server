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
    port: '3306',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
  if (!err)
      console.log('DB connection succeded.');
  else
      console.log('DB connection failed \n Error : ' + JSON.stringify(err, undefined, 2));
});

app.get('/news/', (req, res) => {

var sql = 'SELECT * FROM news ORDER BY news_id DESC LIMIT 100';
  mysqlConnection.query(sql, (err, rows, fields) => {
  if (!err)
  {
    res.send(rows);
  }
  else
    console.log(err);
  });
  //mysqlConnection.end();
});



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


app.get('/users/:startPoint', (req, res) => {
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

  var sql = 'SELECT * FROM users ORDER BY user_id ASC LIMIT ?,?';
  mysqlConnection.query(sql,[startPoint,endPoint], (err, rows, fields) => {
  if (!err)
    res.send(rows);
  else
    console.log(err);
  });
  //mysqlConnection.end();
});

app.get('/user/:id', (req, res) => {

    mysqlConnection.query('SELECT * FROM users WHERE user_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.get('/news/:id', (req, res) => {

    mysqlConnection.query('SELECT * FROM news WHERE news_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

app.get('/news/:id/news_txt', (req, res) => {

    mysqlConnection.query('SELECT * FROM news WHERE news_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
        {
          res.send(rows[0].news_txt);
        }
        else
        {
          console.log(err);
          res.sendStatus(400);
        }
    })
});

app.put("/news/", urlencodedParser, function (request, response) {
  console.log(request.body);
    if(!request.body)
      return response.sendStatus(400);
    var sql = 'INSERT INTO news (news_title, news_txt) VALUES (?, ?);';
    var title = request.body.title;
    var news = request.body.news;

    mysqlConnection.query(sql, [title, news], function (err, result) {
      if (!err)
      {
        return response.sendStatus(200);
      }
      else {
          response.sendStatus(400);
      }
    });
});

app.post("/news/", urlencodedParser, function (request, response) {
  console.log(request.body);
    if(!request.body)
      return response.sendStatus(400);
    var sql = 'UPDATE news SET news_title = ?, news_txt = ? WHERE news_id = ?;';
    var title = request.body.title;
    var news = request.body.news;
    var id = request.body.id;

    mysqlConnection.query(sql, [title, news,id], function (err, result) {
      if (!err)
      {
        return response.sendStatus(200);
      }
      else {
          response.sendStatus(400);
      }
    });
});


app.delete('/news/:id', (req, res) => {

    mysqlConnection.query('DELETE FROM news WHERE news_id = ?', [req.params.id], (err, rows, fields) => {

        if (!err)
            return res.sendStatus(200);
        else
            console.log(err);
            return res.sendStatus(400);
    })
});

app.get('/inc/:startPoint', (req, res) => {

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

app.get('/inc/:id', (req, res) => {

    mysqlConnection.query('SELECT * FROM inc WHERE inc_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
            return response.sendStatus(400);
    })
});

app.get('/search/:string', (req, res) => {
    var sql= 'SELECT * FROM news WHERE news_txt LIKE ?';
    //console.log(req.params.string);
    mysqlConnection.query(sql, [req.params.string], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
            return response.sendStatus(400);
    })
});



app.post("/login", urlencodedParser, function (request, response) {
    if(!request.body)
      return response.sendStatus(400);
    var sql = 'SELECT user_type FROM users WHERE user_name =  ? and user_password =  ?';
    var login = request.body.login;
    var password = request.body.password;

    mysqlConnection.query(sql, [login, password], function (err, result) {
      if (err) throw err;

    //  console.log(result[0].user_type);

      if (result.length != 0 && result[0].user_type == 1)
        return response.sendStatus(200);
      else {
        response.sendStatus(401);
      }
    });
});

app.post("/isadmin", urlencodedParser, function (request, response) {
  //console.log(request.body);
    if(!request.body)
      return response.sendStatus(400);
    var sql = 'SELECT user_type FROM users WHERE user_name =  ?';
    var login = request.body.login;

    mysqlConnection.query(sql, [login], function (err, result) {
      if (err) throw err;

      //console.log(result[0].user_type);

      if (result.length != 0 && result[0].user_type == 1)
        return response.sendStatus(200);
      else {
        response.sendStatus(401);
      }
    });
});

app.listen(3012, () => console.log('Server runnig'));
