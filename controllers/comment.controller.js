const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');
const validator = require('../middlewares/validation/comment.validate')
const successCode = 0
const errorCode = 1

router.get('/list', async (req, res) => {
    const {productID} = req.query; 

	const result = await knex.select('cmt_id', 'cmt_content', 'cmt_product_id', 'cmt_vote', 'acc_id', 'acc_username', 'cmt_created_date').from('tbl_comment')
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


router.post('/add', validator.newComment,async (req, res) => {
	const { productID, accountID, content, vote } = req.body
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