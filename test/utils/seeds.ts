import faker from 'faker/locale/en_CA';

export const sampleUser = {
    id: '2b13ff81-b169-4e8a-a166-dbe8b9b6069d',
    name: faker.fake('{{name.firstName}} {{name.lastName}}')
};

export const sampleRestaurantOpen = () => ({
    name: `${faker.company.catchPhraseNoun()} Restaurant`,
    postcode: faker.address.zipCode(),
    city: faker.address.state(),
    country: 'Canada',
    isOpen: true
});

export const sampleRestaurantClosed = () => ({
    name: `${faker.company.catchPhraseNoun()} Restaurant`,
    postcode: faker.address.zipCode(),
    city: faker.address.state(),
    country: 'Canada',
    isOpen: false
});
