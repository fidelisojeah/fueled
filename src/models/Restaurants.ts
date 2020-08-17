import Sequelize, { DataTypes, Model, Optional, Association } from 'sequelize';
import { titleCase } from '+utils';

import sequelize from './';
import Users from './Users';

const usPostcode = new RegExp('^\\d{5}(-{0,1}\\d{4})?$');
const caPostcode = new RegExp(/([ABCEGHJKLMNPRSTVXY]\d)([A-Z]\d){2}/i);

export interface RestaurantAttributes {
    id: string;
    name: string;
    postcode: string;
    country: string;
    city: string;

    isOpen: boolean;
}

class Restaurant extends Model<RestaurantAttributes, Optional<RestaurantAttributes, 'id'>> {
    // implements RestaurantAttributes {
    public id!: string;
    public name!: string;
    public postcode!: string;
    public city!: string;
    public country!: string;
    public isOpen!: boolean;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associations: {
        favourites: Association<Restaurant, Users>;
        blacklists: Association<Restaurant, Users>;
    };
}

Restaurant.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        postcode: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isValidPostcode(value: string) {
                    if (!usPostcode.test(value.trim()) && !caPostcode.test(value.trim().replace(/\W+/g, ''))) {
                        throw new Error('Not a valid US or Canada postcode');
                    }
                }
            },
            set: function (value: string) {
                this.setDataValue('postcode', value.trim().toUpperCase());
            }
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
            set: function (value: string) {
                this.setDataValue('city', titleCase(value.trim()));
            }
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
            set: function (value: string) {
                this.setDataValue('country', titleCase(value.trim()));
            }
        },
        isOpen: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: 'Restaurant'
    }
);

export default Restaurant;
