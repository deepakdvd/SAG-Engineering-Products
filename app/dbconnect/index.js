'use strict';

const db=require('mongoskin').db('mongodb://Rahul:Rahul273@ds115523.mlab.com:15523/sagengineering');  

//mongodb://sagengineering:sag123456@ds115523.mlab.com:15523/sagengineering

//module.exports.db;


exports.fdata= function(){
	return db;
}
//'mongodb://picagro:picagro123@ds143744.mlab.com:43744/picagro'// like this put above
//mongodb://192.168.0.101:27017/squarepixel
//mongodb://<dbuser>:<dbpassword>@ds113915.mlab.com:13915/picagro