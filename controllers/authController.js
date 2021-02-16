const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const {promisify} = require('util');

const signToken = id => {
  return jwt.sign({id: id}, process.env.JWT_SECRET, {
    // expiresIn: process.env.JWT_EXPIRES_IN 
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt,
    role: req.body.role,
    photo: req.body.photo,
    PasswordResetToken: req.body.PasswordResetToken,
    passwordResetExpires: req.body.passwordResetExpires
  })

  const token = signToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token,
    data: {
      user: newUser
    }
  })

})

exports.login = catchAsync(async (req, res, next) => {
  const {email, password} = req.body;
  //1) check if email and password exist
  if(!email || !password) {
    next(new AppError('Please provide email and password!', 400))
  }
  //2) Check if user exists && password is correct
   const user = await User.findOne({email: email}).select('+password');

  if(!user || !(user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401 ))
  }

  //3) If everything ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  })
})

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    console.log("hei, this is working ")
    token = req.headers.authorization.split(' ')[1];
  }

  console.log(token);

  if(!token) {
    return next(new AppError('You are not logged in! Please log in to get access.'))
  }
  // 2.verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  //3. Check if user still exists
  const freshUser = await User.findById(decoded.id);

  if(!freshUser) {
    return next(
      new AppError(
        'The uesr belonging to this token does no longer exist.',
        401
      )
    );
  }
    
  //4. Check if user changed password after the token was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again', 401));
  }

  //GRANT ACCESS TO PRTECTED ROUTE
  req.user = freshUser;
  next();
})

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // console.log(req.user);
    if(!roles.includes(req.user.role)){
      return next(
        new AppError('You do not have the permission to perform this action', 403)
      );
    }
    next();
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1 get user based on posted email
  const user = await User.findOne({email: req.body.email})
  if(!user) {
    return next(new AppError('There is no user with the email address', 404))
  }

  //2 generate the randam reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({validateBeforeSave: false}); 


  //3 send it to user's email
})

exports.resetPassword = (req, res, next) => {}