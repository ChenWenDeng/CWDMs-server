var express = require('express');
var router = express.Router();

// var users = require('../models/users');
var users = require('../models/users');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//获取全部用户接口
router.post('/userList',function(req,res,next){
	let page        = req.body.page;
	let pageSize    = req.body.pageSize;
	let skip        = (page-1) * pageSize;
	let sort = -1 ;
	let usersCount = 0;//搜索商品总数
	console.log('page==='+page);
	console.log('pageSize==='+pageSize);
	let usersList = users.find({},function(err,doc){
		if (err) {
			res.json({
				status: '1',
				msg: err.massage,
				result: ''
			})
		} else {
			usersCount = doc.length;
			if(doc){
				usersList.skip(skip).limit(pageSize).sort({'createDate':sort}).exec(function(err1,doc1){
					if(err1){
						res.json({
							status: '1',
							msg: err1.message
						})
					}else{
						res.json({
							status: '0',
							msg: '',
							usersCount:usersCount,
							count: doc1.length,
							list:doc1,
						})
					}
				})
			}
		}
	})
})

//搜索用户接口
router.post("/searchUser",function(req,res,next){
	let userName = req.body.userName;
	let page        = req.body.page;
	let pageSize    = req.body.pageSize;
	let skip        = (page-1) * pageSize;
	let sort = -1 ;
	let searchCount=0;//搜索商品总数
	console.log(userName);
	console.log(page);
	console.log(pageSize);
	const reg = new RegExp(userName, 'i')
	
	let searchGoods = users.find({
		$or:[
			{userName : {$regex : reg}},
			// {typeName : {$regex : reg}},
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
				searchGoods.skip(skip).limit(pageSize).sort({'createDate':sort}).exec(function(err1,doc1){
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


//删除用户接口
router.post("/delUser",function(req,res,next){
	let userId = req.body.userId;
	console.log('userId==='+userId)
	users.remove({userId:userId},function(err,doc){
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

module.exports = router;
