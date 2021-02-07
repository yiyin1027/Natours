const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt = require('bcryptjs');

//name, email, photo, password, pawordConfirm

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'An user must have a name'],
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'An user must have an email'],
    unique: true,
    lowercase: true,
    validate:[validator.isEmail, 'Please provide a valid email']
  },
  photo: String,
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: "user"
  },
  password:{
    type: String,
    required: [true, 'An user must have a password'],
    minlength: 8,
    select: false
  },
  passwordConfirm: {
    type: String,
    required: [true, 'An user must confirm password'],
    validate: {
      validator: function(el) {
        return el === this.password;
      }
    }
  },
  passwordChangedAt: Date
});

userSchema.pre('save', async function(next){
  if(!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12); 
  //delete passwordConfirm field
  this.passwordConfirm = undefined;
  next(); 
})

userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if(this.passwordChangedAt){
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )
    console.log(this.passwordChangedAt, JWTTimestamp);
    return JWTTimestamp < changedTimestamp;
  }
}

const User = mongoose.model("User", userSchema);

module.exports = User