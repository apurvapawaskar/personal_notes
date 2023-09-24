const express = require("express");

const {
	getNotes,
	addNotes,
	editNotes,
	deleteNotes,
} = require("../controller/notesController");
const { authCheck } = require("../middlewares/commonMiddlewares");
const notesApiRouter = express.Router();

notesApiRouter.get("", authCheck, getNotes);

notesApiRouter.post("", authCheck, addNotes);

notesApiRouter.put("", authCheck, editNotes);

notesApiRouter.delete("/:id", authCheck, deleteNotes);

module.exports = notesApiRouter;
