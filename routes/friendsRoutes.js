const express = require("express");
const { authCheck } = require("../middlewares/commonMiddlewares");
const { getFriends, addFriends, getUserToAddAsFriends } = require("../controller/friendsController");

const friendsRouter = express.Router();
friendsRouter.get("", authCheck, getFriends);

friendsRouter.post("", authCheck, addFriends);

friendsRouter.get("/users", authCheck, getUserToAddAsFriends);

module.exports = friendsRouter;
