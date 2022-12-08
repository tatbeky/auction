var express = require('express');
var router = express.Router();
var url=require('url');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var insertRouter = require('./routes/insert');
var selectRouter = require('./routes/select');
var updatdeletRouter = require('./routes/updatdelet');
var app = express();
var server = app.listen((3000),()=>{
  console.log("work in 3000");
});
var mysql=require('mysql');
const { NOTFOUND } = require('dns');
const { json } = require('express');
const { name } = require('ejs');
var connection = mysql.createConnection({
host:'sql6.freemysqlhosting.net',
user :'sql6583378',
password:'LzxJAKDkEM',
database:'sql6583378'
});
connection.connect();

var io = require("socket.io")(server);

io.on("connection",(socket)=>{
  console.log("send");

socket.on("get_all",(All)=>{
  
    connection.query('SELECT * FROM '+All+' ',function(error,results,fields){
    console.log(error);
if(!error){
  socket.emit('res_all',{ type:All , data :JSON.stringify(results )});
}else{
  socket.emit('res_all', { data:"NOTFOUND" });
};
    
});
});
socket.on("get_one",(id)=>{
  console.log(id);
connection.query('SELECT * FROM comentes where id="'+id+'"',function(error,results,fields){
console.log(error);
if(!error){
  socket.emit('res_one',JSON.stringify(results ));
}else{
  socket.emit('res_one',  "NOTFOUND");
}
});
});
socket.on("update",(data)=>{
  console.log(data);

  var json_data = JSON.parse(JSON.stringify(data));
connection.query('UPDATE comentes SET  photo="'+json_data['photo']+'", num="'+json_data['num']+'", min_price="'+json_data['min_price']+'", price="'+json_data['price']+'",name="'+json_data['name']+'" Where id="'+json_data['id']+'"' ,function(error,results,fields){
console.log(error); 
if(!error){ 
  connection.query("SELECT * FROM comentes ",function(error,results,fields){
     socket.broadcast.emit('res_all',JSON.stringify(results ));
    });
    connection.query('SELECT * FROM comentes where id="'+json_data['id']+'"',function(error,results,fields){ 
       socket.broadcast.emit('res_one',JSON.stringify(results ));
      });

}else{
  socket.emit('res_update ', "NOTFOUND" );
}
});
});
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/insert', insertRouter);
app.use('/select', selectRouter);
app.use('/updatdelet', updatdeletRouter);
