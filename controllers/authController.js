const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({id: id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN 
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm
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
  if(req.headers.authorizaiton && req.header.authorizaiton.startsWith('Bearer')){
    token = req.headers.authorizaiton.split(' ')[1];
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

  next();  

  next();
})