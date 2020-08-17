import { DataTypes, Model } from 'sequelize';

import sequelize from './';
import Restaurants from './Restaurants';
import User from './Users';

class Favourite extends Model {}

Favourite.init(
    {
        userId: {
            type: DataTypes.UUID,
            references: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                model: User as any,
                key: 'id'
            }
        },
        restaurantId: {
            type: DataTypes.UUID,
            references: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                model: Restaurants as any,
                key: 'id'
            }
        }
    },
    {
        sequelize,
        modelName: 'Favourite',
        timestamps: false
    }
);

export default Favourite;
