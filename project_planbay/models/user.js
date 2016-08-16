var Mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var passportLocalMongoose = require('passport-local-mongoose');
var Schema = Mongoose.Schema;
var SALT_WORK_FACTOR = 10;

var User = new Schema({
    username: { type: String},
	email: {
			type: String,
			unique: true
			},
	password: {
		type: String
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



User.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

User.methods.comparePassword = function(attemptedPassword, callback) {
	bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	});
};

User.plugin(passportLocalMongoose);
module.exports = Mongoose.model('User',User);