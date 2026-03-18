const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image_url: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

// Static methods for compatibility
FoodItem.getAll = async function () {
  return await FoodItem.find({ available: true }).sort({
    category: 1,
    name: 1,
  });
};

FoodItem.getById = async function (id) {
  return await FoodItem.findOne({ _id: id });
};

FoodItem.getByCategory = async function (category) {
  return await FoodItem.find({ category, available: true });
};

FoodItem.create = async function (itemData) {
  const { name, description, price, image_url, category } = itemData;
  const item = new FoodItem({ name, description, price, image_url, category });
  const result = await item.save();
  return result._id.toString();
};

FoodItem.update = async function (id, itemData) {
  const { name, description, price, image_url, category, available } = itemData;
  await FoodItem.findByIdAndUpdate(
    id,
    { name, description, price, image_url, category, available },
    { new: true },
  );
  return await FoodItem.findById(id);
};

FoodItem.delete = async function (id) {
  await FoodItem.findByIdAndDelete(id);
};

module.exports = FoodItem;
