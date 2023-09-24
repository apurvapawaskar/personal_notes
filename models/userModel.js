const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
	name: { type: String, required: true },
	password: { type: String, required: true },
	email: { type: String, required: true },
	email_otp: { type: String, default: "" },
	email_otp_expiry: { type: String, default: "" },
	email_verified: { type: Boolean, default: false },
	friend_list: [
		{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
	],
	token: { type: String, default: "" },
	created_at: { type: String, default: Date.now() },
	updated_at: { type: String, default: Date.now() },
	deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
