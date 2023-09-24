const userModel = require("../models/userModel");
const { constants } = require("../variables/variables");

exports.getProfile = async (req, res, next) => {
	try {
		const userData = await userModel.findOne(
			{ _id: req.userData._id, deleted: false },
			{ _id: 0, name: 1 }
		);

		if (!userData) {
			throw { message: "No user found", status: 400 };
		}

		res.status(200).json({
			status: 1,
			message: "",
			details: userData,
		});
	} catch (error) {
		constants.error_resp.statusCode = error.status || 500;
		constants.error_resp.responseBody.status = 0;
		constants.error_resp.responseBody.message =
			error.message || "Internal server error";
		constants.error_resp.responseBody.details = null;
		return next(constants.error_resp);
	}
};
