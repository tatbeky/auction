var express = require('express');
var router = express.Router();
var url=require('url');
/* GET home page. */
router.get('/', function(req, res, next) {
  var queryData=url.parse(req.url,true).query;
var mysql=require('mysql');
var connection = mysql.createConnection({
host:'127.0.0.1',
user :'root',
password:'',
database:'project'
});
var id=0;
connection.connect();
if(queryData.id==null){
  id=null;
}else{
  id=queryData.id;
}
connection.query('SELECT * FROM comentes where id="'+id+'"',function(error,results,fields){
console.log(error);
if(!error){
res.render('select.ejs',{ data:results });
}else{
  res.render('select.ejs', { data:error });
}
});
 connection.end();

 // res.render('insert.pug', { title: 'Express' });
});

module.exports = router;