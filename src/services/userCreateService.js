const { hash } = require("bcryptjs");
const AppError = require("../utils/appError");

class UserCreateService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ name, email, password }) {

        const checkUsersExists = await this.userRepository.findByEmail(email);

        if (checkUsersExists) {
            throw new AppError("Este e-mail já está em uso.")
        }

        const hashedPassword = await hash(password, 8);

        const userCreated = await this.userRepository.create({ name, email, password: hashedPassword });

        return userCreated;
    }
}

module.exports = UserCreateService