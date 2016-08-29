var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    title: {
        type: String
    },
    duration: String,
    detail: String
})

//순서, 작성자가 기입해야하는 정보 - 남들이 기입해야하는 정보 - 자동으로 Update되는 정보
var privatePlanSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: String,

    category: {
        type: String,
        required: true
    },

    taskArr: [[taskSchema]],
    
    day: {
    	type: Number,
    	requried: true
    },
    
    origin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    }
}, {
    timestamps: true
});

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
    
    privatePlans: [privatePlanSchema],
    
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