const AUTH_ROUTER = require("../auth/authrouter").build();
const JWT = require("jsonwebtoken");
const HTTP_STATUS = require('http-status-codes');
const LOGGER = require("../../util/logger");
const USER_SERVICE = require("../../service/user.service");

AUTH_ROUTER.define()
    .path("/login")
    .post(async function (req, res) {
        let {username, password} = req.body;
        let user = await USER_SERVICE.getUserByUsername(username);
        if (user !== null && await user.validPassword(password)) {
            const payload = {
                user: user.username
            };
            let token = JWT.sign(payload, process.env.SECRET, {
                expiresIn: 86400  // expires in 24 hours
            });
            LOGGER.info("User logged in successfully.", user);
            res.status(HTTP_STATUS.OK).json({token});
        } else {
            LOGGER.warn("Unauthorized login attempt detected.", {username, password});
            res.status(HTTP_STATUS.UNAUTHORIZED).json();
        }
    });

AUTH_ROUTER.define()
    .path("/signup")
    .post(async function (req, res) {
        let userDto = {username, password} = req.body;
        let user = await USER_SERVICE.createUser(userDto);
        if (user !== null) {
            const payload = {
                user: user.username
            };
            let token = JWT.sign(payload, process.env.SECRET, {
                expiresIn: 86400  // expires in 24 hours
            });
            LOGGER.info("User signed up successfully.", user);
            res.status(HTTP_STATUS.OK).json({token});
        } else {
            LOGGER.warn("Bad signup detected.", {username, password});
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({message: "Something went wrong while signing up!"});
        }
    });

module.exports = AUTH_ROUTER.getRouter();