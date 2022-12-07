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

connection.connect();

connection.query("INSERT INTO `comentes`(`id`, `photo`, `num`, `min_price`, `price`, `name`) VALUES('"+queryData.id+"','"+queryData.photo+"','"+queryData.num+"','"+queryData.min_price+"','"+queryData.price+"','"+queryData.name+"')",function(error,results,fields){

if(!error){
  console.log(results);
res.render('insert.ejs',{ data:"true" });
}else{
  res.render('insert.ejs', { data:"false" });
}
});
 connection.end();

 // res.render('insert.pug', { title: 'Express' });
});

module.exports = router;