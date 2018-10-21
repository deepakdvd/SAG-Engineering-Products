'use strict';

module.exports={
	indexees:require('./routes')(),
	//backend:require('./routes/backend.js')(),
	//frontend:require('./routes/frontend.js')(),
	admin:require('./routes/admin.js')(),
	//blog:require('./blog')()
}