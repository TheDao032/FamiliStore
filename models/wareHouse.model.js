const knex = require('../utils/dbConnection')

const findById = async (stoId) => {
    const info = await knex('tbl_ware_house')
                    .where({ sto_id: stoId })

    return info
}

module.exports = {
    findById
}