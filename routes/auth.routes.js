const express = require("express");
const User = require("../models/User.model");
const router = express.Router();
const bcrypt = require("bcryptjs");

/* GET Signup page */
router.get("/signup", (req, res, next) => {
	res.render("auth/signup");
});

/* POST data to register a new user */
router.post("/signup", async (req, res, next) => {
	console.log(req.body);
	const payload = { ...req.body };
	delete payload.password;

	const salt = bcrypt.genSaltSync(13);

	payload.passwordHash = bcrypt.hashSync(req.body.password, salt);

	try {
		const newUser = await User.create(payload);
		res.send(newUser);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
