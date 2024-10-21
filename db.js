const mysql = require ('mysql');

const connection=mysql.createConnection({
    host:'localhost',
    user:'root',
    database:'progra_proyectofinal',
    password:''
});

connection.connect();
module.exports=connection;