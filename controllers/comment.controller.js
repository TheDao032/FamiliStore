const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');
const successCode = 0
const errorCode = 1

router.get('/list', async (req, res) => {
    const {productID} = req.query; 
    console.log(req.params);

	const result = await knex.from('tbl_comment')
    .join('tbl_account', 'tbl_account.acc_id', '=', 'tbl_comment.cmt_acc_id')
    .where('cmt_product_id', productID);

	if (result) {
		return res.status(200).json({
			listComment: result,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listComment: [],
		statusCode: errorCode
	})
})


router.post('/add', async (req, res) => {
	const { productID, accountID, content, vote } = req.body
    console.log(req.body)
	await knex('tbl_comment').insert({ 
        cmt_product_id: productID, 
        cmt_acc_id: accountID,
        cmt_content: content,
        cmt_vote: vote,
        cmt_created_date:moment().format('YYYY-MM-DD HH:mm:ss')
    })

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete/:id', async (req, res) => {
	const { id } = req.params

	await knex('tbl_comment').where('cmt_id', id).del().catch((error) => {
		return res.status(500).json({
            message : error,
			statusCode: errorCode
		})
	})

	return res.status(200).json({
		statusCode: successCode
	})
})
module.exports = router;