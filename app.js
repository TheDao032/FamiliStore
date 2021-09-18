const server = require('./server')
const environment = require('./environments/environment')
//const schedule = require('./schedule')

cron.schedule('* * * * * * *', async function() {
	//run every minute
	  var currentTimeStamp = moment().format('YYYY-MM-DD HH:mm:ss')
	  
	  await knex.raw(`update tbl_bill
	  set bill_status = 2
	  where DATE_PART('day', '${currentTimeStamp}'::timestamp - bill_created_date::timestamp ) * 24 + 
					DATE_PART('hour', '${currentTimeStamp}'::timestamp - bill_created_date::timestamp) >= 48 and bill_status = 1`)
  });

server.listen(environment.portServer, () => {
	console.log(`Server Is Starting`)
})