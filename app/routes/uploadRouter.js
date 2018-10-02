var express = require('express');
var uploadrouter = express.Router();
var bodyParser = require('body-parser');
var cloudinary = require('cloudinary');
var cloudinaryStorage = require('multer-storage-cloudinary');
var multer = require('multer');
const db1=require('../dbconnect');
var db = db1.fdata();
let path = require('path');
var DIR = path.join(__dirname, '../../', 'uploads/IMG');
const uuidv4 = require('uuid-v4');

var storage = multer.diskStorage({
	destination: function(req, file, callback) {
		callback(null, DIR)
	},
	filename: function(req, file, callback) {
		
		callback(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname))
	}
});

var upload = multer({ storage: storage }).array('fieldName', 20);

var router = function() {

    uploadrouter.route('/uploads')
        .post(function(req, res) {
        
            upload(req, res, function(err) {
                if (err) {
                    console.log(err);
                    return res.status(422).send("an Error occured")
                }
                return res.send(req.files);
            });
           

        });

    return uploadrouter;
}

module.exports = router;