const express = require("express");
const http = require("http");
const cors = require("cors");

const database = require("./database/mongooseConnection");

const ObjectId = require("mongoose").Types.ObjectId;

const app = express();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", require("./routes/authRoutes"));

app.use("/notes", require("./routes/notesRoutes"));

app.use("/friends", require("./routes/friendsRoutes"));

app.use("/profile", require("./routes/profileRoutes"));

app.use((error, req, res, next) => {
	const output = {
		status: 0,
		message: "Internal server error",
		details: null,
	};

	res.status(error?.statusCode ? error.statusCode : 500).json(
		error?.responseBody ? error.responseBody : output
	);
});

const httpServer = http.createServer(app);
httpServer.listen(port, () => {
	console.log("Server started at port " + port);
});
