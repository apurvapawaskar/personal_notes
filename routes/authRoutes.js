const express = require("express");

const { constants } = require("../variables/variables");

const {
	signupController,
	loginController,
} = require("../controller/authController");

const authApiRouter = express.Router();

authApiRouter.post(
	"/login",
	(req, res, next) => {
		try {
			if (
				(!req.body?.email || String(req.body.email).trim() === "") &&
				req.method != "PUT"
			) {
				throw { status: 400, message: "Email is required" };
			} else if (
				(!req.body?.password ||
					String(req.body.password).trim() === "") &&
				req.method != "PUT"
			) {
				throw { status: 400, message: "Password is required" };
			}
			next();
		} catch (error) {
			constants.error_resp.statusCode = error.status || 500;
			constants.error_resp.responseBody.status = 0;
			constants.error_resp.responseBody.message =
				error.message || "Internal server error";
			constants.error_resp.responseBody.details = null;
			return next(constants.error_resp);
		}
	},
	loginController
);

authApiRouter.post(
	"/signup",
	(req, res, next) => {
		try {
			console.log(req.body, req.params);
			if (
				(!req.body?.email || String(req.body.email).trim() === "") &&
				req.method != "PUT"
			) {
				throw { status: 400, message: "Email is required" };
			} else if (
				(!req.body?.password ||
					String(req.body.password).trim() === "") &&
				req.method != "PUT"
			) {
				throw { status: 400, message: "Password is required" };
			} else if (
				(!req.body?.name || String(req.body.name).trim() === "") &&
				req.method != "PUT"
			) {
				throw { status: 400, message: "Name is required" };
			}
			next();
		} catch (error) {
			constants.error_resp.statusCode = error.status || 500;
			constants.error_resp.responseBody.status = 0;
			constants.error_resp.responseBody.message =
				error.message || "Internal server error";
			constants.error_resp.responseBody.details = null;
			return next(constants.error_resp);
		}
	},
	signupController
);

module.exports = authApiRouter;
