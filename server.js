'use strict';
var ex = require('express');
var nodemailer = require('nodemailer');
var app=ex();
var http = require('http').Server(app);
var bParser = require('body-parser');

const db1=require('./app/dbconnect');
var db = db1.fdata();

var busboy = require('connect-busboy');
app.use(busboy());

var square= require('./app')

app.set('port', (process.env.PORT || 3000));

app.set('view engine','ejs');
app.use(ex.static('public'));
   

app.use(bParser.json());
app.use(bParser.urlencoded({extended:false}));


// frontend index pages

app.get('/',square.indexees);
app.get('/products',square.indexees);
app.get('/about',square.indexees);
app.get('/login',square.indexees);
app.get('/dashboard',square.indexees);

app.post('/fileupload',square.indexees);
app.post('/imgdelete',square.indexees);

// app.get('/',function(req,res){
// 	res.render('index');
// 	});

// app.get('/products',function(req,res){
// 	res.render('products');
// 	});

// app.get('/about',function(req,res){
// 	res.render('about');
// 	});

// app.get('/login',function(req,res){
// 	res.render('login');
// 	}); 

// app.get('/dashboard',function(req,res){
// 	res.render('dashboard');
// 	});




// app.post('/email',function(req, res){


//   var transporter = nodemailer.createTransport({
//    host: 'smtp.zoho.com',
//     port: 465,
//     secure: true, 
//   auth: {
//     user: 'deepakdesai19@picagroexporter.com',
//     pass: '*2468492383@sandvd'
//   }
// });

// var mailOptions = {
//   from: 'deepakdesai19@picagroexporter.com',
//   to: 'jadhav.karan123@gmail.com',
//   subject: 'Enquiry/Order',
//   html: '<h1 style="text-align:center"><a href="picagroexporter.com">Picagroexporter.com</a></h1><br><h2>Ordered By '+req.body.yrname+'</h2><br>Name: <b>'+req.body.yrname+'</b><br>Contact No: <a href="tel:'+req.body.conno+'"><b>'+req.body.conno+'</b></a><br>Email Id: <b>'+req.body.email+'</b><br>Order Description: <b>'+req.body.desc+'</b><br>Order Quantity: <b>'+req.body.quantity+' '+req.body.size+'</b><br>Type: <b>'+req.body.type+'</b><br>Destination Port: <b>'+req.body.port+'</b><br>Shipping By: <b>'+req.body.shipby
// };

// transporter.sendMail(mailOptions, function(error, info){
//   if (error) {
//     return console.log(error);
//   } else {
//     console.log('Email sent: ' + info.response);
//   }
// });

// res.redirect('/contact');

// });




http.listen(app.get('port'), function(){
  console.log('listening on *:'+app.get('port'));
});

// var port = process.env.PORT || 8000;
// server.listen(port, function() {
//     console.log("App is running on port " + port);
// });
// app.listen(process.env.PORT || 3000, function(){
//   console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
// });