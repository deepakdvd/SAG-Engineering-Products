'use strict';
const h=require('../helpers');
const db1=require('../dbconnect');
var db = db1.fdata();
 var dateFormat = require('dateformat');
    var now = new Date();
var ObjectId = require('mongoskin').ObjectID;
//var  result1=require('../cloudinary').ob();
var handlebars = require('handlebars');
var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');
var options = {  
  weekday: "long", year: "numeric", month: "short",  
  day: "numeric", hour: "2-digit", minute: "2-digit"  
}; 
// for reading the file 
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
         
          auth: {
              user: 'hello@seoz.com.au',
              pass: 'admin@123'
          }
        });
  

module.exports=() => {

  let routes={
  'get':{
    
    '/logout':(req,res,next) =>{

      req.session.reset();
      
      res.redirect('/Admin');
    },
    '/dashtotal':(req,res) =>{
      db.collection('plans').find({}).toArray(function(err, result){
        if(err)throw err;
        res.status(200).send(result);
      });           
          },
    '/history':(req,res)=>{
      
      db.collection('plans').findOne({userid:req.query.id},function(err, result){
        res.status(200).send(result);
      }); 
          
        },


        '/plananduser':(req,res) =>{
          db.collection('plans').find({}).toArray(function(err, result){
            if(err)throw err;
            db.collection('user').find({}).toArray(function(err, result1){
              var obj={user:result1,plans:result}
              res.status(200).send(obj);
            });
          });        
        },

        '/adminfaq':(req,res)=>{
          
          db.collection('faq').insert({quetion:req.query.que,answers:req.query.ans},function(err, result){
            res.status(200).send(result);
          }); 
              
                 },
            '/delco':(req,res)=>{
         
              db.collection('faq').remove({_id:ObjectId(req.query.id)},function(err, result){
                res.status(200).send(result);
              }); 
                  
                },
          '/updatefaq':(req,res)=>{
        
                  db.collection('faq').update({_id:ObjectId(req.query.id)},{quetion:req.query.que,answers:req.query.ans},function(err, result){
                    res.status(200).send(result);
                  }); 
                      
           },
        
        '/checkpaydate':(req,res) =>{
         
          db.collection('plans').findOne({userid:req.query.id},function(err, result){
            res.status(200).send(result1);
          });     
        },  
        '/userplanchoose':(req,res) =>{
         
          db.collection('plans').find({userid:req.query.id}).toArray(function(err, result){
            
            res.status(200).send(result);
          });     
        },

        '/clientplan':(req,res) =>{
         
          db.collection('plans').find({userid:req.query.id}).toArray(function(err, result){
           
            res.status(200).send(result);
          });     
        },
        '/keyword':(req,res) =>{
         
           db.collection('keywords').findOne({userid:req.query.id,paymentid:req.query.payid},function(err, result){
           if(result){
             res.status(200).send(result);
           }else{
             var ac=[];
            res.status(200).send(ac);
           }
           });     
         },
         '/cancelP':(req,res) =>{
        
           db.collection('canceledplans').find({userid:req.query.id}).toArray(function(err, result){
            res.status(200).send(result);
           });     
         }
    
    
        
},
  'post':{
    '/client-pay-success':(req,res)=>{
     var count=parseInt(req.body.price);
     var pfile=0;
     var xfile=0;
     var dfile=0;
     var duration=0
     if(count<600){
        pfile=2;
        xfile=2;
        dfile=1;
        duration=1;
     }else if(count<3400){
      pfile=12;
      xfile=12;
      dfile=6;
      duration=6;
     }else{
      pfile=24;
      xfile=24;
      dfile=12;
      duration=12;
     }
      db.collection('plans').findOne({userid:req.body.id},function(err, result){
       
        if(result==null){
         
          db.collection('plans').insert({
            //currentplan:{userid:req.body.id,planName:req.body.name,planPrice:req.body.price,keywords:req.body.keywords,startdate:req.body.start,end:req.body.end},
            //futureplan:{userid:req.body.id,planName:req.body.name,planPrice:req.body.price,keywords:req.body.keywords},
            userid:req.body.id,
            plans:[{planname:req.body.name,price:req.body.price,keywords:req.body.keywords,startdate:req.body.start,enddate:req.body.end,paymentid:req.body.paymentid,duration:duration}]
            },function(err,result1){
            if(err)throw err;
            db.collection('managefile').insert({userid:req.body.id,
              PDF:[],
              DOC:[],
              XLS:[],
              pfile:pfile,xfile:xfile,dfile:dfile},function(err, result3){
            res.status(200).send(result3);
           
            sendmail(req.body.name,req.body.start,req.body.end,duration,req.body.price,req.body.id);
          });
          });
        }
        else{
        
            db.collection('plans').update({userid:req.body.id},{$push:{
              //currentplan:{userid:req.body.id,planName:req.body.name,planPrice:req.body.price,keywords:req.body.keywords,startdate:req.body.start,end:req.body.end},
              //futureplan:{userid:req.body.id,planName:req.body.name,planPrice:req.body.price,keywords:req.body.keywords,startdate:req.body.start,end:req.body.end},
              plans:{planname:req.body.name,price:req.body.price,keywords:req.body.keywords,startdate:req.body.start,enddate:req.body.end,paymentid:req.body.paymentid,duration:duration}
              }},function(err,result2){
              if(err)throw err;
              res.status(200).send(result2);
              
               sendmail(req.body.name,req.body.start,req.body.end,duration,req.body.price,req.body.id);
            });
            db.collection('managefile').findOne({userid:req.body.id},function(err, resu){
              if(err)throw err;
              var fg=resu.xfile+xfile;
              var as=resu.pfile+pfile;
              var bn=resu.dfile+dfile;
            db.collection('managefile').update({userid:req.body.id},{$set:{xfile:fg,pfile:as,dfile:bn}},function(err, result4){
              if(err)throw err;
            });
            });
        }
      });


     },

    '/newkeyword':(req,res)=>{
    
      db.collection('keywords').findOne({userid:req.body.id,paymentid:req.body.payid},function(err, result){
            if(result==null){

              db.collection('keywords').insert({userid:req.body.id,Pkeywords:[],Akeywords:req.body.keyy,
                paymentid:req.body.payid},function(err, result1){

                res.status(200).send(result1);
              });
            }else{
             
              db.collection('keywords').update({userid:req.body.id,paymentid:req.body.payid},{$set:{ Akeywords:req.body.keyy}},function(err,result3){
                // db.collection('keywords').update({userid:req.body.id,paymentid:req.body.payid},
                //     { $addToSet:{ Pkeywords:{$each:req.body.keyy}}},function(err,result2){
                    if(err)throw err;
                        res.status(200).send(result3);
                //});  
              });  
           }                               
    });


    },
    '/forgotreset':(req,res)=>{
      
          
            db.collection('user').update({_id:ObjectId(req.body.id)},{$set:{password:req.body.newpass}},function(err, result){
                if(err)throw err;
                if(result){
                  res.status(200).send({success:true});
                  
                }else{
                  res.status(200).send({success:false});
                }
              });
    },
    '/forgotPassword':(req,res)=>{
      db.collection('user').findOne({Pemail:req.body.email},function(err,result){
        if(result){
          var pat=path.resolve(__dirname, '..','email/ForgotPassword.html');
                readHTMLFile(pat, function(err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                  name: result.businessname,
                  id: result._id.toString()
                };
                var htmlToSend = template(replacements);
            var mailOptions = {
                from: '"Seoz Team"<hello@seoz.com.au>',
                to: result.Pemail, // list of receivers (who receives)
                subject: 'Password Reset', // Subject line
                html:htmlToSend
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }

              
              });
                });
          res.status(200).send({success:true});
        }else{
          res.status(200).send({success:false});
         
        }
      });
    },

    '/deletekeyword':(req,res)=>{
      
      db.collection('keywords').findOne({userid:req.body.id,paymentid:req.body.payid},function(err, result){
        if(err) throw err;
        
        var ty=result.Pkeywords;
        
      
       var fg= ty.splice(ty.indexOf(req.body.key),1);
      
        var hj=ty;
       
        db.collection('keywords').update({userid:req.body.id,paymentid:req.body.payid},{$set:{Pkeywords:hj}},function(err, result2){
          if(err) throw err;
          res.send(result2);
        });
      });
      
    },


    '/removekeyword':(req,res)=>{
      
      
       db.collection('keywords').update({userid:req.body.id,paymentid:req.body.payid},{$set:{ Akeywords:req.body.active}},function(err,result){
         if(err) throw err;
        db.collection('keywords').update({userid:req.body.id,paymentid:req.body.payid},{$set:{ Pkeywords:req.body.pre}},function(err,result1){
          if(err) throw err;
          res.send(result1);
        });
      })
      },
      
        
     '/addkeyword':(req,res)=>{
      db.collection('keywords').update({userid:req.body.id,paymentid:req.body.payid},{$push:{ Akeywords:req.body.key}},function(err,result){
          if(err) throw err;

          res.send(result)
            })
      
      },
      
      '/plancancel':(req,res)=>{
        var zx;
        var bb;
        db.collection('plans').findOne({userid:req.body.id,"plans.$.paymentid":req.body.paiyd},function(err, result){
         
         result.plans.forEach(element=> {
           if(element.paymentid==req.body.payid){
            zx={plancancelat:now.getTime(),userid:result.userid,plan:element};
            
           }
          
         });
          if(err)throw err;
          result.plans.forEach((element2,index)=> {
            if(element2.paymentid==req.body.payid){
              result.plans.splice(index,1);
              bb=result.plans;
            }
          })
          db.collection('plans').update({userid:req.body.id},{$set:{plans:bb}},function(err,result1){
           if(err)throw err;
            db.collection('canceledplans').insert(zx,function(err, result2){
              res.send(result2);
            });
           
            // for reseting the date 
            
            db.collection('plans').findOne({userid:req.body.id},function(err, data){
              
              var count=0;
              var oldend;
              data.plans.forEach((element1,index) => {
                var dt=now.getTime();
                
                if(element1.enddate>dt){
                 
                  if(count==0){
                    count++;
                    var st=new Date();
                    var th=new Date();
                    if(element1.duration==1){
                      
                      
                       element1.startdate=st.getTime();
                       th.setDate(th.getDate()+30);
                       element1.enddate=th.getTime();
                       oldend=th.getTime();
                       
                       
                    }else if(element1.duration==6){
                     
                       element1.startdate=st.getTime();
                       th.setDate(th.getDate()+180);
                       element1.enddate=th.getTime();
                       oldend=th.getTime();
                       
                    }else{
                    
                      
                       element1.startdate=st.getTime();
                       th.setDate(th.getDate()+360);
                       element1.enddate=th.getTime();
                       oldend=th.getTime();
                       
                      
                    }

                  }else{
                    
                    var st=new Date(oldend);
                    
                      if(element1.duration==1){
                        
                        
                         element1.startdate=st.getTime();
                         st.setDate(st.getDate()+30);
                         element1.enddate=st.getTime();
                         oldend=st.getTime();
                        
                         
                        
                      }else if(element1.duration==6){
                        
                         element1.startdate=st.getTime();
                         st.setDate(st.getDate()+180);
                         element1.enddate=st.getTime();
                         oldend=st.getTime();
                        
                      }else{
                      
                        
                         element1.startdate=st.getTime();
                         st.setDate(st.getDate()+360);
                         element1.enddate=st.getTime();
                         oldend=st.getTime();
                         
                      }


                  }
                  
                 }
                 if(data.plans.length-1==index){
                  
                  upto(data.plans);
                 }
              });
             
            });

          });
        });
        function upto(a){
         
          db.collection('plans').update({userid:req.body.id},{$set:{plans:a}},function(err,result1){
              if(err)throw err;

              else{
                db.collection('user').findOne({_id:ObjectId(req.body.id)},function(err,ret){

                  var ds = new Date(result.startdate);
                  var ed = new Date(result.enddate);
                  var st= ds.toLocaleTimeString("en-us", options);
                  var et= ed.toLocaleTimeString("en-us", options);
                    var stat=st;
                    var Endt=et;

                var pat=path.resolve(__dirname, '..','email/plancancel.html');
                readHTMLFile(pat, function(err, html) {
                var template = handlebars.compile(html);
                var replacements = {
                  name: ret.businessname,
                  planname: result.planname,
                  sdate:stat,
                  edate:Endt,
                  dur:result.duration
                };
                var htmlToSend = template(replacements);
            var mailOptions = {
                from: '"Seoz Team"<hello@seoz.com.au>',
                to: ret.Pemail, // list of receivers (who receives)
                subject: 'Welcome To Seoz.', // Subject line
                html:htmlToSend
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                // console.log('Message %s sent: %s', info.messageId, info.response);
                // console.log(info.accepted+'/'+info.rejected+':'+info.pending);
              });
                });

                // sending mail for admin 
          var mailOptions = {
            from: '"Seoz Team"<hello@seoz.com.au>',
            to: 'hello@seoz.com.au',
            subject: ret.businessname+' Has Canceled The Plan',
            html:'<H3>Business Name:"'+ret.businessname+'"</H3><H3>Plan Name:"'+result.planname+'"</H3><H3> Start Date:"'+stat+'"</H3><H3>End Date:"'+Endt+'"</H3><H3>Duration:"'+result.duration+'"</H3><H3>Website:"'+ret.website+'"</H3>' 
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
              
          });
        }
      }

  }
}
  
  return h.route(routes);

}


