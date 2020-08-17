import { EntityNotFoundException } from '+core/exceptions';
import Sequelize, {
    BelongsToManyRemoveAssociationMixin,
    DataTypes,
    Model,
    // Optional,
    Association,
    BelongsToManyAddAssociationMixin,
    BelongsToManyAddAssociationsMixin,
    BelongsToManyRemoveAssociationsMixin
} from 'sequelize';
import { titleCase } from '+utils';

import sequelize from './';
import Blacklists from './Blacklists';
import Favourites from './Favourites';
import Restaurants from './Restaurants';

// interface UserAttributes {
//     id: string;
//     name: string;
// }

function buildWhereQuery(
    query: Sequelize.FindOptions<Restaurants>,
    liked?: boolean | null | undefined | string,
    skipBlacklist = false
): (Sequelize.Utils.Where | Sequelize.WhereAttributeHash)[] {
    const allArguments: (Sequelize.Utils.Where | Sequelize.WhereAttributeHash)[] = [];

    if (!skipBlacklist) {
        allArguments.push(Sequelize.where(Sequelize.col('userBlacklists->Blacklist.userId'), 'IS', null));
    }

    allArguments.push(query.where as Sequelize.WhereAttributeHash);

    if (liked !== undefined && liked !== null) {
        allArguments.push(
            Sequelize.where(
                Sequelize.col('userFavourites->Favourite.userId'),
                liked === 'true' || liked === true ? 'IS NOT' : 'IS',
                null
            )
        );
    }
    return allArguments;
}

class User extends Model {
    // class User extends Model<UserAttributes, Optional<UserAttributes, 'id'>> implements UserAttributes {
    public id!: string;
    public name!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public addFavourites: BelongsToManyAddAssociationsMixin<Restaurants, 'id'> = User.prototype.addFavourites;
    public addFavourite: BelongsToManyAddAssociationMixin<Restaurants, 'id'> = User.prototype.addFavourite;
    public removeFavourites: BelongsToManyRemoveAssociationsMixin<Restaurants, 'id'> = User.prototype.removeFavourites;
    public removeFavourite: BelongsToManyRemoveAssociationMixin<Restaurants, 'id'> = User.prototype.removeFavourite;
    public addBlacklists: BelongsToManyAddAssociationsMixin<Restaurants, 'id'> = User.prototype.addBlacklists;
    public addBlacklist: BelongsToManyAddAssociationMixin<Restaurants, 'id'> = User.prototype.addBlacklist;
    public removeBlacklists: BelongsToManyRemoveAssociationsMixin<Restaurants, 'id'> = User.prototype.removeBlacklists;
    public removeBlacklist: BelongsToManyRemoveAssociationMixin<Restaurants, 'id'> = User.prototype.removeBlacklist;

    public static associations: {
        favourites: Association<User, Restaurants>;
        blacklists: Association<User, Restaurants>;
    };

    async getRestaurants(
        query: Sequelize.FindOptions<Restaurants>,
        liked: boolean | null | undefined
    ): Promise<Restaurants[]> {
        return Restaurants.findAll({
            ...query,
            where: Sequelize.and(...buildWhereQuery(query, liked)),
            include: [
                {
                    model: User,
                    as: 'userBlacklists',
                    required: false,
                    where: {
                        id: this.getDataValue('id')
                    },
                    attributes: []
                },
                {
                    model: User,
                    as: 'userFavourites',
                    required: false,
                    where: {
                        id: this.getDataValue('id')
                    },
                    attributes: []
                }
            ],
            attributes: [
                'id',
                'name',
                'postcode',
                'city',
                'country',
                'isOpen',
                [Sequelize.fn('count', Sequelize.col('userFavourites.id')), 'liked']
            ],
            group: [
                'Restaurant.id',
                'userBlacklists->Blacklist.userId',
                'userBlacklists->Blacklist.restaurantId',
                'userFavourites->Favourite.userId',
                'userFavourites->Favourite.restaurantId'
            ]
        });
    }

    async getBlacklistedRestaurants(
        query: Sequelize.FindOptions<Restaurants>,
        liked: boolean | null | undefined
    ): Promise<Restaurants[]> {
        return Restaurants.findAll({
            ...query,
            where: Sequelize.and(...buildWhereQuery(query, liked, true)),
            include: [
                {
                    model: User,
                    as: 'userFavourites',
                    required: false,
                    where: {
                        id: this.getDataValue('id')
                    },
                    attributes: []
                },
                {
                    model: User,
                    as: 'userBlacklists',
                    required: true,
                    where: {
                        id: this.getDataValue('id')
                    },
                    attributes: []
                }
            ],
            attributes: [
                'id',
                'name',
                'postcode',
                'city',
                'country',
                'isOpen',
                [Sequelize.fn('count', Sequelize.col('userFavourites.id')), 'liked']
            ],
            group: [
                'Restaurant.id',
                'userBlacklists->Blacklist.userId',
                'userBlacklists->Blacklist.restaurantId',
                'userFavourites->Favourite.userId',
                'userFavourites->Favourite.restaurantId'
            ]
        });
    }

