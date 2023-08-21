const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const UserController = require("../controllers/users");
const UserAvatar = require("../controllers/userAvatar");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");

const usersRoutes = Router();
const upload = multer(uploadConfig.MULTER);

const userController = new UserController();
const userAvatar = new UserAvatar();

usersRoutes.post("/", userController.create);
usersRoutes.put("/", ensureAuthenticated, userController.update);
usersRoutes.patch("/avatar", ensureAuthenticated, upload.single("avatar"), userAvatar.update);

module.exports = usersRoutes;