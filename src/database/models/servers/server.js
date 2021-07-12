const mongoose = require("mongoose");

let hm = new mongoose.Schema({
  id: String,
  name: String,
  icon: String,
  ownerID: String,
  longDesc: String,
  shortDesc: String,
  tags: Array,
  link: String,
  status: String,
  premium: String,
  createForMe: { type: String, defaults: 'Non-Create' },
  bump: { type: Date, default: null },
  votes: { type: Number, default: 0 },
  bumps: { type: Number, default: 0 },
  analytics: Object,
  analytics_visitors: Number,
  analytics_joins: Number,
  country: Object,
  rates: Object
});

module.exports = mongoose.model("servers", hm);