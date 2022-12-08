
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
host:'127.0.0.1',
user :'root',
password:'',
database:'project'
});
connection.connect();

var io = require("socket.io")(server);

io.on("connection",(socket)=>{
  console.log("send");

  socket.emit("hello","world");

socket.on("get_all",(get_all)=>{
    console.log(get_all);
    connection.query("SELECT * FROM comentes",function(error,results,fields){
    console.log(error);
if(!error){
  socket.emit('res_all',JSON.stringify(results ));
}else{
  socket.emit('res_all', { data:"NOTFOUND" });
}
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

  console.log(json_data['name']);
  console.log(json_data.id);

connection.query('UPDATE comentes SET name="'+json_data['name']+'" WHERE id="'+json_data['id']+'"' ,function(error,results,fields){
console.log(error); 
console.log(results); 
console.log(fields); 
if(!error){ 
  connection.query('SELECT * FROM comentes where id="'+json_data['id']+'"',function(error,results,fields){
      socket.emit('res_one',JSON.stringify(results ));
    });
    connection.query('SELECT * FROM comentes',function(error,results,fields){
      socket.broadcast.emit('res_all',JSON.stringify(results));
    });
}else{
  socket.emit('update', "NOTFOUND" );
}

});
});
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/insert', insertRouter);
app.use('/select', selectRouter);
app.use('/updatdelet', updatdeletRouter);
