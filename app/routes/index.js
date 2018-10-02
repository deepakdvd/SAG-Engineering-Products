'use strict';
const h = require('../helpers');
const db1 = require('../dbconnect');
var db = db1.fdata();

var now = new Date();

var ObjectId = require('mongoskin').ObjectID;

var nodemailer = require('nodemailer');

var handlebars = require('handlebars');
var path = require('path');
var fs = require('fs');

var cloudy=require('../cloudinary').ob();

module.exports = () => {

  let routes = {
    'get': {
      '/': (req, res) => {
        res.render('index');
      },


      '/products': (req, res) => {

        res.render('products');
        // db.collection('category').insert({name:'category',img:'categoryimage'},function(err, result){
        //   if(err)throw err;
        //   else{
        //   //res.status(200).send(result);
        //   console.log("success");
          
        //   }
        //  });
      },

      '/about': (req, res) => {
        res.render('about');

      },

      '/login': (req, res) => {
        res.render('login')
      },

      '/dashboard': (req, res) => {
        db.collection('products').find({}).toArray( function (err, result1) {
          if (err) throw err;
          console.log(result1);
          res.render('dashboard',{alldata:result1});
        });

      },


    },
    'post': {
      '/usersignup': (req, res) => {

        db.collection('user').insert({
          businessname: req.body.businessname
          , website: req.body.website
          , password: req.body.password
          , competitors: req.body.competitors
          , services: req.body.services
          , aditional: req.body.aditional
          , Pemail: req.body.Pemail
          , name: req.body.name
          , bemail: req.body.bemail
          , address: req.body.address
          , pin: req.body.pin
          , state: req.body.state
          , country: req.body.country
          , mobile: req.body.mobile
          , taddress: req.body.taddress
          , GWebuname: req.body.GWebuname
          , GWebpass: req.body.GWebpass
          , weblogin: req.body.weblogin
          , WebAdminUname: req.body.WebAdminUname
          , WebAdminpass: req.body.WebAdminpass
          , HostUname: req.body.HostUname
          , Hostpass: req.body.Hostpass
          , ticketid: []
        }, function (err, result) {
          if (err) throw err;
          else {

            res.status(200).send(result);
          }

        });

      },
      '/allimages':(req, res)=>{
        db.collection('products').insert({Title:img,image:{cn:cn,imn:imn}},function(err, result){
          if (err)throw err;

        });
      },
      '/fileupload': (req, res) => {

        var img,cn,imn;
      req.busboy.on('field', function(fieldname, val) {
           
           if(fieldname==="imgname"){
            img=val;
         }
      });
      
        req.busboy.on('file', function (fieldname, file, filename) {
                   
              var stream = cloudy.uploader.upload_stream(function(result) { 
            cn=result.public_id+'.'+result.format;
            imn=result.url;
           
            onFinish();
            
            });
            
                  file.pipe(stream);
                
            });
      
        function onFinish() {
          db.collection('products').insert({Title:img,image:{cn:cn,imn:imn}},function(err, result){
            if (err)throw err;
      
            res.redirect('/dashboard?resp='+img);
          });
        }
          req.pipe(req.busboy);
      },
      '/imgdelete': (req, res) => {
        var a, lol;
        console.log(req.query.id);
        db.collection('products').findOne({ _id: ObjectId(req.query.id) }, function (err, result1) {
          if (err) throw err;
          else {
            a = result1.image;
            lol = result1.Title;
            console.log(a);
            // for (var i = 0; i < a.length; i++) { //FOR MULTIPLE IMAGE DELETION
            //   var l = a[i].cn.split('.');
            var delimg=a.cn.split('.');
              cloudy.uploader.destroy(delimg[0], function (result) { },  //l[0]
                { invalidate: true });
            // }
          }
          db.collection('products').remove({ _id: ObjectId(req.query.id) }, function (err, result) {
            if (err) throw err

            res.send(lol);
          });
        });

      },

    }
  }

  return h.route(routes);
}
