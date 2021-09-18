
const cron = require('node-cron');
const knex = require('./utils/dbConnection')
const moment = require('moment')

cron.schedule('* * * * * *', async function() {
  //run every minute
    var currentTimeStamp = moment().format('YYYY-MM-DD HH:mm:ss')
    
    await knex.raw(`update tbl_bill
    set bill_status = 2
    where DATE_PART('day', '${currentTimeStamp}'::timestamp - bill_updated_date::timestamp ) * 24 + 
                  DATE_PART('hour', '${currentTimeStamp}'::timestamp - bill_updated_date::timestamp) >= 48 and bill_status = 1`)
});


