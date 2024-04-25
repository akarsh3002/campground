if(process.env.NODE_ENV !== "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const helmet = require('helmet')
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const path = require("path");
const session = require("express-session");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const campgrounds = require("./routes/campgrounds.js");
const reviews = require("./routes/reviews.js");
const users = require("./routes/users.js");
const mongoose = require("mongoose");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const mongoSanitize = require('express-mongo-sanitize');
const dbUrl = process.env.DB_URL || `mongodb://127.0.0.1:27017/yelp-camp`
mongoose
  .connect(dbUrl)
  .then(() => {
    console.log("Connection open with MONGO DB");
  })
  .catch((e) => {
    console.log(e);
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'itsasecret';

const store = new MongoStore({
mongoUrl:dbUrl,
secret,
touchAfter: 24*3600 //Time period in seconds 
})

store.on('error',function(e){
  console.log('Session store error')
})
const sessionConfig = {
  store,
  name: 'Cookie',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet({ crossOriginEmbedderPolicy: true, contentSecurityPolicy: false  }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.activeUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", users);
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);
app.use(express.static(path.join(__dirname, "public")));


app.get('/',(req,res)=>{
res.render('home')
})

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Page not found" } = err;
  if (!err.message) err.message = "Something is wrong";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("On port 3000");
});
