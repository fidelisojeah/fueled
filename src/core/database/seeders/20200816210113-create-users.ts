import faker from 'faker/locale/en_CA';
import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) =>
    queryInterface.bulkInsert(
        'Users',
        [
            {
                id: '3e6482cb-0bd5-4a0f-94c2-f68401062193',
                name: faker.fake('{{name.prefix}} {{name.firstName}} {{name.lastName}}'),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '311c963e-8f4e-4b8e-a823-d72fc2fd7915',
                name: faker.fake('{{name.prefix}} {{name.firstName}} {{name.lastName}}'),
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                id: '2ada2e4f-fa7e-4701-8658-31cf403e86bc',
                name: faker.fake('{{name.prefix}} {{name.firstName}} {{name.lastName}}'),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ],
        {}
    );

export const down = (queryInterface: QueryInterface) => queryInterface.bulkDelete('Users', {});
