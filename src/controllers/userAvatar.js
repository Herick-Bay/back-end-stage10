const knex = require("../database/knex");
const AppError = require("../utils/appError");
const diskStorage = require("../providers/diskStorage");

class userAvatar {
    async update(request, response) {
        const user_id = request.user.id;
        const avatarFilename = request.file.filename;

        const diskStorages = new diskStorage();

        const user = await knex("users")
            .where({ id: user_id }).first();

        if (!user) {
            throw new AppError("Somente usuários autenticados podem mudar o avatar", 401);
        }

        if (user.avatar) {
            await diskStorages.deleteFile(user.avatar);
        }

        const filename = await diskStorages.saveFile(avatarFilename);
        user.avatar = filename;

        await knex("users").update(user).where({ id: user_id });

        return response.json(user);
    }
}

module.exports = userAvatar;
