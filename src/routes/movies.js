const { Router } = require("express");
const MoviesController = require("../controllers/movies");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const moviesRoutes = Router();

const moviesController = new MoviesController();

moviesRoutes.use(ensureAuthenticated);

moviesRoutes.get("/", moviesController.index);
moviesRoutes.post("/", moviesController.create);
moviesRoutes.get("/:id", moviesController.show);
moviesRoutes.delete("/:id", moviesController.delete);

module.exports = moviesRoutes;