import { DataTypes, Model } from 'sequelize';

import sequelize from './';
import Restaurants from './Restaurants';
import Users from './Users';

class Blacklist extends Model {}

Blacklist.init(
    {
        userId: {
            type: DataTypes.UUID,
            references: {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                model: Users as any,
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
        modelName: 'Blacklist',
        timestamps: false
    }
);

export default Blacklist;
