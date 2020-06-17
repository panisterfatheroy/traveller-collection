const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../config/config').get(process.env.NODE_ENV);

const SALT_I = 10;



// create schema

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    name:{
        type:String,
        maxlength:100
    },
    lastname:{
        type:String,
        maxlength:100
    },
    role:{
        type:Number,
        default:0
        
    },
    token:{
        type:String
    }
})


// pre-save: hash the password before saving
// middleware uses next
userSchema.pre('save', function(next){
    var user = this;

    if (user.isModified('password')) {
        // hash the password
        bcrypt.genSalt(SALT_I, function(err, salt){
            if(err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})


// create function to compare passwords (to be called in server.js)
userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}


// create a method to generate token
userSchema.methods.generateToken = function(cb) {
    var user = this;
    // generate token
    var token = jwt.sign(user._id.toHexString(), config.SECRET);

    // save all user info, with token
    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    });
}

// find user by token, check in cookies
userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    // decode contains the user id
    jwt.verify(token, config.SECRET, function(err, decode) {
        user.findOne({"_id":decode, "token":token}, function(err, user) {
            if(err) return cb(err);
            // return all user info if token is correct
            cb(null, user)
        })
    })
}


// delete token on logout
userSchema.methods.deleteToken = function(token, cb) {
    var user = this;

    // unset the value (to 1)
    user.update({$unset:{token:1}}, (err, user) => {
        if(err) return cb(err);
        cb(null, user);
    })
}



// create model
const User = mongoose.model('User', userSchema);

// export model
module.exports = { User }