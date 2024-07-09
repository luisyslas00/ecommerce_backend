const { faker } = require("@faker-js/faker")
const crypto = require('crypto')

const generateProducts = () => {
    return {
        id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        thumbnail: faker.image.urlPicsumPhotos(),
        category: faker.commerce.department(),
        price: faker.commerce.price(),
        code: crypto.randomUUID(),
        stock: faker.number.int(50),
        status: true
    }
}

module.exports = generateProducts
