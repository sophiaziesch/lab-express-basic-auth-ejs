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

/* GET Login page */
router.get("/login", (req, res, next) => {
	res.render("auth/login");
});

/* POST data to check if user exists */
router.post("/login", async (req, res, next) => {
	try {
		const currUser = req.body;
		const checkUser = await User.find({ email: currUser.email.toLowerCase() });
		if (checkUser) {
			if (bcrypt.compareSync(currUser.password, checkUser.passwordHash)) {
				const logUser = { ...checkUser._doc };
				delete logUser.passwordHash;
			} else {
				res.render("auth/login", {
					errorMessage: "User and password do not match.",
					payload: { email: currUser.email },
				});
			}
		} else {
			res.render("auth/login", {
				errorMessage: "User and password do not match.",
				payload: { email: currUser.email },
			});
		}
	} catch (error) {
		console.log(error);
		res.render("/auth/login", {
			errorMessage: "There was an error on the server",
			payload: { email: email.currUser },
		});
	}
});

module.exports = router;
