import { EntityNotFoundException } from '+core/exceptions';
import User from '+models/Users';
import * as express from 'express';
import Sequelize from 'sequelize';
import Restaurant from '+models/Restaurants';

interface QueryFilter {
    [key: string]: boolean | {};
}

export class Restaurants {
    public router = express.Router({ mergeParams: true });
    constructor() {
        this.router.get('/', this.getUser, this.filterRestaurants);
        this.router.put('/like/:restaurantId', this.getUser, this.likeRestaurant);
        this.router.delete('/like/:restaurantId', this.getUser, this.unlikeRestaurant);
        this.router.get('/blacklists', this.getUser, this.getBlacklistedRestaurants);
        this.router.put('/blacklists/:restaurantId', this.getUser, this.blacklistRestaurant);
        this.router.delete('/blacklists/:restaurantId', this.getUser, this.unBlacklistRestaurant);
    }

    private filterRestaurants = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const query = this.buildCustomQuery(request);
            const restaurants = await response.locals.user.getRestaurants(query, request.query.liked);

            response.responseModule({ data: restaurants });
        } catch (error) {
            next(error);
        }
    };

    private buildCustomQuery = (request: express.Request): Sequelize.FindOptions<Restaurant> => {
        const { isOpen, postcode, country, city, name, id } = request.query;
        const filter: QueryFilter = {};

        if (isOpen !== undefined && isOpen !== null) {
            filter.isOpen = isOpen;
        }

        if (postcode) {
            filter.postcode = {
                [Sequelize.Op.iLike]: `${postcode}%`
            };
        }
        if (country) {
            filter.country = {
                [Sequelize.Op.iLike]: `${country}%`
            };
        }
        if (city) {
            filter.city = {
                [Sequelize.Op.iLike]: `${city}%`
            };
        }
        if (name) {
            filter.name = {
                [Sequelize.Op.iLike]: `${name}%`
            };
        }
        if (id) {
            filter.id = {
                [Sequelize.Op.iLike]: `${id}%`
            };
        }
        return { where: filter };
    };

    private getBlacklistedRestaurants = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const restaurants = await response.locals.user.getBlacklistedRestaurants(
                this.buildCustomQuery(request),
                request.query.liked
            );

            response.responseModule({
                data: restaurants
            });
        } catch (error) {
            next(error);
        }
    };

    private async likeRestaurant(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const restaurant = await response.locals.user.likeRestaurant(request.params.restaurantId);

            response.responseModule({
                data: restaurant,
                message: 'Restaurant added to favourites'
            });
        } catch (error) {
            next(error);
        }
    }

    private async unlikeRestaurant(request: express.Request, response: express.Response, next: express.NextFunction) {
        try {
            const restaurant = await response.locals.user.unlikeRestaurant(request.params.restaurantId);

            response.responseModule({
                data: restaurant,
                message: 'Restaurant removed from favourites'
            });
        } catch (error) {
            next(error);
        }
    }

    private async blacklistRestaurant(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            const restaurant = await response.locals.user.blacklistRestaurant(request.params.restaurantId);

            response.responseModule({
                data: restaurant,
                message: 'Restaurant added to blacklist'
            });
        } catch (error) {
            next(error);
        }
    }

    private async unBlacklistRestaurant(
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ) {
        try {
            const restaurant = await response.locals.user.unBlacklistRestaurant(request.params.restaurantId);

            response.responseModule({
                data: restaurant,
                message: 'Restaurant removed from blacklist'
            });
        } catch (error) {
            next(error);
        }
    }

    private async getUser(request: express.Request, response: express.Response, next: express.NextFunction) {
        const { userId } = request.params;
        try {
            const user = await User.findByPk(userId);

            if (!user) {
                throw new EntityNotFoundException('User does not exist', request);
            }

            response.locals.user = user;
        } catch (error) {
            return next(error);
        }
        next();
    }
}
export default new Restaurants().router;
