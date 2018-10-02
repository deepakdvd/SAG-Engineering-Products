'use strict';

var cloudy=require('cloudinary');

cloudy.config({ 
  cloud_name: 'inkincaps', 
  api_key: '355585567713279', 
  api_secret: '4fG1qgMLjCk4mcFanhrpU-IUU-s' 
});
exports.ob= function(){
	return cloudy ;
}