function sendmail(b,c,d,e,f,g){
  db.collection('user').findOne({_id:ObjectId(g)},function(err, resu){
   
    var ds = new Date(c);
    var ed = new Date(d);
    var st= ds.toLocaleTimeString("en-us", options);
    var et= ed.toLocaleTimeString("en-us", options);
      var stat=st;
      var Endt=et;
      
  var pat=path.resolve(__dirname, '..','email/planbuy.html');
    readHTMLFile(pat, function(err, html) {
    var template = handlebars.compile(html);
    var replacements = {
        name: resu.businessname,
        planname: b,//req.body.name
        sdate: stat,
        edate: Endt,
        dur: e,//duration
        price: f //req.body.price
    };
    var htmlToSend = template(replacements);

var mailOptions = {
    from: '"Seoz Team"<hello@seoz.com.au>',
    to: resu.Pemail, // list of receivers (who receives) 
    //cc:'',
    subject: 'Thanks For Purchase', // Subject line
    
    html:htmlToSend
};
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
   
});
    });
    // sending mail for admin 
    var mailOptions = {
      from: '"Seoz Team"<hello@seoz.com.au>',
      to: 'hello@seoz.com.au',
      subject: resu.businessname+'" Have Buy A Plan For Seoz',
      html:'<H3>Business Name:"'+resu.businessname+'"</H3><H3>Price:"'+f+'"</H3><H3> Website:"'+b+'"</H3>' 
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