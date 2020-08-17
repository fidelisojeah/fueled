import faker from 'faker/locale/en_CA';
import { QueryInterface } from 'sequelize';

export const up = async (queryInterface: QueryInterface) =>
    queryInterface.bulkInsert(
        'Restaurants',
        [
            {
                id: '99e76c0e-0fce-4997-9575-76eed697302f',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: false
            },
            {
                id: '565cdd7a-28c9-41a7-83e6-b06e5064414c',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: true
            },
            {
                id: '91ac833f-afbb-4c37-bb5a-864f572aeaec',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: false
            },
            {
                id: 'a3d498fa-c535-46fc-9835-657bae0a990b',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: true
            },
            {
                id: '63a11fd8-ccd0-43c9-a42a-fc0d2ebeba32',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: false
            },
            {
                id: '1d0e844a-1be6-401a-b7c7-474687669c99',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: true
            },
            {
                id: '61dc5b3c-213e-47e1-ba83-5aaa2b900046',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: true
            },
            {
                id: '40c4f404-7b33-4644-b17b-d38130409e27',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: false
            },
            {
                id: '69a57117-f244-4b41-b67a-358fab9f12da',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: true
            },
            {
                id: '02cd4a38-c8c3-4e0c-8b84-117e7ac4ebef',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: false
            },
            {
                id: 'b3baf6f2-041e-4944-a41f-edfe724f72eb',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: true
            },
            {
                id: '4b7784da-bb4b-4ee9-9f52-85076e61cd65',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: false
            },
            {
                id: 'fcd815cf-8cff-4fc5-8192-90b7ea57ba6a',
                name: `${faker.company.catchPhraseNoun()} Restaurant`,
                postcode: faker.address.zipCode(),
                city: faker.address.state(),
                country: 'Canada',
                createdAt: new Date(),
                updatedAt: new Date(),
                isOpen: false
            }
        ],
        {}
    );

export const down = (queryInterface: QueryInterface) => queryInterface.bulkDelete('Restaurants', {});
