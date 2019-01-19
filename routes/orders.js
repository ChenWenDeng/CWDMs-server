var express = require('express');
var router = express.Router();

// var users = require('../models/users');
var orders = require('../models/orders');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//查询全部订单
router.post('/orderList',function(req,res,next){
	let page = req.body.page;
	let pageSize = req.body.pageSize;
	let skip = (page-1) * pageSize;
	let sort = -1 ;
	let orderCount = 0 ;
	console.log('page==='+page)
	console.log('pageSize==='+pageSize)
	console.log('skip==='+skip)
	let orderList = orders.find({},function(err,doc){
		if(err){
			res.json({
				status: '1',
				msg: err.message
			})
		}else{
			orderCount = doc.length;
			if(doc){
				orderList.skip(skip).limit(pageSize).sort({'createDate':sort}).exec(function(err1,doc1){
					if(err1){
						res.json({
							status: '1',
							msg: err1.message
						})
					}else{
						res.json({
							status: '0',
							msg: '',
							orderCount:orderCount,
							count: doc1.length,
							list:doc1,
						})
					}
				})
			}
		}
	})
})

//查询对应搜索的订单
router.post("/searchOrder",function(req,res,next){
	let searchName = req.body.searchName;
	let page        = req.body.page;
	let pageSize    = req.body.pageSize;
	let skip        = (page-1) * pageSize;
	let sort = -1 ; //排序
	let searchCount=0;//搜索商品总数
	console.log(searchName);
	console.log(page);
	console.log(pageSize);
	const reg = new RegExp(searchName, 'i')
	
	let searchOrder = orders.find({
		$or:[
			{orderId : {$regex : reg}},
			{userName : {$regex : reg}},
			{createDate : {$regex : reg}},
		],
	},function(err,doc){
		if(err){
			res.json({
				status: '1',
				msg: err.message
			})
		}else{
			searchCount = doc.length;
			console.log('searchCount==='+searchCount)
			if(doc){
				searchOrder.skip(skip).limit(pageSize).sort({'createDate':sort}).exec(function(err1,doc1){
					if(err1){
						res.json({
							status: '1',
							msg: err1.message
						})
					}else{
						res.json({
							status: '0',
							msg: '',
							searchCount:searchCount,
							count: doc1.length,
							list:doc1,
						})
					}
				})
			}
		}
	})
})

//删除订单接口
router.post("/delOrder",function(req,res,next){
	let orderId = req.body.orderId;
	console.log('orderId==='+orderId)
	orders.remove({orderId:orderId},function(err,doc){
		if (err) {
			res.json({
				status: '1',
				msg: err.massage,
				result: ''
			})
		} else {
			res.json({
				status: '0',
				msg: '',
				result: 'suc'
			})
		}
	})
})

//查询对应订单接口
router.post("/orderDetails",function(req,res,next){
	let orderId = req.body.orderId;
	console.log('orderId==='+orderId);
	orders.findOne({orderId:orderId},function(err,doc){
		if(err){
			res.json({
				status: '1',
				msg: err.message
			})
		}else{
			res.json({
				status: '0',
				msg: '',
				list:doc,
			})
		}
	})
})




module.exports = router;
