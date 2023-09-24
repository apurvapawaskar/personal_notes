const mongoose = require("mongoose");

const notesSchema = mongoose.Schema({
	title: { type: String, required: true },
	data: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	author_name: { type: String, required: true },
	created_at: { type: String, default: Date.now() },
	updated_at: { type: String, default: "" },
	deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("Note", notesSchema);
