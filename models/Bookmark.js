const { Schema, model } = require("mongoose");

const bookmarkSchema = new Schema({
  title: { type: String, required: true, trim: true },
  url:   { type: String, required: true, trim: true },
  notes: { type: String, default: '' },
  tags:  [{ type: String }],
  user:  { type: Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = model("Bookmark", bookmarkSchema);