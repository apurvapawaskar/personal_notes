const { getProfile } = require("../controller/profileController");
const { authCheck } = require("../middlewares/commonMiddlewares");

const router = require("express").Router();

router.get("", authCheck, getProfile);

module.exports = router;
