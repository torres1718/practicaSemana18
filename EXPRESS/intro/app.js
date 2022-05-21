var express=require('express');

var app=express();

app.get('/', function(req, res){
res.send("Programacion Computacional IV");
});

//recibe argumento de endPoint y la funcion que se ejecuta cuando se recibe el endPoint 
app.route('/test').get(function(req, res){
res.send("Pagina de prueba");
});

var server=app.listen(3000, function(){});