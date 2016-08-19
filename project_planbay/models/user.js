var Mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = Mongoose.Schema;

var User = new Schema({
    username: { 
    	type: String, 
    	unique: true
    },
	password: {
		type: String
	},
	name: { 
		type: String 
	},
	picture: {
		type: String,
		default: 'images/default-profile.png'
	},
	OauthId: {
		type:String
	},
	OauthToken: {
		type:String
	},
	admin: {
		type:Boolean,
		default: false
	}
});

User.plugin(passportLocalMongoose);
module.exports = Mongoose.model('User', User);