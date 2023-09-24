const notesModel = require("../models/notesModel");
const { constants } = require("../variables/variables");
const ObjectId = require('mongoose').Types.ObjectId;

exports.getNotes = async (req, res, next) => {
	try {
		const limit = +req.query.limit || 5;
		const offset = +req.query.offset || 0;

		let notes = await notesModel.aggregate([
			{
				$match: {
					$or: [
						{
							author: new ObjectId(req.userData._id),
						},
						{
							author: {
								$in: req.userData.friend_list,
							},
						},
					],
					deleted: false,
				},
			},
			{
				$sort: {
					created_at: -1,
				},
			},
			{
				$skip: offset * limit,
			},
			{
				$limit: limit,
			},
			{
				$group: {
					_id: null,
					data: {
						$push: "$$ROOT",
					},
				},
			},
		]);

		let total = await notesModel.aggregate([
			{
				$match: {
					$or: [
						{
							author: new ObjectId(req.userData._id),
						},
						{
							author: {
								$in: req.userData.friend_list,
							},
						},
					],
					deleted: false,
				},
			},
			{
				$count: "total",
			},
		]);

		if (!notes.length || !total.length) {
			throw { status: 200, emessage: "No notes found" };
		}

		notes = notes[0];
		total = total[0];

		const notesToSend = notes.data.map((note) => {
			return {
				id: note._id,
				title: note.title,
				data: note.data,
				date: note.created_at,
				author: note.author_name,
				canEdit: String(note.author) == String(req.userData._id),
			};
		});

		res.status(200).json({
			status: 1,
			message: "",
			details: { data: notesToSend, total: total.total },
		});
	} catch (error) {
		constants.error_resp.statusCode = error.status || 500;
		constants.error_resp.responseBody.status = 0;
		constants.error_resp.responseBody.message =
			error.emessage || "Internal server error";
		constants.error_resp.responseBody.details = null;
		return next(constants.error_resp);
	}
}

exports.addNotes = async (req, res, next) => {
	try {
		if (
			!req.body?.title ||
			String(req.body.title).trim() === "" ||
			!req.body.data ||
			String(req.body.data).trim() === ""
		) {
			throw { status: 400, emessage: "Invalid requests" };
		}

		const noteData = new notesModel({
			title: String(req.body.title).trim(),
			data: String(req.body.data).trim(),
			author: req.userData._id,
			author_name: req.userData.name,
			created_at: Date.now(),
		});

		const savedData = await noteData.save();

		if (!savedData) {
			throw { emessage: "Error while saving the data" };
		}

		const {
			_id,
			__v,
			created_at,
			updated_at,
			deleted,
			author,
			author_name,
			...sendThis
		} = savedData._doc;

		res.status(200).json({
			status: 1,
			message: "",
			details: {
				...sendThis,
				id: _id,
				author: author_name,
				date: +created_at,
				canEdit: author == req.userData._id,
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
}

exports.editNotes = async (req, res, next) => {
	try {
		const { title, data } = req.body;

		const dataToUpdate = {
			updated_at: Date.now(),
		};

		if (title && String(title).trim()) {
			dataToUpdate["title"] = String(title).trim();
		}

		if (data && String(data).trim()) {
			dataToUpdate["data"] = String(data).trim();
		}

		const updatedRecord = await notesModel.findOneAndUpdate(
			{ _id: new ObjectId(req.body.id), deleted: false },
			dataToUpdate,
			{ new: true }
		);

		if (!updatedRecord) {
			throw { emessage: "Error saving the data" };
		}

		const {
			_id,
			__v,
			updated_at,
			created_at,
			deleted,
			author,
			author_name,
			...sendThis
		} = updatedRecord._doc;

		res.status(200).json({
			status: 1,
			message: "",
			details: {
				...sendThis,
				id: _id,
				canEdit: String(author) == String(req.userData._id),
				author: author_name,
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
}

exports.deleteNotes = async (req, res, next) => {
	try {
		if (!req.params.id || String(req.params.id).trim() === "") {
			throw { status: 400, emessage: "Invalid request" };
		}

		const deletedData = await notesModel.findOneAndUpdate(
			{ _id: new ObjectId(req.params.id), deleted: false },
			{ updated_at: String(Date.now()), deleted: true },
			{ new: true }
		);

		if (!deletedData?.deleted) {
			throw { status: 500, emessage: "Error deleting data" };
		}

		const {
			_id,
			__v,
			updated_at,
			created_at,
			deleted,
			author,
			author_name,
			...sendThis
		} = deletedData._doc;

		res.status(200).json({
			status: 1,
			message: "Record deleted",
			details: null,
		});
	} catch (error) {
		constants.error_resp.statusCode = error.status || 500;
		constants.error_resp.responseBody.status = 0;
		constants.error_resp.responseBody.message =
			error.emessage || "Internal server error";
		constants.error_resp.responseBody.details = null;
		return next(constants.error_resp);
	}
}