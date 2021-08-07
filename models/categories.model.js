const knex = require('../utils/dbConnection')

const findById = async (cateId) => {
    const info = await knex('tbl_categories')
                    .where({ cate_id: cateId })

    return info
}

module.exports = {
    findById
}