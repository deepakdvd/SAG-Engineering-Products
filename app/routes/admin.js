'use strict';
const h=require('../helpers');
const db1=require('../dbconnect');
var db = db1.fdata();

 //var dateFormat = require('dateformat');
var now = new Date();

var ObjectId = require('mongoskin').ObjectID;
//var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

var handlebars = require('handlebars');
var path = require('path');
var fs = require('fs');




  
module.exports=() => {
  
  let routes={
  'get':{
    '/login':(req,res)=>{
     
    },
    
        
        
},
  'post':{
    '/usersignup':(req,res)=>{
     
      
    },
   
        
  }
}
  
  return h.route(routes);
}
