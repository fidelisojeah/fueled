import Express from 'express';
import { Server } from 'http';
import request from 'supertest';
import { Application } from '../../../src/Application';
// import Users from '+models/Users';
import { sampleUser, sampleRestaurantClosed, sampleRestaurantOpen } from '../../utils/seeds';
import Restaurants from '+models/Restaurants';
import Blacklist from '+models/Blacklists';
import Favourite from '+models/Favourites';
import sequelize from '+models';

const Users = sequelize.models.User;
describe('v1/:userId/Restaurants', () => {
    let express: Express.Application | undefined;
    let application: Application;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let user: any;
    let restaurants: Restaurants[];
    beforeAll(async () => {
        const listenSpy = jest.spyOn(Server.prototype, 'listen').mockImplementation();

        application = new Application();
        await application.start();

        express = application.app;
        listenSpy.mockRestore();
        user = await Users.create(sampleUser);
    });

    afterEach(async () => {
        jest.clearAllMocks();
        jest.resetAllMocks();
        await Blacklist.destroy({ where: {} });
        await Favourite.destroy({ where: {} });
        await Restaurants.destroy({ where: {}, force: true });
    });

    afterAll(async () => {
        jest.restoreAllMocks();
        await application.shutdown();
        await user.destroy();
    });

    describe('GET v1/:userId/restaurants', () => {
        beforeEach(async () => {
            const restaurantsSeed = Array.from(Array(10)).map((_, idx) => {
                if (idx >= 5) {
                    return sampleRestaurantClosed();
                }
                return sampleRestaurantOpen();
            });
            restaurants = await Promise.all(restaurantsSeed.map((res) => Restaurants.create(res)));

            await user.addBlacklists([restaurants[4], restaurants[5]]);
        });

        it('should render 404 when Entity is not found when user does not exist', async () => {
            const response = await request(express)
                .get('/v1/c997a6fc-0174-4477-bd31-a3e6d42ef46b/restaurants')
                .expect('Content-Type', /json/);

            expect(response.status).toBe(404);
            expect(response.body.statusCode).toBe(404);
            expect(response.body.message).toEqual(
                'User does not exist: /v1/c997a6fc-0174-4477-bd31-a3e6d42ef46b/restaurants'
            );
            expect(response.body.data).toMatchObject({ help: 'Method: GET' });
            expect(response.body.name).toEqual('EntityNotFoundException');
        });

        it('should return a list of all restaurants excluding blacklists', async () => {
            const response = await request(express)
                .get(`/v1/${user.getDataValue('id')}/restaurants`)
                .expect('Content-Type', /json/);
            console.log(response.body);
            expect(response.status).toBe(200);

            expect(response.body.data).toHaveLength(8);
        });

        it('should return a list of all restaurants that are closed', async () => {
            const response = await request(express)
                .get(`/v1/${user.getDataValue('id')}/restaurants?isOpen=false`)
                .expect('Content-Type', /json/);

            expect(response.status).toBe(200);
            console.log(response.body);
            expect(response.body.data).toHaveLength(4);
            expect(response.body.data[0].isOpen).toBe(false);
        });

        it('should return a list of all restaurants that are Opened', async () => {
            const response = await request(express)
                .get(`/v1/${user.getDataValue('id')}/restaurants?isOpen=true`)
                .expect('Content-Type', /json/);

            expect(response.status).toBe(200);

            expect(response.body.data).toHaveLength(4);
            expect(response.body.data[0].isOpen).toBe(true);
        });

        it('should return a list of all restaurants that are in a particular city', async () => {
            await Restaurants.create({ ...sampleRestaurantOpen(), city: 'Ontario' });
            const response = await request(express)
                .get(`/v1/${user.getDataValue('id')}/restaurants?isOpen=true&city=ontario`)
                .expect('Content-Type', /json/);

            expect(response.status).toBe(200);

            expect(response.body.data[0].city).toEqual('Ontario');
        });

        it('should return a list of all restaurants that are in a particular Country', async () => {
            await Restaurants.create({ ...sampleRestaurantOpen(), country: 'Canada' });
            const response = await request(express)
                .get(`/v1/${user.getDataValue('id')}/restaurants?isOpen=true&country=canada`)
                .expect('Content-Type', /json/);

            expect(response.status).toBe(200);

            expect(response.body.data).toHaveLength(5);
            expect(response.body.data[0].country).toEqual('Canada');
        });
    });

    describe('PUT/DELETE v1/:userId/restaurants/like', () => {
        beforeEach(async () => {
            const restaurantsSeed = Array.from(Array(10)).map((_, idx) => {
                if (idx >= 5) {
                    return sampleRestaurantClosed();
                }
                return sampleRestaurantOpen();
            });
            restaurants = await Restaurants.bulkCreate(restaurantsSeed);
            await user.addBlacklist(restaurants[4]);
            await user.addFavourites([restaurants[4], restaurants[5], restaurants[6], restaurants[7]]);
        });

        it('should render 404 when Entity is not found when user does not exist', async () => {
            const response = await request(express)
                .put(`/v1/c997a6fc-0174-4477-bd31-a3e6d42ef46b/restaurants/like/${restaurants[0].getDataValue('id')}`)
                .expect('Content-Type', /json/);

            expect(response.status).toBe(404);
            expect(response.body.statusCode).toBe(404);
            expect(response.body.message).toEqual(
                `User does not exist: /v1/c997a6fc-0174-4477-bd31-a3e6d42ef46b/restaurants/like/${restaurants[0].getDataValue(
                    'id'
                )}`
            );
            expect(response.body.data).toMatchObject({ help: 'Method: PUT' });
            expect(response.body.name).toEqual('EntityNotFoundException');
        });

        it('should add restaurant to favourites', async () => {
            const response = await request(express)
                .put(`/v1/${user.getDataValue('id')}/restaurants/like/${restaurants[0].getDataValue('id')}`)
                .expect('Content-Type', /json/);

            expect(response.status).toBe(200);

            expect(response.body.data).toEqual({
                id: restaurants[0].getDataValue('id'),
                liked: '1',
                name: restaurants[0].getDataValue('name'),
                postcode: restaurants[0].getDataValue('postcode'),
                city: restaurants[0].getDataValue('city'),
                country: restaurants[0].getDataValue('country'),
                isOpen: restaurants[0].getDataValue('isOpen')
            });
        });

        it('should remove restaurant from favourites', async () => {
            const response = await request(express)
                .delete(`/v1/${user.getDataValue('id')}/restaurants/like/${restaurants[0].getDataValue('id')}`)
                .expect('Content-Type', /json/);

            expect(response.status).toBe(200);

            expect(response.body.data).toEqual({
                id: restaurants[0].getDataValue('id'),
                liked: '0',
                name: restaurants[0].getDataValue('name'),
                postcode: restaurants[0].getDataValue('postcode'),
                city: restaurants[0].getDataValue('city'),
                country: restaurants[0].getDataValue('country'),
                isOpen: restaurants[0].getDataValue('isOpen')
            });
        });
    });

    describe('GET/PUT/DELETE v1/:userId/restaurants/blacklists', () => {
        beforeEach(async () => {
            const restaurantsSeed = Array.from(Array(10)).map((_, idx) => {
                if (idx >= 5) {
                    return sampleRestaurantClosed();
                }
                return sampleRestaurantOpen();
            });
            restaurants = await Restaurants.bulkCreate(restaurantsSeed);
            await user.addBlacklist(restaurants[4]);
            await user.addFavourites([restaurants[4], restaurants[5], restaurants[6], restaurants[7]]);
        });

        it('should render 404 when Entity is not found when user does not exist', async () => {
            const response = await request(express)
                .get('/v1/c997a6fc-0174-4477-bd31-a3e6d42ef46b/restaurants/blacklists')
                .expect('Content-Type', /json/);

            expect(response.status).toBe(404);
            expect(response.body.statusCode).toBe(404);
            expect(response.body.message).toEqual(
                'User does not exist: /v1/c997a6fc-0174-4477-bd31-a3e6d42ef46b/restaurants/blacklists'
            );
            expect(response.body.data).toMatchObject({ help: 'Method: GET' });
            expect(response.body.name).toEqual('EntityNotFoundException');
        });

        it('should get a list of all blacklisted restaurants', async () => {
            const response = await request(express)
                .get(`/v1/${user.getDataValue('id')}/restaurants/blacklists`)
                .expect('Content-Type', /json/);

            expect(response.status).toBe(200);

            expect(response.body.data.length).toBeGreaterThanOrEqual(1);
            expect(response.body.data.length).toBeLessThan(10);
        });

        it('should add restaurant to blacklist', async () => {
            const response = await request(express)
                .put(`/v1/${user.getDataValue('id')}/restaurants/blacklists/${restaurants[0].getDataValue('id')}`)
                .expect('Content-Type', /json/);

            expect(response.status).toBe(200);

            expect(response.body.data).toEqual({
                id: restaurants[0].getDataValue('id'),
                liked: '0',
                name: restaurants[0].getDataValue('name'),
                postcode: restaurants[0].getDataValue('postcode'),
                city: restaurants[0].getDataValue('city'),
                country: restaurants[0].getDataValue('country'),
                isOpen: restaurants[0].getDataValue('isOpen')
            });
        });

        it('should remove restaurant from blacklist', async () => {
            const response = await request(express)
                .delete(`/v1/${user.getDataValue('id')}/restaurants/blacklists/${restaurants[0].getDataValue('id')}`)
                .expect('Content-Type', /json/);

            expect(response.status).toBe(200);

            expect(response.body.data).toEqual({
                id: restaurants[0].getDataValue('id'),
                liked: '0',
                name: restaurants[0].getDataValue('name'),
                postcode: restaurants[0].getDataValue('postcode'),
                city: restaurants[0].getDataValue('city'),
                country: restaurants[0].getDataValue('country'),
                isOpen: restaurants[0].getDataValue('isOpen')
            });
        });
    });
});
