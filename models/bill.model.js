const knex = require('../utils/dbConnection')

const findAll = async () => {
	const info = await knex('tbl_bill')

	return info
}

const findByAccId = async (accId) => {
	const info = await knex('tbl_bill').where({ bill_account_id: accId })

	return info
}

const checkAmountProduct = (listProduct, listProductDB, priceShip)=>{
    var countId = 0
	var countAmount = 0
	var totalPrice = 0
	var totalQuantity = 0
	var message = ''
	
	listProduct.forEach((prod) => {
		totalQuantity += prod.prodQuantity
		var exists = Object.keys(listProductDB).some(function(key) {
			if(listProductDB[key]['prod_id'] === Number(prod.prodId)){
				countId++
				totalPrice += prod.prodQuantity * listProductDB[key]['prod_price']

				if((listProductDB[key]['prod_amount'] - prod.prodQuantity) >= 0){
					return true
				}

				return false
			}
		})
		
		if(exists === true){
			countAmount++;
		}
	})

	if(countId !== listProduct.length){
		message = 'product id not exists'
	}

	if(countAmount !== listProduct.length){
		message = 'quantity exceeds the number that exists'
	}
	totalPrice += Number(priceShip)
	const result = {
		totalPrice : totalPrice,
		totalQuantity: totalQuantity,
		message: message
	}
    return result
}

module.exports = {
	findAll,
	findByAccId,
	checkAmountProduct
}
