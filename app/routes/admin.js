'use strict';
const h = require('../helpers');
const db1 = require('../dbconnect');
var db = db1.fdata();

//var dateFormat = require('dateformat');
var now = new Date();

var ObjectId = require('mongoskin').ObjectID;
//var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

var handlebars = require('handlebars');
var path = require('path');
var fs = require('fs');

module.exports = () => {

  let routes = {
    'get': {
      '/edit-product': (req, res) => {
        try {
          if (!req.user && !req.session.user) {

            res.redirect('/login');
          } else {
            db.collection('products').find({}).toArray(function (err, result1) {
              if (err) throw err;
              if (req.query.resp) {
                res.render('edit-product', { alldata: result1, response: true });
              } else {
                res.render('edit-product', { alldata: result1, response: false });
              }

            });
          }
        } catch (error) {
          res.send('Error While Procesing Your Request');
        }
      },



    },
    'post': {
      '/clientorder': (req, res) => {
        try {
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
            subject: 'Client Requirement',
            html: '<h4>Product Name:<h4>' + req.body.productname + '<br> <h4>Client Name:<h4>' + req.body.clientname + '<br> <h4>Client email:<h4>'
              + req.body.clientemail + '<br> <h4>Client Phone:<h4>' + req.body.clientphone + '<br> <h4>Message:<h4>' + req.body.message + '<br> <h4>Product Code:<h4>' + req.body.product_code

          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              //  db.collection('userdetail').update({_id: ObjectId(result._id)},{$set:{OTP:val}}, function (err, result1) {
              //   res.render('resetpass',{data:result});
              //  });
            }

          })
        } catch (error) {
          res.send('Error While Procesing Your Request');
        }
      },

      '/updateproduct': (req, res) => {
        try {
          var img, cn, imn, features, specifications, category, description, product_detail, additional_info, pcode, pid, oldimg;
          req.busboy.on('field', function (fieldname, val) {

            if (fieldname === "pid") {
              pid = val;
            }

            if (fieldname === "oldimg") {
              oldimg = val;
            }

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
            if (fieldname === "pcode") {
              pcode = val;
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
            if (filename) {

              var stream = cloudy.uploader.upload_stream(function (result) {
                cn = result.public_id + '.' + result.format;
                imn = result.url;

                onFinish();

              });
              file.pipe(stream);

            } else {
              onFinish1();
            }

          });

          function onFinish() {


            var featu = features.split(',');
            var speci = specifications.split(',');
            var addti = additional_info.split(',');
            var product = product_detail.split(',');
            // var product2=product_detail2.split(',');
            db.collection('products').update({ _id: ObjectId(pid) }, {
              $set: {

                image: { cn: cn, imn: imn },

                features: featu,
                specifications: speci,
                product_detail: product,
                additional_info: addti,
                description: description,

              }
            }, function (err, result) {
              if (err) throw err;

              res.redirect('/edit-product?resp=' + img);
            });

            var delimg = oldimg.split('.');
            cloudy.uploader.destroy(delimg[0], function (result) { },  //l[0]
              { invalidate: true });
          }

          function onFinish1() {
            var featu = features.split(',');
            var speci = specifications.split(',');
            var addti = additional_info.split(',');
            var product = product_detail.split(',');
            // var product2=product_detail2.split(',');
            db.collection('products').update({ _id: ObjectId(pid) }, {
              $set: {

                features: featu,
                specifications: speci,
                product_detail: product,
                additional_info: addti,
                description: description,
              }
            }, function (err, result) {
              if (err) throw err;

              res.redirect('/edit-product?resp=' + img);
            });
          }
          req.pipe(req.busboy);
        } catch (error) {
          res.send('Error While Procesing Your Request');
        }
      }
    }
  }

  return h.route(routes);
}
