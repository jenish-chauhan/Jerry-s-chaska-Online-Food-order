const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password_hash: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

// Static methods for compatibility
User.create = async function (userData) {
  const { name, email, password_hash, role = "user" } = userData;
  const user = new User({ name, email, password_hash, role });
  const result = await user.save();
  return result._id.toString();
};

User.findByEmail = async function (email) {
  return await User.findOne({ email: email.toLowerCase() });
};

User.findById = async function (id) {
  return await User.findOne({ _id: id }).select(
    "_id name email role createdAt",
  );
};

User.getAll = async function () {
  return await User.find({}).select("_id name email role createdAt");
};

module.exports = User;
