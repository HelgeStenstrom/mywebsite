import {ModelStatic, Sequelize} from "sequelize";
import {UserInstance} from "../../types/user";
import {defineUser} from "../../orm/models/user.model";
import {UserRepository} from "../../orm/repositories/user.repository";
import bcrypt from "bcrypt";

describe('UserRepository', () => {

    let sequelize: Sequelize;
    let userDefinition: ModelStatic<UserInstance>;
    let repository: UserRepository;

    beforeEach(async () => {
        sequelize = new Sequelize('test', 'test', 'test', {dialect: "sqlite", logging: false});
        userDefinition = defineUser(sequelize);
        await sequelize.sync({force: true});
        repository = new UserRepository(userDefinition);
    });

    afterEach(async () => {
        await sequelize.close();
    });

    test('create stores a hashed password, not the plaintext password', async () => {
        const user = await repository.create({email: 'user@example.com', password: 'secret', memberId: null});
        expect(user.passwordHash).not.toBe('secret');
        expect(user.passwordHash.length).toBeGreaterThan(0);
    });

    test('findByEmail returns the user with correct email', async () => {
        await repository.create({email: 'user@example.com', password: 'secret', memberId: null});
        const result = await repository.findByEmail('user@example.com');
        expect(result).not.toBeNull();
        expect(result!.email).toBe('user@example.com');
    });

    test('findByEmail returns null when user does not exist', async () => {
        const result = await repository.findByEmail('nobody@example.com');
        expect(result).toBeNull();
    });

    test('findById returns the user with correct id', async () => {
        const created = await repository.create({email: 'user@example.com', password: 'secret', memberId: null});
        const result = await repository.findById(created.id);
        expect(result).not.toBeNull();
        expect(result!.id).toBe(created.id);
    });

    test('findById returns null when user does not exist', async () => {
        const result = await repository.findById(999);
        expect(result).toBeNull();
    });

    test('updatePassword allows login with new password', async () => {
        const user = await repository.create({email: 'user@example.com', password: 'secret', memberId: null});
        await repository.updatePassword(user.id, 'newSecret');
        const updated = await repository.findById(user.id);
        const valid = await bcrypt.compare('newSecret', updated!.passwordHash);
        expect(valid).toBe(true);
    });
});