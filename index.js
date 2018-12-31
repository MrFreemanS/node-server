const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');
const urlencodedParser = bodyparser.urlencoded({extended: false});
//const crypto = require('crypto');
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

//Get page
app.get('/page/:id', (req, res) => {
    conn(); mysqlConnection.query('SELECT * FROM news LIMIT 10', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//search
app.get('/search/:searchString', (req, res) => {
    conn(); mysqlConnection.query('SELECT * FROM news LIMIT 10', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});


//Get an news
app.get('/news/:id', (req, res) => {
    conn(); mysqlConnection.query('SELECT * FROM news WHERE news_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});

//Delete an news
app.delete('/news/:id', (req, res) => {
    conn(); mysqlConnection.query('DELETE FROM news WHERE news_id = ?', [req.params.id], (err, rows, fields) => {
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
