var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

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
	
	plans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    }],
    
	OauthId: {
		type:String
	},
	
	OauthToken: {
		type:String
	},
	
	wunderlistToken: {
		type:String
	},
	
	admin: {
		type:Boolean,
		default: false
	}
});

User.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', User);