    async likeRestaurant(restaurantId: string): Promise<Restaurants> {
        const restaurant = await Restaurants.findByPk(restaurantId, {
            attributes: ['id', 'name', 'postcode', 'city', 'country', 'isOpen']
        });
        if (!restaurant) {
            throw new EntityNotFoundException('Restaurant not found');
        }

        await this.addFavourite(restaurant);
        return restaurant.reload({
            include: [
                {
                    model: User,
                    as: 'userFavourites',
                    required: false,
                    where: {
                        id: this.getDataValue('id')
                    },
                    attributes: []
                }
            ],
            attributes: [
                'id',
                'name',
                'postcode',
                'city',
                'country',
                'isOpen',
                [Sequelize.fn('count', Sequelize.col('userFavourites.id')), 'liked']
            ],
            group: ['Restaurant.id', 'userFavourites->Favourite.userId', 'userFavourites->Favourite.restaurantId']
        });
    }

    async unlikeRestaurant(restaurantId: string): Promise<Restaurants> {
        const restaurant = await Restaurants.findByPk(restaurantId, {
            attributes: ['id', 'name', 'postcode', 'city', 'country', 'isOpen']
        });

        if (!restaurant) {
            throw new EntityNotFoundException('Restaurant not found');
        }

        await this.removeFavourite(restaurant);
        return restaurant.reload({
            include: [
                {
                    model: User,
                    as: 'userFavourites',
                    required: false,
                    where: {
                        id: this.getDataValue('id')
                    },
                    attributes: []
                }
            ],
            attributes: [
                'id',
                'name',
                'postcode',
                'city',
                'country',
                'isOpen',
                [Sequelize.fn('count', Sequelize.col('userFavourites.id')), 'liked']
            ],
            group: ['Restaurant.id', 'userFavourites->Favourite.userId', 'userFavourites->Favourite.restaurantId']
        });
    }

    async blacklistRestaurant(restaurantId: string): Promise<Restaurants> {
        const restaurant = await Restaurants.findByPk(restaurantId, {
            attributes: ['id', 'name', 'postcode', 'city', 'country', 'isOpen']
        });

        if (!restaurant) {
            throw new EntityNotFoundException('Restaurant not found');
        }

        await this.addBlacklist(restaurant);
        return restaurant.reload({
            include: [
                {
                    model: User,
                    as: 'userFavourites',
                    required: false,
                    where: {
                        id: this.getDataValue('id')
                    },
                    attributes: []
                },
                {
                    model: User,
                    as: 'userBlacklists',
                    required: false,
                    where: {
                        id: this.getDataValue('id')
                    },
                    attributes: []
                }
            ],
            attributes: [
                'id',
                'name',
                'postcode',
                'city',
                'country',
                'isOpen',
                [Sequelize.fn('count', Sequelize.col('userFavourites.id')), 'liked']
            ],
            group: [
                'Restaurant.id',
                'userBlacklists->Blacklist.userId',
                'userBlacklists->Blacklist.restaurantId',
                'userFavourites->Favourite.userId',
                'userFavourites->Favourite.restaurantId'
            ]
        });
    }

    async unBlacklistRestaurant(restaurantId: string): Promise<Restaurants> {
        const restaurant = await Restaurants.findByPk(restaurantId, {
            attributes: ['id', 'name', 'postcode', 'city', 'country', 'isOpen']
        });

        if (!restaurant) {
            throw new EntityNotFoundException('Restaurant not found');
        }

        await this.removeBlacklist(restaurant);
        return restaurant.reload({
            include: [
                {
                    model: User,
                    as: 'userFavourites',
                    required: false,
                    where: {
                        id: this.getDataValue('id')
                    },
                    attributes: []
                },
                {
                    model: User,
                    as: 'userBlacklists',
                    required: false,
                    where: {
                        id: this.getDataValue('id')
                    },
                    attributes: []
                }
            ],
            attributes: [
                'id',
                'name',
                'postcode',
                'city',
                'country',
                'isOpen',
                [Sequelize.fn('count', Sequelize.col('userFavourites.id')), 'liked']
            ],
            group: [
                'Restaurant.id',
                'userBlacklists->Blacklist.userId',
                'userBlacklists->Blacklist.restaurantId',
                'userFavourites->Favourite.userId',
                'userFavourites->Favourite.restaurantId'
            ]
        });
    }

    static associate() {
        this.belongsToMany(Restaurants, {
            otherKey: 'restaurantId',
            foreignKey: 'userId',
            as: 'blacklists',
            through: Blacklists,
            timestamps: false
        });
        this.belongsToMany(Restaurants, {
            foreignKey: 'userId',
            otherKey: 'restaurantId',
            as: 'favourites',
            through: Favourites,
            timestamps: false
        });

        Restaurants.belongsToMany(this, {
            foreignKey: 'restaurantId',
            otherKey: 'userId',
            as: 'userBlacklists',
            through: Blacklists,
            timestamps: false
        });
        Restaurants.belongsToMany(this, {
            otherKey: 'userId',
            foreignKey: 'restaurantId',
            as: 'userFavourites',
            through: Favourites,
            timestamps: false
        });
    }
}

User.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            set: function (value: string) {
                this.setDataValue('name', titleCase(value));
            }
        }
    },
    {
        sequelize,
        modelName: 'User'
    }
);

// User.belongsToMany(Restaurants, {
//     otherKey: 'restaurantId',
//     foreignKey: 'userId',
//     as: 'blacklists',
//     through: Blacklists
// });

// User.belongsToMany(Restaurants, {
//     foreignKey: 'userId',
//     otherKey: 'restaurantId',
//     as: 'favourites',
//     through: Favourites
// });
User.associate();

export default User;
