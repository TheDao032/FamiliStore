const knex = require('../utils/dbConnection')

const findById = async (cateId) => {
    const info = await knex('tbl_categories')
                    .where({ cate_id: cateId })

    return info
}

const findAll = async () => {
    const info = await knex('tbl_categories')

    return info
}

const findFather = async () => {
    const info = await knex('tbl_categories')
                    .distinctOn('cate_father')
                    .whereNot({ cate_father: null })

    return info
}

const findFatherWithLimit = async () => {
    const info = await knex('tbl_categories')
                    .distinctOn('cate_father')
                    .whereNot({ cate_father: null })
                    .limit(10)

    return info
}

const findAllFather = async () => {
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
    findAllFather,
    findChild,
    findAll,
    findFatherWithLimit
}