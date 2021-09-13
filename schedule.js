/*
const CronJob = require('cron').CronJob;
const knex = require('../FamilyStore/utils/dbConnection')
const moment = require('moment')

const job = new CronJob('* * * * *', async function() {
  //run every minute
    var currentTimeStamp = moment().format('YYYY-MM-DD HH:mm:ss')
    
    await knex.raw(`update tbl_bill
    set bill_status = 2
    where DATE_PART('day', '${currentTimeStamp}'::timestamp - bill_created_date::timestamp ) * 24 + 
                  DATE_PART('hour', '${currentTimeStamp}'::timestamp - bill_created_date::timestamp) >= 48 and bill_status = 1`)
}, null, true, 'Asia/Ho_Chi_Minh');


module.exports = {
    job
}
*/
