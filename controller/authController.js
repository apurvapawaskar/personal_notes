const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("../models/userModel");
const { constants } = require("../variables/variables");

exports.signupController = async (req, res, next) => {
	try {
		const userExists = await userModel.findOne({
			email: req.body.email,
			deleted: false,
		});
		if (userExists) {
			throw { status: 400, emessage: "User already exists" };
		}

		const epassword = await bcrypt.hash(req.body.password, 10);

		const userData = new userModel({
			name: req.body.name,
			email: req.body.email,
			password: epassword,
		});

		const savedUser = await userData.save();

		if (!savedUser) {
			throw { emessage: "Error while saving." };
		}

		const {
			_id,
			__v,
			token,
			created_at,
			updated_at,
			password,
			deleted,
			email_otp,
			email_otp_expiry,
			email_verified,
			...sendThis
		} = savedUser._doc;

		res.status(201).json({
			status: 1,
			message: "",
			details: { ...sendThis, id: _id, emv: email_verified },
		});
	} catch (error) {
		constants.error_resp.statusCode = error.status || 500;
		constants.error_resp.responseBody.status = 0;
		constants.error_resp.responseBody.message =
			error.emessage || "Internal server error";
		constants.error_resp.responseBody.details = null;
		return next(constants.error_resp);
	}
};

exports.loginController = async (req, res, next) => {
	try {
		const email = req.body.email;
		const epassword = req.body.password;
		const userData = await userModel.findOne({ email, deleted: false });

		if (!userData) {
			throw { status: 200, emessage: "No user found" };
		}

		const valid = await bcrypt.compare(epassword, userData.password);
		if (!valid) {
			throw { status: 400, emessage: "Invalid username/password" };
		}

		const payload = {
			iat: Date.now(),
			exp: Date.now() + 3600000,
		};

		const jwttoken = jwt.sign(payload, constants.SECRET_KEY);

		const updatedData = await userModel.findOneAndUpdate(
			{ email, deleted: false },
			{ token: jwttoken },
			{ new: true }
		);

		if (!updatedData) {
			throw {};
		}

		const {
			_id,
			__v,
			token,
			created_at,
			updated_at,
			password,
			deleted,
			email_otp,
			email_otp_expiry,
			email_verified,
			...sendThis
		} = userData._doc;

		res.status(200).json({
			status: 1,
			message: "",
			details: {
				...sendThis,
				id: _id,
				emv: email_verified,
				token: jwttoken,
			},
		});
	} catch (error) {
		constants.error_resp.statusCode = error.status || 500;
		constants.error_resp.responseBody.status = 0;
		constants.error_resp.responseBody.message =
			error.emessage || "Internal server error";
		constants.error_resp.responseBody.details = null;
		return next(constants.error_resp);
	}
};
