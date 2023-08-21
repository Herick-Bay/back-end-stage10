const AppError = require("../utils/appError");

const UserCreateService = require("./userCreateService");
const UserRepositoryInMemory = require("../repositories/userRepositoryInMemory");

describe("UserCreateService", () => {
    let userRepositoryInMemory = null;
    let userCreateService = null;

    beforeEach(() => {
        userRepositoryInMemory = new UserRepositoryInMemory();
        userCreateService = new UserCreateService(userRepositoryInMemory);
    });

    it("user should be create", async () => {
        const user = {
            name: "UserTest",
            email: "user@test.com",
            password: "132"
        };

        const userCreated = await userCreateService.execute(user);

        expect(userCreated).toHaveProperty("id");
    });

    it("user not should be create with exists email", async () => {
        const user1 = {
            name: "UserTest 1",
            email: "user@test.com",
            password: "132"
        };

        const user2 = {
            name: "UserTest 2",
            email: "user@test.com",
            password: "123"
        };

        await userCreateService.execute(user1);
        await expect(userCreateService.execute(user2)).rejects.toEqual(new AppError("Este e-mail já está em uso."));
    });
});