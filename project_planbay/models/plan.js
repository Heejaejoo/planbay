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
        max: 5
    },

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

var taskSchema = new Schema({
    title: {
        type: String
    },
    duration: String,
    detail: String
})

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

    taskArr: [[taskSchema]],
    
    dueDates: [{type: Date}],

    ratings: [ratingSchema],
    
    ratingsNum: {
        type:Number,
        default: 0
    },
    
    ratingsSum: {
        type:Number,
        default: 0
    },
    
    ratingsAvg: {
        type: Number,
        default: 0
    },
    
    comments: [commentSchema],
    
    commentsNum: {
        type:Number,
        default: 0
    },

    //the number of download
    download: {
        type: Number,
        default: 0
    },
    
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    //TODO: Version Control
}, {
    timestamps: true
});

//attach additional functions
var Plan = mongoose.model('Plan', planSchema);
module.exports = Plan;