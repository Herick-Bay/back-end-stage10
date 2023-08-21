const { hash, compare } = require("bcryptjs");
const AppError = require("../utils/appError");
const UserRepository = require("../repositories/userRepository");
const sqliteConnection = require("../database/sqlite");
const UserCreateService = require("../services/userCreateService");

class UserController {
    async create(request, response) {
        const { name, email, password } = request.body;

        const userRepository = new UserRepository();
        const userCreateService = new UserCreateService(userRepository);

        await userCreateService.execute({ name, email, password });

        return response.status(201).json();
    }

    async update(request, response) {
        const { name, email, password, old_Password } = request.body;
        const user_id = request.user.id;

        const database = await sqliteConnection();
        const user = await database.get("SELECT * FROM users WHERE id = (?)", [user_id]);

        if (!user) {
            throw new AppError("Usuário nao encontrado");
        }

        const userWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
            throw new AppError("Este e-mail já está em uso.")
        }

        user.name = name ?? user.name;
        user.email = email ?? user.email;

        if (password && !old_Password) {
            throw new AppError("Você precisa informar a senha antiga para definir a nova senha");
        }

        if (password && old_Password) {
            const checkOldPassword = await compare(old_Password, user.password);


            if (!checkOldPassword) {
                throw new AppError("A senha antiga nao confere.");
            }

            user.password = await hash(password, 8);
        }

        await database.run(`
            UPDATE users SET
            name = ?,
            email = ?,
            password = ?,
            updated_at = DATETIME('now')
            WHERE id = ?`,
            [user.name, user.email, user.password, user_id]
        );

        return response.json();
    }
}

module.exports = UserController;