const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Give your store a name.'
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
  tags: [String],
  created: {
    type: Date,
    default: Date.now,
  },
  location: {
    type: {  
      type: String,
      default: 'Point',
    },
    coordinates: [{
      type: Number,
      required: 'u must supply coordinates',
    }],
    address: {
      type: String,
      required: 'u need 2 tell us the address',  
    },
  },
  photo: String
});

storeSchema.pre('save', async function (next) {
  if (!this.isModified('name')) {
    next();
    return;
  }
  this.slug = slug(this.name);
  const slugReg = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
  const storesWithSlug = await this.constructor.find({slug: slugReg });
  if (storesWithSlug.length) {
    this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
  }
  next();
});

storeSchema.statics.getTagsList = function() {
  return this.aggregate([
    { $unwind: '$tags'},
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1, _id: 1 } }
  ]);
}

module.exports = mongoose.model('Store', storeSchema);