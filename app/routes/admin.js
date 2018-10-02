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


var readHTMLFile = function(path, callback) {
  fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
      if (err) {
          throw err;
          callback(err);
      }
      else {
          callback(null, html);
      }
  });
};

var transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure:true,
  auth: {
    user: 'hello@seoz.com.au',
    pass: 'admin@123'
  }
});

  
module.exports=() => {
  
  let routes={
  'get':{
    '/login':(req,res)=>{
     
      db.collection('managefile').findOne({userid:req.query.id},function(err, result){
        if(err)throw err;
        else{
          db.collection('plans').findOne({userid:req.query.id},function(err, result1){
           
            var obj={plans:result1,file:result}
            res.status(200).send(obj);
          });
        }
           
       });
    },
    
    
    '/editbasic':(req,res)=>{
      db.collection('user').findOne({_id:ObjectId(req.query.id)},function(err, result){
        if(err)throw err;
        else{
        res.status(200).send(result);
        }
       });
      },

      '/clientview':(req,res)=>{
        db.collection('user').findOne({_id:ObjectId(req.query.id)},function(err, result){
          if(err)throw err;
          else{
          res.status(200).send(result);
          }
         });
        },

      '/faqdata':(req,res)=>{
        db.collection('faq').find({}).toArray(function(err, result){
          if(err)throw err;
          else{
          res.status(200).send(result);
          }
         });
        },

        '/userdata':(req,res)=>{
         
           db.collection('user').findOne({_id:ObjectId(req.query.id)},function(err, result){
            if(err)throw err;
            else{
            res.status(200).send(result);
            }
             
           });
           
            },
      '/clientecheck':(req,res)=>{
       
        var email=req.query.email.toLowerCase();
        
        db.collection('user').find({Pemail:email}).toArray(function(err, result){
          if(err)throw err;
          else{
           
            res.status(200).send(result);
          }
        });
          
        },

        

        '/allplans':(req,res)=>{
          db.collection('seozplans').find({}).toArray(function(err, result){
            if(err)throw err;
            else{
             
              res.status(200).send(result);
            }
          });
          
        },
        '/formcheck':(req,res)=>{
          db.collection('user').findOne({_id:ObjectId(req.query.id)},function(err, result){
            if(err)throw err;
            else{
             
              res.status(200).send(result);
            }
          });
          
        },
        '/getcountmember':(req,res)=>{
          db.collection('user').count(function(err,result){
            if(err) throw err
            else{
              
              res.status(200).send(result.toString());
            }
          })
        },

        '/fileapprove':(req,res)=>{
          
          db.collection('managefile').update({userid:req.query.id,"DOC.DOCfile":req.query.did},{$set:{"DOC.$.approve":1}},function(err,result){
            if(err) throw err
            else{
              
              res.status(200).send(result);
            }
          })
        },
        

        '/usersfileupload':(req,res)=>{
          db.collection('user').find({}).toArray(function(err,result){
            if(err) throw err;
            else{
              res.status(200).send(result);
            }
          });
        },

        '/clientlist':(req,res)=>{
          db.collection('user').find().toArray(function(err,result){
            if(err) throw err;
            else{
              res.status(200).send(result);
            }
          });
        },
        '/userticket':(req,res)=>{
          
          var zendesk = new Zendesk({
            url: 'https://seozhello.zendesk.com', // https://inkincapssupport.zendesk.com
            email: 'hello@seoz.com.au', // me@example.com
            token: 'NP09PWbCr9HiU5n214aaTukw72M2B48sF7UAnpPa' // hfkUny3vgHCcV3UfuqMms4z3W2f6ftjPT
          });
          // List all tickets

        zendesk.tickets.list().then(function(tickets){
         
          db.collection('user').findOne({_id:ObjectId(req.query.id)},function(err,result){
            if(err) throw err;
            else{
            var all=[];
            var i=0;
            tickets.forEach(function(dat,index){
              
              if(result.ticketid.indexOf(dat.id)>-1){
                all.push(dat);
              }
              i++;
              
              if(i==tickets.length){
                res.status(200).send(all);
              }
              
            });
    
            }
          });
        });
        },
        '/memberdetails':(req,res)=>{
          var id =req.query.id;
          db.collection('user').findOne({_id:ObjectId(id)},function(err,result){
            if(err) throw err;
            else{
              res.send(result);
            }
          });
        }
        
        
},
  'post':{
    '/usersignup':(req,res)=>{
     
      db.collection('user').insert({
        businessname:req.body.businessname
        ,website:req.body.website
        ,password:req.body.password
        ,competitors:req.body.competitors
        ,services:req.body.services
        ,aditional:req.body.aditional
        ,Pemail:req.body.Pemail
        ,name:req.body.name
        ,bemail:req.body.bemail
        ,address:req.body.address
        ,pin:req.body.pin
        ,state:req.body.state
        ,country:req.body.country
        ,mobile:req.body.mobile
        ,taddress:req.body.taddress
        ,GWebuname:req.body.GWebuname
        ,GWebpass:req.body.GWebpass
        ,weblogin:req.body.weblogin
        ,WebAdminUname:req.body.WebAdminUname
        ,WebAdminpass:req.body.WebAdminpass
        ,HostUname:req.body.HostUname
        ,Hostpass:req.body.Hostpass
        ,ticketid:[]},function(err, result){
        if(err) throw err;
        else{
          
          res.status(200).send(result);
        }
              
      });
      
    },
    '/updatemember':(req,res)=>{
      var id=req.query.id;
      db.collection('user').update({_id:ObjectId(id)},{
        businessname:req.body.businessname
        ,website:req.body.website
        ,password:req.body.password
        ,competitors:req.body.competitors
        ,services:req.body.services
        ,aditional:req.body.aditional
        ,Pemail:req.body.Pemail
        ,name:req.body.name
        ,bemail:req.body.bemail
        ,address:req.body.address
        ,pin:req.body.pin
        ,state:req.body.state
        ,country:req.body.country
        ,mobile:req.body.mobile
        ,taddress:req.body.taddress
        ,GWebuname:req.body.GWebuname
        ,GWebpass:req.body.GWebpass
        ,weblogin:req.body.weblogin
        ,WebAdminUname:req.body.WebAdminUname
        ,WebAdminpass:req.body.WebAdminpass
        ,HostUname:req.body.HostUname
        ,Hostpass:req.body.Hostpass},function(err, result){
        if(err) throw err;
        else{
          
          res.status(200).send(result);
        }
              
      });
      
    },
    '/delmember':(req,res)=>{
      var id=req.query.id
      db.collection('user').remove({_id:ObjectId(id)},function(err,result){
        if(err) throw err;
        else {
          res.status(200).send(result);
        }
      });
    },
    '/pdfuploadfile':(req,res)=>{
     
       db.collection('managefile').findOne({userid:req.body.id},function(err,result1){
        var p=result1.pfile-1;
          db.collection('managefile').update({userid:req.body.id},{$push:{PDF:{PDFfile:req.body.uploaderDocuments,pdfmodifiedAt:now.getTime(),
            pname:req.body.plan,start:req.body.start,end:req.body.end}}},function(err,result){
            if(err) throw err;
            else {
              db.collection('managefile').update({userid:req.body.id},{$set:{pfile:p}},function(err,res1){
                if(err)throw err;
                res.status(200).send(res1);
              });
              
            }
          });
     });
    },

    '/docuploadfile':(req,res)=>{
      db.collection('managefile').findOne({userid:req.body.id},function(err,result1){
        var p=result1.dfile-1;
        db.collection('managefile').update({userid:req.body.id},{$push:{DOC:{DOCfile:req.body.docuploaderDocuments,send:req.body.send,docmodifiedAt:now.getTime(),
          pname:req.body.plan,start:req.body.start,end:req.body.end,approve:0}}},function(err,result){
          if(err) throw err;
          else {
            db.collection('managefile').update({userid:req.body.id},{$set:{dfile:p}},function(err,res1){
              if(err)throw err;
              res.status(200).send(res1);
              sendmail();
            });
          }
        });
   });





   function sendmail(){
    db.collection('user').findOne({_id:ObjectId(req.body.id)},function(err,resut){
    var pat=path.resolve(__dirname, '..','email/admindoc_upload.html');
    readHTMLFile(pat, function(err, html) {
    var template = handlebars.compile(html);
    var replacements = {
        doc: 'http://seoz.com.au/DOC/'+req.body.docuploaderDocuments,
        website:resut.website
    };
    var htmlToSend = template(replacements);
var mailOptions = {
    from: '"Seoz Team"<hello@seoz.com.au>',
    to: req.body.Pemail, // list of receivers (who receives)
    //cc:'',
    subject: 'Welcome To Seoz.com.au.', // Subject line
    html:htmlToSend
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    
     console.log('Message %s sent: %s', info.messageId, info.response);
    // console.log(info.accepted+'/'+info.rejected+':'+info.pending);

    });

    });
  });

  }











    },

    '/xlsuploadfile':(req,res)=>{
      db.collection('managefile').findOne({userid:req.body.id},function(err,result1){
        var p=result1.xfile-1;
        db.collection('managefile').update({userid:req.body.id},{$push:{XLS:{XLSfile:req.body.xlsuploaderDocuments,xlsmodifiedAt:now.getTime(),
          pname:req.body.plan,start:req.body.start,end:req.body.end}}},function(err,result){
          if(err) throw err;
          else {
            db.collection('managefile').update({userid:req.body.id},{$set:{xfile:p}},function(err,res1){
              if(err)throw err;
              res.status(200).send(res1);
            });
          }
        });
  //     }else{
  //     db.collection('user').update({_id:ObjectId(req.body.id)},{$set:{XLS:[{XLSfile:req.body.xlsuploaderDocuments,xlsmodifiedAt:now.toLocaleTimeString("en-us", options)}]}},function(err,result){
  //       if(err) throw err;
  //       else {
  //         res.status(200).send(result);
  //       }
  //     });
  //   }
   });
    },
    '/userdocuploadfile':(req,res)=>{
        db.collection('user').findOne({_id:ObjectId(req.body.id)},function(err,data){
        db.collection('managefile').update({userid:req.body.id,"DOC.docmodifiedAt":req.body.mody},{$set:{"DOC.$.userDOCfile":req.body.docuploaderDocuments,"DOC.$.usersend":req.body.send,"DOC.$.userdocmodifiedAt":now.getTime(),
          "DOC.$.userpname":req.body.plan,"DOC.$.userstart":req.body.start,"DOC.$.userend":req.body.end,"DOC.$.approve":1}},function(err,res1){
          if(err) throw err;
          else {
              res.status(200).send(res1);
              var mailOptions = {
                from: '"Seoz Team"<hello@seoz.com.au>',
                to: 'hello@seoz.com.au',
                subject: 'User Doc File Added',
                html:'<H2>An User has Uploded an Content Doc</H2><p>Of Website: "'+data.website+'"</p><a href="http://seoz.com.au/DOC/"'+req.body.docuploaderDocuments+'" download >"http://seoz.com.au/DOC/"'+req.body.docuploaderDocuments+'</a><p>you can download the doc file from above given link.</p>' 
              };
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });

          }
        });
      });
    },

    '/adminlogin':(req,res)=>{
      var lsconfig={
        'secret': 'm!!lb0rnskret@@key',
        'algorithm': 'aes-256-ctr'
    };
    var email=req.body.Email.toLowerCase();
      if(req.body.Email&&req.body.Password&&email=='admin@seoz.com.au'&&req.body.Password=='Password@123'){
        var dataValues={Email:req.body.Email,Password:req.body.Password};
        var token = jwt.sign(dataValues,lsconfig.secret, {
          expiresIn: 60 * 60 // expires in 1 hours
      });

      var sendObj = {
          success: true,
          message: 'Enjoy your token!',
          token: token,
          email: "Admin",
          fullname: "Admin",
          id: "Admin"
      };

      res.status(200).send(sendObj).end();
     
      }
      else{
        var sendObj = {
          success: false,  
          };
          res.send(sendObj);
      }
    },
    '/clientsupport':(req,res)=>{
      console.log(req.body);
      var zendesk = new Zendesk({
        url: 'https://seozhello.zendesk.com', // https://example.zendesk.com
        email: 'hello@seoz.com.au', // me@example.com
        token: 'NP09PWbCr9HiU5n214aaTukw72M2B48sF7UAnpPa' // hfkUny3vgHCcV3UfuqMFZWDrLKms4z3W2f6ftjPT
      });

        // Create a ticket
        zendesk.tickets.create({
          subject: req.body.subject,
          comment: {
            body: req.body.desc
          }
        }).then(function(result){
          console.log(result);
          db.collection('user').update({_id:ObjectId(req.body.id)},{$push:{ticketid:result.ticket.id}},function(err, resu){
            res.status(200).send(result);
          });
          
        });

        // List all tickets

        // zendesk.tickets.list().then(function(tickets){
        //   console.log(tickets);
        // });
        
       },

    '/addplans':(req,res)=>{ 
      db.collection('seozplans').insert({planname:req.body.pname,planprice:req.body.pprice,planduration:req.body.ptime,
      plankeys:req.body.ptime},function(err, result){
        if(err)throw err;
        else{
          res.status(200).send(result);
        }
      });
    },
    '/clientform':(req,res)=>{
     var comp=req.body.competitors.split(",");
     var serv=req.body.services.split(",");
      db.collection('user').insert({businessname:req.body.businessname
      ,website:req.body.website
      ,Pemail:req.body.Pemail
      ,aditional:req.body.aditional
      ,competitors:comp
      ,services:serv
      ,password:req.body.password
      ,ticketid:[]
      },function(err, result){
        if(err)throw err;
        else{
            res.status(200).send(result);
             sendmail();
        }
      });
      function sendmail(){
        var pat=path.resolve(__dirname, '..','email/accountcreate.html');
        readHTMLFile(pat, function(err, html) {
        var template = handlebars.compile(html);
        var replacements = {
            name: req.body.businessname,
            email: req.body.Pemail,
            website:req.body.website
        };
        var htmlToSend = template(replacements);
    var mailOptions = {
        from: '"Seoz Team"<hello@seoz.com.au>',
        to: req.body.Pemail, // list of receivers (who receives)
        //cc:'',
        subject: 'Welcome To Seoz.com.au.', // Subject line
        html:htmlToSend
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        
         console.log('Message %s sent: %s', info.messageId, info.response);
        // console.log(info.accepted+'/'+info.rejected+':'+info.pending);

    });

    // sending mail for admin 
          var mailOptions = {
            from: '"Seoz Team"<hello@seoz.com.au>',
            to: 'hello@seoz.com.au',
            subject: '"'+req.body.businessname+'" Has Registered For Seoz',
            html:'<H3>Business Name:"'+req.body.businessname+'"</H3><H3>Email:"'+req.body.Pemail+'"</H3><H3> Website:"'+req.body.website+'"</H3>' 
          };
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });




        });
        

      }
      
     
    },

    '/updateplan':(req,res)=>{
     
      var id=req.query.id;
      db.collection('seozplans').update({_id:ObjectId(id)},{$set:{planname:req.body.planname,planprice:req.body.planprice,planduration:req.body.planduration,
        plankeys:req.body.plankeys}},function(err, result){
          if(err)throw err;
          else{
            res.status(200).send(result);
            
          }
        });
      },

      
      
      '/clientpannellogin':(req,res)=>{
        
        var lsconfig={
          'secret': 'm!!lb0rns3kret@@key',
          'algorithm': 'aes-256-ctr'
      };
      var email=req.body.email.toLowerCase();
      db.collection('user').findOne({Pemail:email,password:req.body.password},function(err, result){
        if(err)throw err;
        else{
        if(result){
          if(email==result.Pemail&&req.body.password==result.password){
            var dataValues={Email:req.body.email,Password:req.body.password};
            var token = jwt.sign(dataValues,lsconfig.secret, {
              expiresIn: 60 * 60 // expires in 1 hours
          });
    
          var sendObj = {
              success: true,
              message: 'Enjoy your token!',
              token: token,
              email: req.body.email,
              fullname: "client",
              id: result._id
          };
          res.status(200).send(sendObj).end();
          }
        }else{
          var sendObj = {
            success: false,
            
        };
            res.send(sendObj);
          }
        
          // res.status(200).send(result);
        }
      });
    },

    '/passwordreset':(req,res)=>{
      db.collection('user').findOne({_id:ObjectId(req.body.id)},function(err, result1){
          if(result1.password==req.body.current){
            db.collection('user').update({_id:ObjectId(req.body.id)},{$set:{password:req.body.newpass}},function(err, result){
                if(err)throw err;
                else{
                  res.status(200).send(result);
                  
                }
              });
          }else{
            var jh={hg:"kk"}
            res.send(jh);
          }
        
      });
      
       },

       '/clientform2':(req,res)=>{
              db.collection('user').update({_id:ObjectId(req.body.id)},{$set:{name:req.body.name
              ,bemail:req.body.bemail
              ,address:req.body.address
              ,pin:req.body.pin
              ,state:req.body.state
              ,country:req.body.country
              ,mobile:req.body.mobile
              ,taddress:req.body.taddress}},function(err, result){
                  if(err)throw err;
                  else{
                    res.status(200).send(result);
                    
                  }
                });
         },
         
         '/clientform3':(req,res)=>{
          db.collection('user').update({_id:ObjectId(req.body.id)},{$set:{GWebuname:req.body.GWebuname
          ,GWebpass:req.body.GWebpass
          ,WebAdminUname:req.body.WebAdminUname
          ,weblogin:req.body.weblogin
          ,WebAdminpass:req.body.WebAdminpass
          ,HostUname:req.body.HostUname
          ,Hostpass:req.body.Hostpass
          }},function(err, result){
              if(err)throw err;
              else{
                res.status(200).send(result);
                
              }
            });
     },

       '/usersave':(req,res)=>{
        
         db.collection('user').update({_id:ObjectId(req.body.id)},{$set:{
           businessname:req.body.businessname
          ,website:req.body.website
          ,competitors:req.body.competitors
          ,services:req.body.services
          ,aditional:req.body.aditional
          ,Pemail:req.body.Pemail
          ,name:req.body.name
          ,bemail:req.body.bemail
          ,address:req.body.address
          ,pin:req.body.pin
          ,state:req.body.state
          ,country:req.body.country
          ,mobile:req.body.mobile
          ,taddress:req.body.taddress}},function(err, result){
           
            if(err)throw err;
            else{
              
              res.status(200).send(result);
            }
           
         });
         
          }
       

        
  }
}
  
  return h.route(routes);
}
