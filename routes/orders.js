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



//获取当天订单和总订单
router.get("/orderNum",function(req,res,next){
	let orderCount=0;
	let dayOneOrder=0;
	let dayTwoOrder=0;
	let dayThreeOrder=0;
	let dayFourOrder=0;
	let dayFiveOrder=0;
	let daySixOrder=0;
	
	let myDate = new Date();
	let FullYear = myDate.getFullYear();
	let Month = (myDate.getMonth()+1);
	Month = Month <10?'0'+Month:Mosnth;
	let Dates = myDate.getDate();
	let Dates1 = myDate.getDate()-1;
	let Dates2 = myDate.getDate()-2;
	let Dates3 = myDate.getDate()-3;
	let Dates4 = myDate.getDate()-4;
	let Dates5 = myDate.getDate()-5;
	let Dates6 = myDate.getDate()-6;
	
	myDate = FullYear+'-'+Month+'-'+Dates
	myDate1 = FullYear+'-'+Month+'-'+Dates1
	myDate2 = FullYear+'-'+Month+'-'+Dates2
	myDate3 = FullYear+'-'+Month+'-'+Dates3
	myDate4 = FullYear+'-'+Month+'-'+Dates4
	myDate5 = FullYear+'-'+Month+'-'+Dates5
	myDate6 = FullYear+'-'+Month+'-'+Dates6
	console.log(myDate);
	console.log(myDate1);
	console.log(myDate2);
	console.log(myDate3);
	console.log(myDate4);
	console.log(myDate5);
	console.log(myDate6);
	
	const reg = new RegExp(myDate, 'i')
	const reg6 = new RegExp(myDate1, 'i')
	const reg5 = new RegExp(myDate2, 'i')
	const reg4 = new RegExp(myDate3, 'i')
	const reg3 = new RegExp(myDate4, 'i')
	const reg2 = new RegExp(myDate5, 'i')
	const reg1 = new RegExp(myDate6, 'i')
	
	orders.find({},function(err,doc){
		if(err){
			res.json({
				status: '1',
				msg: err.message
			})
		}else{
			if(doc){
				orderCount = doc.length
				//第一天订单
				orders.find({
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
						dayOneOrder = docc1.length;
						//第二天订单
						orders.find({
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
								dayTwoOrder = docc2.length;
								//第三天订单
								orders.find({
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
										dayThreeOrder = docc3.length;
										//第四天订单
										orders.find({
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
												dayFourOrder = docc4.length;
												//第五天订单
												orders.find({
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
														dayFiveOrder = docc5.length;
														//第六天订单
														orders.find({
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
																daySixOrder = docc6.length;
																//第七天订单
																orders.find({
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
																				orderCount    : orderCount,
																				dayOneOrder   : dayOneOrder,
																				dayTwoOrder   : dayTwoOrder,
																				dayThreeOrder : dayThreeOrder,
																				dayFourOrder  : dayFourOrder,
																				dayFiveOrder  : dayFiveOrder,
																				daySixOrder   : daySixOrder,
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
