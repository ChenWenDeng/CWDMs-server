var express = require('express');
var router = express.Router();

// var users = require('../models/users');
var users = require('../models/users');

var dates = require('./../util/time');

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


//获取当天用户和总用户数量
router.get('/usersNum',function(req,res,next){
	let userCount=0;
	
	let dayOneUser=0;
	let dayTwoUser=0;
	let dayThreeUser=0;
	let dayFourUser=0;
	let dayFiveUser=0;
	let daySixUser=0;

	let Dates  = new Date().getTime(); 
	let Dates1 = new Date().getTime()-(1000*60*60*24); 
	let Dates2 = new Date().getTime()-(1000*60*60*24*2); 
	let Dates3 = new Date().getTime()-(1000*60*60*24*3); 
	let Dates4 = new Date().getTime()-(1000*60*60*24*4); 
	let Dates5 = new Date().getTime()-(1000*60*60*24*5); 
	let Dates6 = new Date().getTime()-(1000*60*60*24*6);
	
	let myDate 	= dates.date(Dates)
	let myDate1 = dates.date(Dates1)
	let myDate2 = dates.date(Dates2)
	let myDate3 = dates.date(Dates3)
	let myDate4 = dates.date(Dates4)
	let myDate5 = dates.date(Dates5)
	let myDate6 = dates.date(Dates6)
	
	const reg = new RegExp(myDate, 'i')
	const reg6 = new RegExp(myDate1, 'i')
	const reg5 = new RegExp(myDate2, 'i')
	const reg4 = new RegExp(myDate3, 'i')
	const reg3 = new RegExp(myDate4, 'i')
	const reg2 = new RegExp(myDate5, 'i')
	const reg1 = new RegExp(myDate6, 'i')
	
	// const reg = new RegExp(myDate, 'i')
	users.find({},function(err,doc){
		if(err){
			res.json({
				status: '1',
				msg: err.message
			})
		}else{
			if(doc){
				userCount = doc.length
				//第一天订单
				users.find({
					$or:[
						{createDate : {$regex : reg1}}
					]
				},function(errs,docc1){
					if(errs){
						res.json({
							status:'1',
							msg:errs.message
						})
					}else{
						dayOneUser = docc1.length;
						//第二天订单
						users.find({
							$or:[
								{createDate : {$regex : reg2}}
							]
						},function(err2,docc2){
							if(err2){
								res.json({
									status:'1',
									msg:err2.message
								})
							}else{
								dayTwoUser = docc2.length;
								//第三天订单
								users.find({
									$or:[
										{createDate : {$regex : reg3}}
									]
								},function(err3,docc3){
									if(err3){
										res.json({
											status:'1',
											msg:err3.message
										})
									}else{
										dayThreeUser = docc3.length;
										//第四天订单
										users.find({
											$or:[
												{createDate : {$regex : reg4}}
											]
										},function(err4,docc4){
											if(err4){
												res.json({
													status:'1',
													msg:err4.message
												})
											}else{
												dayFourUser = docc4.length;
												//第五天订单
												users.find({
													$or:[
														{createDate : {$regex : reg5}}
													]
												},function(err5,docc5){
													if(err5){
														res.json({
															status:'1',
															msg:err5.message
														})
													}else{
														dayFiveUser = docc5.length;
														//第六天订单
														users.find({
															$or:[
																{createDate : {$regex : reg6}}
															]
														},function(err6,docc6){
															if(err6){
																res.json({
																	status:'1',
																	msg:err6.message
																})
															}else{
																daySixUser = docc6.length;
																//第七天订单
																users.find({
																	$or:[
																		{createDate : {$regex : reg}}
																	]
																},function(err1,docc){
																	if(err1){
																		res.json({
																			status:'1',
																			msg:err1.message
																		})
																	}else{
																		res.json({
																			status: '0',
																			msg: '',
																			result:{
																				count         : docc.length,
																				userCount    	: userCount,
																				dayOneUser   	: dayOneUser,
																				dayTwoUser    : dayTwoUser,
																				dayThreeUser : dayThreeUser,
																				dayFourUser  	: dayFourUser,
																				dayFiveUser  	: dayFiveUser,
																				daySixUser   	: daySixUser,
																			}
																		})
																		console.log(docc)
																	}
																})
															}
														})
													}
												})
											}
										})
									}
								})
							}
						})
					}
				})
			}
		}
	})
})

module.exports = router;
