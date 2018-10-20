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

var cloudy = require('../cloudinary').ob();

module.exports = () => {

  let routes = {
    'get': {
      '/': (req, res) => {
        var R;

        db.collection('products').find({}).toArray(function (err, result) {
          if (err) throw err;

          for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [result[i], result[j]] = [result[j], result[i]];

            if(result.length==i+1){
              res.render('index', { random: result });
            }
        }
          
          // R = Math.floor(Math.random() * result.length);
          // console.log(R);
          // db.collection('products').find({}).limit(12).toArray(function (err, result1) {
          // res.render('index', { random: result1 });
          // });
        });
      },


      '/products': (req, res) => {

       
        db.collection('products').aggregate([
          { $group: { _id: "$category", num_tutorial: { $sum: 1 } } }
        ], function (err, result) {
          if (err) throw err;

          db.collection('products').find({}).limit(8).toArray(function(err, result1){
            if (err) throw err;

            res.render('products',{categories:result,products:result1});
          })
          
        });
      },

      '/about': (req, res) => {
        res.render('about');

      },

      '/single-product': (req, res) => {

        db.collection('products').findOne({ _id: ObjectId(req.query.id) }, function (err, result1) {
          if (err) throw err;

          db.collection('products').find({ category: result1.category }).limit(4).toArray( function (err, result) {
            if (err) throw err;

          res.render('single-product', { single: result1,related:result });
          });
        });
      },

      '/login': (req, res) => {
        if (!req.user && !req.session.user) {
          if(req.query.resp){
            res.render('login',{invalid:true});
          }else{
            res.render('login',{invalid:false});
          }
         
        }else{
          
          res.redirect('/dashboard');
        }
      },

      '/dashboard': (req, res) => {
       
        if (!req.user && !req.session.user) {
         
          res.redirect('/login');
        }else{
          
        
        db.collection('products').aggregate([
          { $group: { _id: "$category", num_tutorial: { $sum: 1 } } }
        ], function (err, result) {
          if (err) throw err;

          db.collection('products').find({}).toArray(function (err, result1) {
            if (err) throw err;

            if(req.query.resp){
              res.render('dashboard', { alldata: result1, categories: result,savesuccess:true });
            }else{
              res.render('dashboard', { alldata: result1, categories: result,savesuccess:false });
            }
            
          });

        });
      }
      
      },
      '/logout': (req, res) => {
       
        req.session.reset();
      
      res.redirect('/login');
      },


    },
    'post': {
      '/ckeckotp': (req, res) => {
        
        db.collection('userdetail').findOne({ _id: ObjectId(req.body.id)}, function (err, result) {

          if(req.body.otp==result.OTP){
            res.send(true);
          }else{
            res.send(false);
          }
          
        });
      },
      '/changepass': (req, res) => {
        
        db.collection('userdetail').update({ _id: ObjectId(req.body.id)},{$set:{password:req.body.pass}}, function (err, result) {

            res.send(true);
          
        });
      },
      '/usersignup': (req, res) => {

        db.collection('user').insert({
          businessname: req.body.businessname
         
          , ticketid: []
        }, function (err, result) {
          if (err) throw err;
          else {

            res.status(200).send(result);
          }

        });

      },
      '/session-access':(req,res) => {
  
        
        var name= req.body.username;
        var password= req.body.pass;
        db.collection('userdetail').findOne({ username: name}, function (err, result) {
          
          if(result){
            
        if (name==result.username && password==result.password){

          req.session.user = name;
          res.redirect('/dashboard');
        }else{

          res.redirect('/login?resp=invalid');
        }
      }else{
        res.redirect('/login?resp=invalid');
      }
      });
    },

      '/selectedcate': (req, res) => {
        var list=[];
       
        var Data=req.body.temp.split(',');
        
        
        db.collection('products').find({}).toArray( function (err, result) {
          if (err) throw err;
          if(result.length>0){
          
          for(var i=0;i<result.length;i++){
           
            for(var j=0;j<Data.length;j++)
            
            if(Data[j]==result[i].category){
              
              list.push(result[i]);
            }
            if(result.length==i+1){
              res.send(list);
            }
          }
        }else{
          res.send(list);
        }
        });
      },
      
      
      '/searchtitle':(req, res)=>{

var temp= '/'+req.query.data+'/i'
        db.collection('products').find({ Title: {$regex:req.query.data,$options:'i'} }).toArray( function (err, result) {
          if (err) throw err;

           
          res.send(result);
        });

      //   console.log("helllo");
      //   db.collection('products').aggregate([
      //     // { $match: {'category': { $regex: '/cate/g' } } },
      //     {$group : {_id : "$category", num_tutorial : {$sum : 1}}}
      //   // db.collection('products').find( { category: { $regex: req.query.key } } ).toArray(

      //  ], function(err, result){
      //     if (err)throw err;
      //     console.log(result);
      //     res.send(result)
      //   });
      },

      '/sendemailotp': (req, res) => {

        db.collection('userdetail').findOne({ username: req.body.otpemail}, function (err, result) {

          if(req.body.otpemail === result.username){

          

        var val = Math.floor(1000 + Math.random() * 9000);


        var transporter = nodemailer.createTransport({
          // host: 'smtp.zoho.com',
          //  port: 465,
          //  secure: true, 
          service: 'gmail',
         auth: {
           user: 'rahulworks273@gmail.com',
           pass: 'rAHUL273@'
         }
       });
       
       var mailOptions = {
         from: 'rahulworks273@gmail.com',
         to: 'rahulthakare273@gmail.com',
         subject: 'OTP',
         html: 'The One Time Password Is <b>'+val+'<b>'
       };
       
       transporter.sendMail(mailOptions, function(error, info){
         if (error) {
           return console.log(error);
         } else {
           console.log('Email sent: ' + info.response);
           db.collection('userdetail').update({_id: ObjectId(result._id)},{$set:{OTP:val}}, function (err, result1) {
            res.render('resetpass',{data:result});
           });
         }
       });
      }else{}

      });
      },


      '/allimages': (req, res) => {
        db.collection('products').insert({ Title: img, image: { cn: cn, imn: imn } }, function (err, result) {
          if (err) throw err;

        });
      },
      '/fileupload': (req, res) => {

        var img, cn, imn, features, specifications, category, description, product_detail, additional_info,pcode;
        req.busboy.on('field', function (fieldname, val) {

          if (fieldname === "imgname") {
            img = val;
          }
          if (fieldname === "cate") {
            category = val;
          }
          if (fieldname === "desc") {
            description = val;
          }
          if (fieldname === "pdetail") {
            product_detail = val;
          }
             if(fieldname==="pcode"){
              pcode=val;
           }
          if (fieldname === "feature") {
            features = val;
          }
          if (fieldname === "specifi") {
            specifications = val;
          }
          if (fieldname === "addinfo") {
            additional_info = val;
          }
        });

        req.busboy.on('file', function (fieldname, file, filename) {

          var stream = cloudy.uploader.upload_stream(function (result) {
            cn = result.public_id + '.' + result.format;
            imn = result.url;

            onFinish();

          });

          file.pipe(stream);

        });

        function onFinish() {
          var featu = features.split(',');
          var speci = specifications.split(',');
          var addti = additional_info.split(',');
          var product = product_detail.split(',');
          // var product2=product_detail2.split(',');
          db.collection('products').insert({
            Title: img,
            image: { cn: cn, imn: imn },
            category: category,
            features: featu,
            specifications: speci,
            product_detail: product,
            additional_info: addti,
            description: description,
            product_code:pcode
          }, function (err, result) {
            if (err) throw err;

            res.redirect('/dashboard?resp=' + img);
          });
        }
        req.pipe(req.busboy);
      },
      '/imgdelete': (req, res) => {
        var a, lol;
        
        db.collection('products').findOne({ _id: ObjectId(req.query.id) }, function (err, result1) {
          if (err) throw err;
          else {
            a = result1.image;
            lol = result1.Title;
           
            // for (var i = 0; i < a.length; i++) { //FOR MULTIPLE IMAGE DELETION
            //   var l = a[i].cn.split('.');
            var delimg = a.cn.split('.');
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
