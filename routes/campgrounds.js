const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn,validateUserInput,isAuthor} = require('../middleware')
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer')

const {storage} = require('../cloudinary')
const upload = multer({storage}) // dest where the file from req. will be saved


router.route('/')
.get(catchAsync(campgrounds.index))
.post(isLoggedIn,upload.array('image'), validateUserInput,catchAsync(campgrounds.createCampground))

router.get("/new", isLoggedIn, campgrounds.renderNew)
  
router.route('/:id')
.get(catchAsync( campgrounds.renderShow))
.put(isLoggedIn,isAuthor,upload.array('image'),validateUserInput,catchAsync( campgrounds.editCampground))
.delete(isLoggedIn,isAuthor,catchAsync(campgrounds.deleteCampground))
  
router.get("/:id/edit",isLoggedIn,isAuthor,catchAsync( campgrounds.renderEdit));
  
module.exports = router;