const knex = require('../utils/dbConnection')

const findById = async (cateId) => {
    const info = await knex('tbl_categories')
                    .where({ cate_id: cateId })

    return info
}

const findFather = async () => {
    const info = await knex('tbl_categories')
                    .where({ cate_father: null })

    return info
}

const findChild = async (cateFather) => {
    const info = await knex('tbl_categories')
                    .where({ cate_father: cateFather })

    return info
}

module.exports = {
    findById,
    findFather,
    findChild
}