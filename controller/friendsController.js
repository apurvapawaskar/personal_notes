const userModel = require("../models/userModel");
const { constants } = require("../variables/variables");


exports.getFriends = async (req, res, next) => {
	try {
		const userData = await userModel.findOne({ _id: req.userData._id });
		const friendsList = await userModel.populate(userData, {
			path: "friend_list",
			transform: (doc) => doc.name,
		});

		res.status(200).json({
			status: 1,
			message: "",
			details: friendsList.friend_list,
		});
	} catch (error) {
		constants.error_resp.statusCode = error.status || 500;
		constants.error_resp.responseBody.status = 0;
		constants.error_resp.responseBody.message =
			error.message || "Internal server error";
		constants.error_resp.responseBody.details = null;
		return next(constants.error_resp);
	}
}

exports.addFriends = async (req, res, next) => {
	try {
		if (!req.body?.id || String(req.body.id).trim() == "") {
			throw { message: "Invalid request", status: 400 };
		}

		const updatedData = await userModel.findOneAndUpdate(
			{ _id: req.userData._id, deleted: false },
			{ $push: { "friend_list": req.body.id } },
			{ new: true }
		);

		if (!updatedData) {
			throw { message: "Error while saving the data" };
		}

		res.status(200).json({
			status: 1,
			message: "",
			details: null,
		});
	} catch (error) {
		constants.error_resp.statusCode = error.status || 500;
		constants.error_resp.responseBody.status = 0;
		constants.error_resp.responseBody.message =
			error.message || "Internal server error";
		constants.error_resp.responseBody.details = null;
		return next(constants.error_resp);
	}
}

exports.getUserToAddAsFriends = async (req, res, next) => {
	try {
		const usersList = await userModel.find(
			{
				$and: [
					{ _id: { $ne: req.userData._id } },
					{ _id: { $nin: req.userData.friend_list } },
				],
				deleted: false,
			},
			{ "id": "$_id", "name": "$name", _id: 0}
		);

		res.status(200).json({
			status: 1,
			message: "",
			details: usersList,
		});
	} catch (error) {
		constants.error_resp.statusCode = error.status || 500;
		constants.error_resp.responseBody.status = 0;
		constants.error_resp.responseBody.message =
			error.message || "Internal server error";
		constants.error_resp.responseBody.details = null;
		return next(constants.error_resp);
	}
}