const knex = require('../utils/dbConnection')

const findAll = async () => {
    const info = await knex('tbl_product_images')

    return info
}

module.exports = {
    findAll
}