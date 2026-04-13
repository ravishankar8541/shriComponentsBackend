/*
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  productHeading: { type: String, required: true },
  url: { type: String },                    // optional for now (you can store file path later)
  price: { type: Number, required: true },
  efficiency: String,
  frequency: String,
  highVoltage: String,
  operatingTemperature: String,
  phase: String,
  powerScope: String,
  usage: String,
  supplyAbility: String,
  material: String,
  coolingType: String,
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  path: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  images: [imageSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);

*/




const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  productHeading: { type: String, required: true },
  url: { type: String },
  price: { type: Number, required: true },
  // Dynamic specifications array
  specs: [{
    label: { type: String },
    value: { type: String }
  }]
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  path: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  images: [imageSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);