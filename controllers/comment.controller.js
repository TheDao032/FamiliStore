const express = require('express')
const router = express.Router()
const knex = require('../utils/dbConnection')
const moment = require('moment');
const validator = require('../middlewares/validation/comment.validate')
const successCode = 0
const errorCode = 1

router.get('/list', validator.listComment, async (req, res) => {
	const { productID, page, limit } = req.body;


	if (page < 1 || limit < 1 || limit > 10) {
		return res.status(400).json({
			message: "limit and page parameter is not valid",
			statusCode: errorCode
		})
	}

	result = await knex.select('tbl_comment.cmt_id as review_id', 'tbl_comment.cmt_content as content', 'tbl_comment.cmt_vote as star', 'tbl_comment.cmt_acc_id as user_id', 'tbl_account.acc_email as user_name', 'tbl_account.acc_avatar as user_avatar', 'tbl_comment.cmt_create_date as createdAt').from('tbl_comment')
		.join('tbl_account', 'tbl_account.acc_id', '=', 'tbl_comment.cmt_acc_id')
		.where('tbl_comment.cmt_product_id', productID)
		.limit(limit)
		.offset((page - 1) * limit)
		.orderBy('tbl_comment.cmt_create_date', 'desc')
	var avgStar = await knex.raw(`select round(avg(cmt_vote),2) from tbl_comment where cmt_product_id = ${productID}`)
	var numberOneStar = await knex.raw(`select count(cmt_vote) from tbl_comment where cmt_product_id = ${productID} and cmt_vote = 1`)
	var numberTwoStars = await knex.raw(`select count(cmt_vote) from tbl_comment where cmt_product_id = ${productID} and cmt_vote = 2`)
	var numberThreeStars = await knex.raw(`select count(cmt_vote) from tbl_comment where cmt_product_id = ${productID} and cmt_vote = 3`)
	var numberFourStars = await knex.raw(`select count(cmt_vote) from tbl_comment where cmt_product_id = ${productID} and cmt_vote = 4`)
	var numberFiveStars = await knex.raw(`select count(cmt_vote) from tbl_comment where cmt_product_id = ${productID} and cmt_vote = 5`)

	var returnedObject = {
		avgStar: avgStar.rows[0].round,
		numberOneStar: numberOneStar.rows[0].count,
		numberTwoStars: numberTwoStars.rows[0].count,
		numberThreeStars: numberThreeStars.rows[0].count,
		numberFourStars: numberFourStars.rows[0].count,
		numberFiveStars: numberFiveStars.rows[0].count,
		commentList: result
	}



	if (result) {
		return res.status(200).json({
			listComment: returnedObject,
			statusCode: successCode
		})
	}

	return res.status(500).json({
		listComment: [],
		statusCode: errorCode
	})
})


router.post('/add', validator.newComment, async (req, res) => {
	const { productID, accountID, content, vote } = req.body
	var acc = await knex('tbl_account').where('acc_id', accountID)
	var prod = await knex('tbl_product').where('prod_id', productID)

	if (acc.length === 0) {
		return res.status(400).json({
			message: "account doesn't exist",
			statusCode: errorCode
		})
	}

	if (prod.length === 0) {
		return res.status(400).json({
			message: "product doesn't exist",
			statusCode: errorCode
		})
	}

	var regex = new RegExp('[0-5]')
	var isValid = regex.test(vote)
	if (!isValid) {
		return res.status(400).json({
			message: "vote value is not valid, need to be from 0 to 5",
			statusCode: errorCode
		})
	}

	await knex('tbl_comment').insert({
		cmt_product_id: productID,
		cmt_acc_id: accountID,
		cmt_content: content,
		cmt_vote: vote,
		cmt_create_date: moment().format('YYYY-MM-DD HH:mm:ss')
	})

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/update', validator.updateComment, async (req, res) => {
	const { commentID, accountID, content, vote } = req.body
	var comment = await knex('tbl_comment').where('cmt_id', commentID).andWhere('cmt_acc_id', accountID)

	if (comment.length === 0) {
		return res.status(400).json({
			message: "user cannot edit comment of another user or comment doesn't exist",
			statusCode: errorCode
		})
	}
	var regex = new RegExp('[0-5]')
	var isValid = regex.test(vote)
	if (!isValid) {
		return res.status(400).json({
			message: "vote value is not valid, need to be from 0 to 5",
			statusCode: errorCode
		})
	}

	if (vote != undefined && content != undefined) {
		if (vote == comment[0].cmt_vote && content == comment[0].cmt_content) {
			return res.status(400).json({
				message: "vote and content of new comment need to be different with the old one",
				statusCode: errorCode
			})
		}
	}

	await knex('tbl_comment').update({
		cmt_content: typeof content !== 'undefined' ? content : comment[0].cmt_content,
		cmt_vote: typeof vote !== 'undefined' ? vote : comment[0].cmt_vote,
		cmt_update_date: moment().format('YYYY-MM-DD HH:mm:ss')
	})
		.where('cmt_id', commentID)

	return res.status(200).json({
		statusCode: successCode
	})
})

router.post('/delete', validator.deleteComment, async (req, res) => {
	const { commentId, accountID } = req.query

	var comment = await knex('tbl_comment').where('cmt_id', id).andWhere('cmt_acc_id', accountID)
	if (comment.length === 0) {
		return res.status(400).json({
			message: "user cannot delete comment of another user",
			statusCode: errorCode
		})
	}
	await knex('tbl_comment').where('cmt_id', commentId).del().catch((error) => {
		return res.status(500).json({
			message: error,
			statusCode: errorCode
		})
	})

	return res.status(200).json({
		statusCode: successCode
	})
})
module.exports = router;