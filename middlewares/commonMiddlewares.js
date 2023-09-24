const jwt = require('jsonwebtoken');
const userModel = require("../models/userModel");
const { constants } = require("../variables/variables");

exports.authCheck = async (req, res, next) => {
    try {

        let token;
		if (req.query?.bearer) token = req.query.bearer;
		else token = req.headers?.authorization?.split(" ")[1];

		const user = await userModel.findOne(
			{ token, deleted: false },
			{
				"name": 1,
				"email": 1,
				"email_verified": 1,
				"friend_list": 1
			}
		);
		if (!user) throw {status: 401, message:"Unauthorized access"};
		const tokenData = jwt.verify(token, constants.SECRET_KEY);
		if (Date.now() > tokenData.exp) throw {status: 401, message:"Unauthorized access"};
		req.userData = user;
		req.userToken = token;
		req.tokenData = tokenData;
		next();

    }catch (error){
        constants.error_resp.statusCode = error.status || 500;
        constants.error_resp.responseBody.status = 0;
        constants.error_resp.responseBody.message = error.message || "Internal server error";
        constants.error_resp.responseBody.details = null;
        return next(constants.error_resp);
    }
};