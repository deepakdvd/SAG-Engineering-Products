'use strict';
const h=require('../helpers');
const db1=require('../dbconnect');
var db = db1.fdata();
 var dateFormat = require('dateformat');
    var now = new Date();
var ObjectId = require('mongoskin').ObjectID;
//var  result1=require('../cloudinary').ob();

module.exports=() => {

  let routes={
  'get':{
    
    '/review':(req,res)=>{
      
},
'/explainer/:choise':(req,res)=>{
  
      
},

'/getstart/:choise':(req,res)=>{
  
      
},

'/architectural/:choise':(req,res)=>{
  
      
},

'/3danimation/:choise':(req,res)=>{
  
      
},



},
  'post':{
    
    '/getstart':(req,res)=>{
            db.collection('users').insert({Name:req.body.name,Title:req.body.title,yourcomp:req.body.comp,mob:req.body.phone,email:req.body.email,budget:req.body.budget,Tzone:req.body.tzone,quetion:req.body.oques},function(err,result){

      });
    },
    


    '/contactform':(req,res)=>{
     
let mailOptions = {
   from: '"Squarepixel Team"<vaibhav@squarepixelstudios.net>',
    to: "vaish0115@gmail.com", 
    //subject: req.body.service+" ✔", // Subject line
    text: "Hello world ✔", // plaintext body
  //html: "<b>Name:</b><p>"+req.body.fname+"</p></br><b>Email:</b><p>"+req.body.email+"</p><b>Message</b><p>"+req.body.message+"</p>"
};


transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    
    console.log('Message %s sent: %s', info.messageId, info.response);
    console.log(info.accepted+'/'+info.rejected+':'+info.pending);

});
     
      res.redirect('/');
     
    },
    

    '/addreview':(req,res)=>{

      var name,imn,rv,cname,cn;
      req.busboy.on('field', function(fieldname, val) {
      if(fieldname==="name")name=val;
      if(fieldname==="imge")img=val;
      if(fieldname==="review")rv=val;
      if(fieldname==="coname")cname=val;
    });
        req.busboy.on('file', function (fieldname, file, filename) {
             
        if (fieldname) {
        var stream =  result1.uploader.upload_stream(function(result) { 
      cn=result.public_id+'.'+result.format;
      imn=result.url;

      Finish();
      
      });
      }
            file.pipe(stream);
      });

    function Finish(){

      db.collection('rview').insert({Name:name,image:imn,compname:cname,review:rv,cn:cn,status:0},function(err, result){

        res.redirect('/review?resp=true');
      });
          
        }
          req.pipe(req.busboy);
        },


    '/upreview':(req,res)=>{
      db.collection('rview').update({_id:ObjectId(req.query.id)},{$set:{status:1}})
          res.send(true);
        },
        
        '/exp-page':(req,res)=>{
            
             db.collection('webp').find({exp_page:req.query.name}).toArray(function(err,result){
              res.send(result);
              });
           
            
              
        },
        '/delreview':(req,res)=>{
          
        }
    

  }
}
  
  return h.route(routes);
}