const { Router } = require("express");

const usersRouter = require("./users");
const moviesRouter = require("./movies");
const tagsRouter = require("./tags")
const sessionsRouter = require("./sessions")

const routes = Router();
routes.use("/users", usersRouter)
routes.use("/movies", moviesRouter)
routes.use("/tags", tagsRouter)
routes.use("/sessions", sessionsRouter)

module.exports = routes;