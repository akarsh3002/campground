const ExpressError = require('./utils/ExpressError')
const Campground = require("./models/campground");
const {campgroundSchema,reviewSchema} = require('./schemas.js')
const Review = require('./models/review.js')

const isReviewAuthor = async(req,res,next) =>{
  const {id,reviewId} = req.params;
  const review = await Review.findById(reviewId);
  if(!review.author.equals(req.user._id)){
    req.flash('error','You do not have permission to do this!')
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}

const validateReview =  (req,res,next)=>{
  const {error} = reviewSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg,400)
  }
  else{
    next();
  }
}

const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
}

const validateUserInput = (req,res,next) => {
  const {error} = campgroundSchema.validate(req.body);
  if(error){
    const msg = error.details.map(el => el.message).join(',')
    throw new ExpressError(msg,400)
  }
  else{
    next();
  }
}

const isAuthor = async(req,res,next) =>{
  const {id} = req.params;
  const campground = await Campground.findById(id);
  if(!campground.author.equals(req.user._id)){
    req.flash('error','You do not have permission to do this!')
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
}


module.exports.isLoggedIn = isLoggedIn
module.exports.validateUserInput = validateUserInput
module.exports.isAuthor = isAuthor
module.exports.validateReview = validateReview
module.exports.isReviewAuthor = isReviewAuthor
