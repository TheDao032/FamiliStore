const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');
const validator = require('../middlewares/validation/comment.validate')
const successCode = 0
const errorCode = 1

router.get('/list', async (req, res) => {
    const {productID} = req.query; 
	//write ajv, write validate product ID
	/*
	const result = await knex.select('tbl_comment.cmt_id', 'tbl_comment.cmt_content', 'tbl_comment.cmt_product_id', 'tbl_comment.cmt_vote', 'tbl_comment.cmt_acc_id', 'tbl_account.acc_username', 'tbl_comment.cmt_create_date', 'tbl_comment.tbl_update_date').from('tbl_comment')
    .join('tbl_account', 'tbl_account.acc_id', '=', 'tbl_comment.cmt_acc_id')
    .where('tbl_comment.cmt_product_id', productID);
*/
	result = await knex.select('tbl_comment.cmt_id', 'tbl_comment.cmt_content', 'tbl_comment.cmt_product_id', 'tbl_comment.cmt_vote', 'tbl_comment.cmt_acc_id', 'tbl_account.acc_email', 'tbl_comment.cmt_create_date', 'tbl_comment.cmt_update_date').from('tbl_comment')
	.join('tbl_account', 'tbl_account.acc_id', '=', 'tbl_comment.cmt_acc_id')
	.where('tbl_comment.cmt_product_id', productID)
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


router.post('/add', validator.newComment,async (req, res) => {
	const { productID, accountID, content, vote } = req.body
	console.log(req.body)
    var regex = new RegExp('[0-5]')
    var isValid = regex.test(vote)
    if(!isValid){
        return res.status(400).json({
            message :"vote value is not valid, need to be from 0 to 5",
            statusCode : errorCode
        })
    }
    
	await knex('tbl_comment').insert({ 
        cmt_product_id: productID, 
        cmt_acc_id: accountID,
        cmt_content: content,
        cmt_vote: vote,
        cmt_create_date:moment().format('YYYY-MM-DD HH:mm:ss')
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