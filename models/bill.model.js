const knex = require('../utils/dbConnection')

const findAll = async () => {
	const info = await knex('tbl_bill')

	return info
}

const findByAccId = async (accId) => {
	const info = await knex('tbl_bill').where({ bill_account_id: accId })

	return info
}

const findByStatus = async () => {
	const info = await knex('tbl_bill').where({ bill_status: 0 })

	return info
}

const UpdateStatus = async (billId) => {
	await knex('tbl_bill').where({ bill_id: billId }).update({bill_status: 0})
}

const AddNameToMessage = (listProduct, listProductCheck)=>{
	var mess = 'Products id: '

	listProduct.forEach((prod) => {

		var check = false

		listProductCheck.forEach((prodC) =>{
			
			if(prodC.id === Number(prod.prodId)){
				check = true
			}
		})
		if(check === false){
			mess += prod.prodId + ', '
		}
	})
	return mess
}

const checkAmountProduct = (listProduct, listProductDB, priceShip)=>{
    var countId = 0
	var countAmount = 0
	var totalPrice = 0
	var totalQuantity = 0
	var message = ''
	var tempName = ''
	var messageAmount = 'Products name: '
	var listProductCheckExists = []
	var result = {}

	const unique = [...new Set(listProduct.map(item => item.prodId))];
	if(unique.length === listProduct.length){
	
		listProduct.forEach((prod) => {
			totalQuantity += prod.prodQuantity

			var exists = Object.keys(listProductDB).some(function(key) {

				if(listProductDB[key]['prod_id'] === Number(prod.prodId)){

					countId++
					totalPrice += prod.prodQuantity * listProductDB[key]['prod_price']

					listProductCheckExists.push({
						id: listProductDB[key]['prod_id'],
						name: listProductDB[key]['prod_name']
					})

					if((listProductDB[key]['prod_amount'] - prod.prodQuantity) >= 0){
						return true
					}
					tempName = listProductDB[key]['prod_name']
					return false
				}
			})
			
			if(exists === true){
				countAmount++;
			}
			else{
				messageAmount += tempName + ', '
			}
		})

		if(countId !== listProduct.length){
			if(listProductCheckExists.length !== 0){
				message = AddNameToMessage(listProduct, listProductCheckExists) + 'not exists'
			}
			else{
				message = 'All products not exists'
			}
			
		}

		else if(countAmount !== listProduct.length){
			message = messageAmount + 'have insufficient quantity'
		}

		totalPrice += Number(priceShip)
		result = {
			totalPrice : totalPrice,
			totalQuantity: totalQuantity,
			message: message
		}
	}
	else{
		result = {
			totalPrice : 0,
			totalQuantity: 0,
			message: 'Product id must be unique'
		}
	}
    return result
}

module.exports = {
	findAll,
	findByAccId,
	checkAmountProduct,
	AddNameToMessage,
	findByStatus,
	UpdateStatus
}
