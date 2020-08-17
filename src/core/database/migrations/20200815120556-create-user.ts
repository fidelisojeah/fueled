import { QueryInterface, DataTypes } from 'sequelize';

export const up = async (queryInterface: QueryInterface) =>
    queryInterface.createTable('Users', {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE
        }
    });

export const down = (queryInterface: QueryInterface) => queryInterface.dropTable('Users');
