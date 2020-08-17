import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) =>
    queryInterface.createTable('Favourites', {
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        restaurantId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Restaurants',
                key: 'id'
            }
        }
    });

export const down = (queryInterface: QueryInterface) => queryInterface.dropTable('Favourites');
