// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
    comment:  {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var ratingSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var taskSchema = new Schema({
    name: {
        type: Stirng,
        required: true
    },
    time: String,
    detail: String
    //file: Buffer
});

//순서, 작성자가 기입해야하는 정보 - 남들이 기입해야하는 정보 - 자동으로 Update되는 정보
var planSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: String,

    category: {
        type: String,
        required: true
    },

    image: String,

    tasks: [{
        type:ObjectId,
        ref: 'Task'
    }],

    ratings: [ratingSchema],

    comments: [commentSchema],

    //the number of download
    download: Number

    //TODO: Version Control
}, {
    timestamps: true
});
// the schema is useless so far
// we need to create a model using it
var Plans = mongoose.model('Plan', planSchema);

// make this available to our Node applications

module.exports = Plans;