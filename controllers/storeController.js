const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter (req, file, next) {
    const isPhoto = file.mimetype.startsWith('image/');
    if(isPhoto) {
      next(null, true);
    } else {
      next({message: `don't use that crap`}, false);
    }
  }
};
const jimp = require('jimp');
const uuid = require('uuid');

exports.homePage = (req, res) => {
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store'});
};

exports.upload = multer(multerOptions).single('photo');
exports.resize = async (req, res, next) => {
  if (!req.file) {
    next();
    return;
  }
  console.log(req.file);
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
};

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();
    req.flash('success', `you added ${store.name}, dope`);
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });  
};

exports.editStore = async (req, res) => {
  // 1- find store given id
  const store = await Store.findOne({ _id: req.params.id });
  // 2- ensure user is store owner
  // 3- render the edit store form
  res.render('editStore', { title: `edit ${store.name}`, store});
};

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';
  const store = await Store.findOneAndUpdate(
    { _id: req.params.id},
    req.body,
    { 
      new: true,
      runValidators: true,
    }
  ).exec();
  req.flash('success', `u updated <a href="/stores/${store.slug}">${store.name}</a>`);
  res.redirect(`/stores/${store._id}/edit`);
};

exports.getStoreBySlug = async (req, res) => {
  const store = await Store.findOne({ slug: req.params.slug });

  res.render('getStore', {title: store.name, store});
};