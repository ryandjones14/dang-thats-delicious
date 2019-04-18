const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
  console.log(req.name);
  res.render('index');
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store'});
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